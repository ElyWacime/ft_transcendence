import ChatSidebar from "./chat-sidebar"
import ChatWindow from "./chat-window"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { Socket } from 'socket.io-client'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost'
const SERVER_URL = API_URL

type MessagesPageLayoutProps = {
  conversations: any[]
  selectedId?: number
  setSelectedId: (id: number) => void
  messages: any[]
  setMessages: (messages: any[]) => void
  onSendMessage: (content: string, conversationId: string) => void
  onGetHistory: (conversationId: number) => void
  isConnected: boolean
  currentUser?: any
  isEmpty: boolean
  onFetchConversations: () => void
  blockedConversations: any
  onBlockConversation: (conversationId: number) => void
  onUnblockConversation: (conversationId: number) => void
  onCheckBlockStatus: (conversation: any) => void
  invitePrompt?: any
  onInvite: (conversation: any) => void
  onRespondInvite: (accepted: boolean) => void
  socket?: Socket | null
}

export default function MessagesPageLayout ({ conversations, selectedId, setSelectedId, messages, setMessages, onSendMessage, onGetHistory, isConnected, currentUser, isEmpty, onFetchConversations, blockedConversations, onBlockConversation, onUnblockConversation, onCheckBlockStatus, invitePrompt, onInvite, onRespondInvite, socket }: MessagesPageLayoutProps) {
  const { id } = useParams()

  useEffect(() => {
    onFetchConversations()
  }, [onFetchConversations])

  useEffect(() => {
    if (id) {
      setSelectedId(parseInt(id))
    }
  }, [id, setSelectedId])

  const selectedConversation = conversations.find((c) => c.id === selectedId)
  const blockStatus = selectedConversation ? blockedConversations[selectedConversation.id] : null
  const isBlocked = blockStatus?.blocked ?? false
  const blockedBy = blockStatus?.blockedBy ?? null
  const canUnblock = isBlocked && blockedBy === 'you'
  const incomingInvite = selectedConversation && invitePrompt?.conversationId === selectedConversation.id ? invitePrompt : null

  useEffect(() => {
    if (selectedConversation && onCheckBlockStatus) {
      onCheckBlockStatus(selectedConversation)
    }
  }, [selectedConversation, onCheckBlockStatus])

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
        await onFetchConversations()
        setSelectedId(data.conversationId)
      }
    } catch (error) {
      console.error('Failed to start conversation:', error)
    }
  }

  return (
    <div className="page-wrapper">
      <div className="chat-container">
        <ChatSidebar
          conversations={conversations}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          onStartConversation={handleStartConversation}
        />
        <ChatWindow 
          selectedId={selectedId}
          conversation={isEmpty ? null : selectedConversation}
          messages={messages} 
          setMessages={setMessages} 
          onSendMessage={onSendMessage}
          onGetHistory={onGetHistory}
          isConnected={isConnected}
          currentUser={currentUser}
          isBlocked={isBlocked}
          blockedBy={blockedBy}
          canUnblock={canUnblock}
          incomingInvite={incomingInvite}
          onInvite={onInvite}
          onRespondInvite={onRespondInvite}
          onBlockConversation={onBlockConversation}
          onUnblockConversation={onUnblockConversation}
          socket={socket}
        />
      </div>
    </div>
  )
}
