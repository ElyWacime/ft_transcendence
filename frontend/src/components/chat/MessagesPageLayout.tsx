import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { Socket } from 'socket.io-client'
import ChatSidebar from "./chat-sidebar"
import ChatWindow from "./chat-window"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost'
const SERVER_URL = API_URL

type MessagesPageLayoutProps = {
  conversations: any[]
  selectedId?: number
  setSelectedId: (id: number) => void
  messages: any[]
  onSendMessage: (content: string, conversationId: string) => void
  onGetHistory: (conversationId: number) => void
  isConnected: boolean
  currentUser?: any
  onFetchConversations: () => void
  blockedConversations: any
  onBlockConversation: (conversationId: number) => void
  onUnblockConversation: (conversationId: number) => void
  onCheckBlockStatus: (conversation: any) => void
  onCheckInvitationStatus: (conversation: any, invitationType: string) => void
  invitePrompt?: any
  onInvite: (conversation: any, invitationType: string) => void
  onRespondInvite: (accepted: boolean, invitationType: string) => void
  onCancelInvite: (conversation: any, invitationType: string) => void
  onCheckFriendshipStatus: (conversation: any) => void
  pendingInvite: boolean
  onUnfriend: (userId: number) => void
  pendingAddFriend: boolean
  friendsList: any
  socket?: Socket | null
}

export default function MessagesPageLayout ({ conversations, selectedId, setSelectedId, onUnfriend, friendsList, onCheckFriendshipStatus, pendingAddFriend, messages, onSendMessage, onGetHistory, isConnected, currentUser, onFetchConversations, blockedConversations, onBlockConversation, onUnblockConversation, onCheckBlockStatus, onCheckInvitationStatus, onCancelInvite, invitePrompt, onInvite, onRespondInvite, socket, pendingInvite }: MessagesPageLayoutProps) {
  const { id } = useParams()

  useEffect(() => {
    onFetchConversations()
  }, [])

  useEffect(() => {
    if (id) {
      setSelectedId(parseInt(id))
    }
  }, [id])

  const selectedConversation = conversations.find((c) => c.id === selectedId)
  const blockStatus = selectedConversation ? blockedConversations[selectedConversation.id] : null
  const friendstatus = selectedConversation ? friendsList[selectedConversation.other_user_id] : null
  const isFriend = friendstatus?.isFriend ?? false
  const isBlocked = blockStatus?.blocked ?? false
  const blockedBy = blockStatus?.blockedBy ?? null
  const canUnblock = isBlocked && blockedBy === 'you'
  const incomingInvite = selectedConversation && invitePrompt?.conversationId === selectedConversation.id ? invitePrompt : null

  useEffect(() => {
    if (!selectedConversation || !onCheckBlockStatus) return
    const cachedBlockingStatus = blockedConversations?.[selectedConversation.id]
    const cachedFriendshipStatus = friendsList?.[selectedConversation.other_user_id]
    if (!cachedBlockingStatus) {
      onCheckBlockStatus(selectedConversation)
    }
    if (!cachedFriendshipStatus) {
      onCheckFriendshipStatus(selectedConversation)
    }
    onCheckInvitationStatus(selectedConversation, "friend_request")
    onCheckInvitationStatus(selectedConversation, "game_request")
  }, [selectedConversation, blockedConversations, friendsList])


  const handleStartConversation = async (userId: number) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/chat/conversation/start`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receipentId: userId })
      })
      const data = await res.json()
      if (data.conversationId) {
        socket.emit("newConversation", { userId })
        await onFetchConversations()
        setSelectedId(data.conversationId)
      }
    } catch (error) {
      console.error('Failed to start conversation:', error)
    }
  }

  return (
    <div className="chat-page-wrapper">
      <div className="chat-container">
        <ChatSidebar
          conversations={conversations}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          onStartConversation={handleStartConversation}
        />
        <ChatWindow 
          onUnfriend={onUnfriend}
          conversation={selectedConversation}
          messages={messages} 
          onSendMessage={onSendMessage}
          onGetHistory={onGetHistory}
          isConnected={isConnected}
          currentUser={currentUser}
          isBlocked={isBlocked}
          isFriend={isFriend}
          blockedBy={blockedBy}
          canUnblock={canUnblock}
          incomingInvite={incomingInvite}
          onInvite={onInvite}
          pendingAddFriend={pendingAddFriend}
          onRespondInvite={onRespondInvite}
          onBlockConversation={onBlockConversation}
          onUnblockConversation={onUnblockConversation}
          pendingInvite={pendingInvite}
          socket={socket}
          onCancelInvite={onCancelInvite}
        />
      </div>
    </div>
  )
}
