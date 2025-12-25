"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { MessageCircle } from "lucide-react"

const SERVER_URL = 'http://localhost:3700'

// Hardcoded users
const ALL_USERS = [
  { id: "cmjh46n870000o63aonpxd8se", username: 'wewe' },
  { id: "cmjjztwxk0000mr3awprdgiky", username: 'joe' },
  { id: "cmjkgqgli0000oe3acuw5l992", username: 'jil' },
]

export default function Home({ onConversationCreated }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Get user ID from cookies
  const getUserIdFromCookie = () => {
    const name = 'user_id='
    const decodedCookie = decodeURIComponent(document.cookie)
    const cookieArray = decodedCookie.split(';')
    for (let cookie of cookieArray) {
      cookie = cookie.trim()
      if (cookie.indexOf(name) === 0) {
        return parseInt(cookie.substring(name.length))
      }
    }
    return null
  }

  useEffect(() => {
    const userId = getUserIdFromCookie()
    // Filter out current user from all users
    const otherUsers = ALL_USERS.filter(u => u.id !== userId)
    setUsers(otherUsers)
  }, [])

  const handleStartConversation = async (recipientId) => {
    setLoading(true)
    try {
      const res = await fetch(`${SERVER_URL}/conversation/start`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receipentId: recipientId })
      })
      const data = await res.json()
      
      if (data.conversationId) {
        // Refetch conversations to update sidebar
        if (onConversationCreated) {
          await onConversationCreated()
        }
        navigate(`/chat/${data.conversationId}`)
      }
    } catch (error) {
      console.error('Failed to start conversation:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-header">
          <h1>Chat App</h1>
          <p>Select a user to start chatting</p>
        </div>

        <div className="users-grid">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <div className="user-avatar">
                {user.username?.[0]?.toUpperCase() || '?'}
              </div>
              <h3>{user.username}</h3>
              <button
                onClick={() => handleStartConversation(user.id)}
                disabled={loading}
                className="message-btn"
              >
                <MessageCircle className="w-4 h-4" />
                Message
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
