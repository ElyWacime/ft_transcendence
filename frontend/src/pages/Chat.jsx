import { useEffect, useState, useCallback } from "react"
import "../components/chat/App.css"
import { useNavigate } from "react-router-dom"
import MessagesPageLayout from "../components/chat/MessagesPageLayout"
import { io } from 'socket.io-client';


const API_URL = import.meta.env.VITE_API_URL || 'http://10.30.239.32';
const SERVER_URL = API_URL


export default function Chat() {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [conversations, setConversations] = useState([])
  const [selectedId, setSelectedId] = useState()
  const [messages, setMessages] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [blockedConversations, setBlockedConversations] = useState({})
  const [invitePrompt, setInvitePrompt] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const te = async () => {
      const res = await fetch(`${SERVER_URL}/api/chat/getCookieValue`, { credentials: 'include' })
      const usercookie = await res.json()

      const userId = usercookie.user_id
      setCurrentUser({ id: userId })

      const newSocket = io(SERVER_URL)
      setSocket(newSocket)

      newSocket.on('connect', () => {
        setIsConnected(true)
        newSocket.emit('authenticate', userId)
      })

      newSocket.on('disconnect', () => {
        setIsConnected(false)
      })

      newSocket.on('receiveMessage', (message) => {
        setMessages(prev => {
          return [...prev, message]
        })

        setConversations(prev => prev.map(conv => {
          if (conv.id === message.conversation_id) {
            return {
              ...conv,
              last_message_body: message.body,
              last_message_created_at: message.created_at || conv.last_message_created_at || conv.created_at,
            }
          }
          return conv
        }))
      })

      newSocket.on('messageError', (errorData) => {
        console.error('Message error:', errorData)
      })

      newSocket.on('blockStatusChanged', (data) => {
        const { conversationId, blockedBy } = data
        if (blockedBy === 'other') {
          setBlockedConversations((prev) => ({
            ...prev,
            [conversationId]: { blocked: true, blockedBy: 'other' }
          }))
        } else if (blockedBy === null) {
          setBlockedConversations((prev) => {
            const updated = { ...prev }
            delete updated[conversationId]
            return updated
          })
        }
      })

      newSocket.on('gameInvite', (data) => {
        setInvitePrompt(data)
      })

      newSocket.on('gameInviteResponse', (data) => {
        console.log('Invite response:', data)
        if (data.accepted) {
          navigate('/loading?mode=2')
        }
      })

      return () => newSocket.close()
    }

    te()
  }, [])

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/chat/conversations`, { credentials: 'include' })
      const conversationsData = await res.json()
      setConversations(conversationsData)
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    }
  }, [])

  useEffect(() => {
    if (selectedId)
      navigate(`/chat/${selectedId}`)
  }, [selectedId, navigate])

  const handleSendMessage = useCallback((content, conversationId) => {
    if (!socket || !isConnected) {
      console.error('Not connected to socket server')
      return
    }

    socket.emit('sendMessage', {
      conversationId: conversationId,
      content: content
    })
  }, [socket, isConnected])

  const sendInvite = useCallback((conversation) => {
    if (!socket || !isConnected || !conversation?.other_user_id) return
    socket.emit('gameInvite', {
      conversationId: conversation.id,
      toUserId: conversation.other_user_id,
      fromUserId: currentUser?.id,
      fromUsername: currentUser?.username || 'Someone'
    })
  }, [socket, isConnected, currentUser])

  const respondInvite = useCallback((accepted) => {
    if (!socket || !invitePrompt) return
    socket.emit('gameInviteResponse', {
      conversationId: invitePrompt.conversationId,
      toUserId: invitePrompt.fromUserId,
      accepted,
    })
    setInvitePrompt(null)
    if (accepted) {
      navigate('/loading?mode=2')
    }
  }, [socket, invitePrompt, navigate])

  const getChatHistory = useCallback(async (conversationId) => {
    if (!conversationId) {
      console.error('No conversation ID provided')
      return
    }
    try {
      const res = await fetch(`${SERVER_URL}/api/chat/conversations/${conversationId}/messages`, { credentials: 'include' })
      const historyData = await res.json()
      setMessages(historyData)
    } catch (error) {
      console.error('Failed to fetch chat history:', error)
    }
  }, [])

  const handleBlockConversation = useCallback((conversationId) => {
    setBlockedConversations((prev) => ({ ...prev, [conversationId]: { blocked: true, blockedBy: 'you' } }))
  }, [])

  const handleUnblockConversation = useCallback((conversationId) => {
    setBlockedConversations((prev) => {
      const updated = { ...prev }
      delete updated[conversationId]
      return updated
    })
  }, [])

  const checkBlockStatus = useCallback(async (conversation) => {
    if (!conversation?.id || !conversation?.other_user_id) return
    try {
      const res = await fetch(`${SERVER_URL}/api/chat/block/status`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: conversation.other_user_id })
      })
      const data = await res.json()
      if (res.ok) {
        if (data.blocked === true) {
          setBlockedConversations((prev) => ({
            ...prev,
            [conversation.id]: { blocked: true, blockedBy: data.blockedBy }
          }))
        } else {
          setBlockedConversations((prev) => {
            const updated = { ...prev }
            delete updated[conversation.id]
            return updated
          })
        }
      }
    } catch (error) {
      console.error('Failed to check block status:', error)
    }
  }, [])

  return (
    <MessagesPageLayout 
      conversations={conversations}
      selectedId={selectedId}
      setSelectedId={setSelectedId}
      messages={messages}
      setMessages={setMessages}
      onSendMessage={handleSendMessage}
      onGetHistory={getChatHistory}
      isConnected={isConnected}
      currentUser={currentUser}
      isEmpty={false}
      onFetchConversations={fetchConversations}
      blockedConversations={blockedConversations}
      onBlockConversation={handleBlockConversation}
      onUnblockConversation={handleUnblockConversation}
      onCheckBlockStatus={checkBlockStatus}
      invitePrompt={invitePrompt}
      onInvite={sendInvite}
      onRespondInvite={respondInvite}
      socket={socket}
    />
  )
}
