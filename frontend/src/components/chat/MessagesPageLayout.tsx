import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { Socket } from 'socket.io-client'
import ChatSidebar from "./chat-sidebar"
import ChatWindow from "./chat-window"
import { useAuth } from "@/context/AuthContext"

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
  pendingInvitations: any
  onBlockConversation: (conversationId: number) => void
  onUnblockConversation: (conversationId: number) => void
  onCheckBlockStatus: (conversation: any) => void
  onCheckInvitationStatus: (conversation: any, invitationType: string) => void
  invitePrompt?: any
  onInvite: (conversation: any, invitationType: string) => void
  onRespondInvite: (accepted: boolean, invitationType: string) => void
  onCancelInvite: (conversation: any, invitationType: string) => void
  onUnfriend: (conversation: any) => void
  friendsList: any
  socket?: Socket | null
}

export default function MessagesPageLayout ({ conversations, selectedId, setSelectedId, onUnfriend, friendsList, messages, onSendMessage, onGetHistory, isConnected, currentUser, onFetchConversations, blockedConversations, pendingInvitations, onBlockConversation, onUnblockConversation, onCheckBlockStatus, onCheckInvitationStatus, onCancelInvite, invitePrompt, onInvite, onRespondInvite, socket }: MessagesPageLayoutProps) {
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
  const isOnline = friendstatus?.online ?? false
  const isBlocked = blockStatus?.blocked ?? false
  const blockedBy = blockStatus?.blockedBy ?? null
  const canUnblock = isBlocked && blockedBy === 'you'
  const incomingInvite = selectedConversation && invitePrompt?.conversationId === selectedConversation.id ? invitePrompt : null
  const conversationPendingStatus = selectedConversation ? pendingInvitations[selectedConversation.id] : null
  const pendingGameRequest = conversationPendingStatus?.game_request ?? false
  const pendingFriendRequest = conversationPendingStatus?.friend_request ?? false

  useEffect(() => {
    if (!selectedConversation || !onCheckBlockStatus) return
    const cachedBlockingStatus = blockedConversations?.[selectedConversation.id]
    const cachedInvitationStatus  = pendingInvitations?.[selectedConversation.id]
    if (!cachedBlockingStatus) {
      onCheckBlockStatus(selectedConversation)
    }
    if (!cachedInvitationStatus) {
      onCheckInvitationStatus(selectedConversation, "friend_request")
      onCheckInvitationStatus(selectedConversation, "game_request")
    }
  }, [selectedConversation])

  const handleStartConversation = async (userId: number) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/chat/conversations/start`, {
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
          friendsList={friendsList}
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
          isOnline={isOnline}
          blockedBy={blockedBy}
          canUnblock={canUnblock}
          incomingInvite={incomingInvite}
          onInvite={onInvite}
          pendingAddFriend={pendingFriendRequest}
          onRespondInvite={onRespondInvite}
          onBlockConversation={onBlockConversation}
          onUnblockConversation={onUnblockConversation}
          pendingInvite={pendingGameRequest}
          socket={socket}
          onCancelInvite={onCancelInvite}
        />
      </div>
    </div>
  )
}
