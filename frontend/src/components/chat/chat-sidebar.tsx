"use client"
import { useState, useEffect } from "react"


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost'
const SERVER_URL = API_URL

type ChatSidebarProps = {
  conversations: any[]
  selectedId?: number
  setSelectedId: (id: number) => void
  onStartConversation?: (userId: number) => void
}

export default function ChatSidebar({ conversations, selectedId, setSelectedId, onStartConversation }: ChatSidebarProps) {
  const [showSearch, setShowSearch] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [searchResult, setSearchResult] = useState<any>(null)
  const [searchError, setSearchError] = useState<string | null>(null)

  useEffect(() => {
  }, [showSearch])

  const searchUser = async () => {
    if (!searchInput.trim()) {
      setSearchResult(null)
      setSearchError(null)
      return
    }

    setLoading(true)
    setSearchError(null)
    try {
      const res = await fetch(`${SERVER_URL}/api/chat/getUser`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: searchInput.trim() })
      })
      const data = await res.json()

      if (res.ok) {
        setSearchResult(data)
      } else {
        setSearchError(data.error || 'User not found')
        setSearchResult(null)
      }
    } catch (error) {
      console.error('Failed to search user:', error)
      setSearchError('Failed to search user')
      setSearchResult(null)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchUser()
    } else if (e.key === 'Escape') {
      setShowSearch(false)
    }
  }

  const handleUserSelect = () => {
    if (!searchResult || searchResult.isSelf) return
    if (onStartConversation) {
      onStartConversation(searchResult.user_id || searchResult.userId || searchResult.id)
    }
    setShowSearch(false)
    setSearchInput("")
    setSearchResult(null)
    setSearchError(null)
  }

  const formatTime = (dateString: string) => {
    const messageDate = new Date(dateString)
    const today = new Date()
    
    const isSameDay = 
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear()
    
    if (isSameDay) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else {
      const month = String(messageDate.getMonth() + 1).padStart(2, '0')
      const day = String(messageDate.getDate()).padStart(2, '0')
      return `${day} / ${month}`
    }
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>Messages</h1>
        <button className="new-chat-btn" onClick={() => setShowSearch(!showSearch)}>+</button>
      </div>

      {showSearch ? (
        <div className="search-section">
          <input
            type="text"
            placeholder="Search users..."
            className="search-input"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyPress}
            autoFocus
          />
          {loading ? (
            <div className="search-loading">Searching...</div>
          ) : searchError ? (
            <div className="search-empty">{searchError}</div>
          ) : searchResult ? (
            searchResult.isSelf ? (
              <div className="search-empty">{searchResult.message}</div>
            ) : (
              <div className="users-list">
                <div className="user-item" onClick={handleUserSelect}>
                  <div className="user-name">{searchResult.username}</div>
                </div>
              </div>
            )
          ) : (
            <div className="search-empty">Type a username and press Enter</div>
          )}
        </div>
      ) : (
        <div className="conversations-list">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`conversation-item ${selectedId === conversation.id ? "active" : ""}`}
              onClick={() =>  setSelectedId(conversation.id)}
            >
              <div className="conversation-info">
                <div className="conversation-name">{conversation.other_user_username}</div>
                <div className="conversation-preview">{conversation.last_message_body}</div>
              </div>
              <div className="conversation-time">{formatTime(conversation.last_message_created_at || conversation.created_at)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
