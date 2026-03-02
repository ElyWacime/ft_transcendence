import { fetchWithAuth } from "@/lib/tokenRefresh"
import { useState, useRef, useEffect } from "react"
import type { KeyboardEvent } from 'react'
import { useParams } from "react-router-dom"
import { Socket } from 'socket.io-client'


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost'
const SERVER_URL = API_URL

type ChatWindowProps = {
  conversation?: any
  messages: any[]
  onSendMessage: (content: string, conversationId: string) => void
  onGetHistory: (conversationId: number) => void
  isConnected: boolean
  currentUser?: any
  isBlocked: boolean
  isFriend: boolean
  isOnline: boolean
  blockedBy?: string | null
  canUnblock: boolean
  incomingInvite?: any
  onInvite?: (conversation: any, invitationType: string) => void
  onRespondInvite?: (accepted: boolean, invitationType: string) => void
  onCancelInvite?: (conversation: any, invitationType: string) => void
  onBlockConversation?: (conversationId: number) => void
  onUnblockConversation?: (conversationId: number) => void
  onAddFriend?: (userId: number) => void
  onUnfriend?: (conversation: any) => void
  pendingInvite: boolean
  pendingAddFriend: boolean
  socket?: Socket | null
}

export default function ChatWindow({ conversation, messages, onSendMessage,  isFriend, isOnline, pendingAddFriend, onGetHistory, isConnected, currentUser, isBlocked, blockedBy, canUnblock, incomingInvite, onInvite, onRespondInvite, onCancelInvite, onBlockConversation, onUnblockConversation, onAddFriend, onUnfriend, socket, pendingInvite}: ChatWindowProps) {
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { id } = useParams()
  const activeConversationId = id ? parseInt(id, 10) : null


  useEffect(() => {
    if (activeConversationId) {
      onGetHistory(activeConversationId)
    }
  }, [activeConversationId, id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, activeConversationId])

  const handleBlockToggle = async () => {
    if (!activeConversationId || !conversation?.other_user_id) return
    if (isBlocked && !canUnblock) return
    
    try {
      const endpoint = canUnblock ? '/unblock' : '/block'
      const response = await fetchWithAuth(`${SERVER_URL}/api/chat${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: conversation.other_user_id })
      })

      const res = await response.json()
      
      if (response.ok) {
        if (canUnblock) {
          onUnblockConversation?.(activeConversationId)
          socket?.emit('blockStatusChanged', {
            conversationId: activeConversationId,
            otherUserId: conversation.other_user_id,
            blockedBy: null
          })
        } else {
          onBlockConversation?.(activeConversationId)
          socket?.emit('blockStatusChanged', {
            conversationId: activeConversationId,
            otherUserId: conversation.other_user_id,
            blockedBy: 'other'
          })
        }
      } else {
        console.error('Failed to block/unblock user')
      }
      
    } catch (error) {
      console.error('Error toggling block status:', error)
    }
  }

  const handleSend = () => {
    if (isBlocked) return
    if (inputValue.trim() && id && isConnected) {
      onSendMessage(inputValue, id)
      setInputValue("")
    }
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!activeConversationId || !conversation) {
    return (
      <div className="chat-window">
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <h2>Select a conversation</h2>
        </div>
      </div>
    )
  }

  const peerName = conversation.other_user_username
  const userProfileLink = `/dashboard/${peerName}`
  const filteredMessages = activeConversationId
    ? messages.filter((message) => {
        const messageConversationId = message.conversation_id ?? message.conversationId
        return messageConversationId === activeConversationId
      })
    : []

  return (
    <div className="chat-window">
      <div className="window-header">
        <div className="header-title">
          <div className="header-title-row">
            <a className="chat-peer-link" href={userProfileLink} aria-label={`Open chat with ${peerName}`}>
              {peerName}
            </a>
            
            {isFriend && <div className={`online-indicator ${isOnline ? "online" : "offline"}`}>{isOnline ? "Online" : "Offline"} </div>}
          </div>
        </div>
        <div className="header-actions">
          {incomingInvite?.invitationType === "friend_request" ? (
            <>
              <button 
                className="add-friend-button" 
                onClick={() => onRespondInvite(true, "friend_request")}
                disabled={!activeConversationId || isBlocked}
              >
                Accept
              </button> 
              <button 
                className="add-friend-button warning-button" 
                onClick={() => onRespondInvite(false, "friend_request")}
                disabled={!activeConversationId || isBlocked}
              >
                Deny
              </button>            
            </>
          ) : isFriend ? (
            <button 
              className="add-friend-button warning-button" 
              onClick={() => conversation?.other_user_id && onUnfriend?.(conversation)}
              disabled={!activeConversationId || isBlocked}
            >
              Unfriend
            </button>
          ) : (
            <button 
              className={`add-friend-button ${pendingAddFriend ? "warning-button" : ""}`} 
              onClick={() => conversation && (pendingAddFriend ? onCancelInvite : onInvite)(conversation, "friend_request")}
              disabled={!activeConversationId || isBlocked}
            >
              {pendingAddFriend ? "Cancel" : "Add friend"}
            </button>
          )}

          <button
            className={`block-button ${isBlocked ? "blocked" : ""}`}
            onClick={handleBlockToggle}
            disabled={!activeConversationId || (isBlocked && !canUnblock)}
          >
            {canUnblock ? "Unblock" : "Block"}
          </button>
        </div>
      </div>

        
      {isFriend && !isBlocked &&  <div className="invite-bar">
        {incomingInvite  && incomingInvite.invitationType === "game_request" ? (
          <div className="invite-actions">
            <span className="invite-text-inline">ready to play!</span>
            <button className="invite-accept" disabled={!isOnline}  onClick={() => onRespondInvite(true, "game_request")}>Accept</button>
            <button className="invite-deny" onClick={() => onRespondInvite(false, "game_request")}>Deny</button>
          </div>
        ) : (
          <>
            <button
              className="invite-button"
              disabled={!isConnected || isBlocked || pendingInvite}
              onClick={() => conversation && onInvite(conversation, "game_request")}
            >
              {(pendingInvite)? "Pending Invite.." : "Invite to Play"}
            </button>
            {(pendingInvite) && <button onClick={() => onCancelInvite(conversation, "game_request")} className="block-button warning-button">cancel</button>}
          </>
        )}
      </div>}
      

      {isBlocked && blockedBy === 'you' && (
        <div className="blocked-banner">
          You blocked this user. Messages remain visible, but sending is disabled until you unblock.
        </div>
      )}

      {isBlocked && blockedBy === 'other' && (
        <div className="blocked-banner blocked-by-other">
          This user has blocked you. You cannot send messages or block them back.
        </div>
      )}

      <div className="messages-container">
        {filteredMessages.map((message) => {
          const senderId = message.sender_id 
          const isOwnMessage = senderId === currentUser?.id
          const formatTime = (timestamp: string) => {
            if (!timestamp) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            const date = new Date(timestamp)
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
          return (
            <div key={message.id} className={`message ${isOwnMessage ? "user-message" : "other-message"}`}>
              <div className="message-bubble">{message.body}</div>
              <span className="message-time">{formatTime(message.created_at)}</span>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area"  >
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="message-input"
          rows={1}
          disabled={isBlocked}
        />
        <button onClick={handleSend} className="send-button" disabled={isBlocked}>
          Send
        </button>
      </div>
    </div>
  )
}
