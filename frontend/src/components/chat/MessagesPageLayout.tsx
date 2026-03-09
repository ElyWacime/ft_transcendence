import { useEffect } from "react"
import { Socket } from 'socket.io-client'
import ChatSidebar from "./chat-sidebar"
import ChatWindow from "./chat-window"

type MessagesPageLayoutProps = {
  conversations: any[]
  selectedId?: number
  messages: any[]
  onSendMessage: (content: string, conversationId: string) => void
  onGetHistory: (conversationId: number) => void
  isConnected: boolean
  currentUser?: any
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

export default function MessagesPageLayout ({ conversations, selectedId, onUnfriend, friendsList, messages, onSendMessage, onGetHistory, isConnected, currentUser, blockedConversations, pendingInvitations, onBlockConversation, onUnblockConversation, onCheckBlockStatus, onCheckInvitationStatus, onCancelInvite, invitePrompt, onInvite, onRespondInvite, socket }: MessagesPageLayoutProps) {
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
    if (!selectedConversation) return
    if (!blockStatus) {
      onCheckBlockStatus(selectedConversation)
    }
    if (!conversationPendingStatus) {
      onCheckInvitationStatus(selectedConversation, "friend_request")
      onCheckInvitationStatus(selectedConversation, "game_request")
    }
  }, [selectedConversation])

  return (
    <div className="chat-page-wrapper">
      <div className="chat-container">
        <ChatSidebar
          conversations={conversations}
          selectedId={selectedId}
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