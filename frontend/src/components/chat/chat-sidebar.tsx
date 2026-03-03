import { Link } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost'
const SERVER_URL = API_URL

type ChatSidebarProps = {
  conversations: any[]
  selectedId?: number
  friendsList: any
}

export default function ChatSidebar({ conversations, selectedId, friendsList }: ChatSidebarProps) {
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
        <div className="conversations-list">
          {conversations.map((conversation) => {
              const friendstatus = friendsList[conversation.other_user_id] || null
              const isFriend = friendstatus?.isFriend ?? false
              const isOnline = friendstatus?.online ?? false
              return conversation.last_message_body &&  
              <Link
                key={conversation.id}
                className={`conversation-item ${selectedId === conversation.id ? "active" : ""}`}
                to={`/chat/${conversation.id}`}
              >
                <div className="conversation-info">
                  <div className="conversation-header">
                    <div className="conversation-name">{conversation.other_user_username}</div>
                    {isFriend && <div className={`status-dot ${isOnline ? "online" : "offline"}`}></div>}
                  </div>
                  <div className="conversation-preview">{conversation.last_message_body}</div>
                </div>
                <div className="conversation-time">{formatTime(conversation.last_message_created_at || conversation.created_at)}</div>
              </Link>
            }   
          )}
        </div>
    </div>
  )
}
