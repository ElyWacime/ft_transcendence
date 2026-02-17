import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { io, Socket } from 'socket.io-client'
import "../components/chat/App.css"
import MessagesPageLayout from "../components/chat/MessagesPageLayout"


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost'
const SERVER_URL = API_URL

export default function Chat() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedId, setSelectedId] = useState<number>()
  const [messages, setMessages] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [blockedConversations, setBlockedConversations] = useState<any>({})
  const [invitePrompt, setInvitePrompt] = useState<any>(null)
  const [pendingInvite, setPerndingInvite] = useState<boolean>(false)
  const navigate = useNavigate()


  useEffect(() => {
    console.log({conversations})
  }, [conversations])

  let invitehandel = async (P1,P2) => 
  {
    const res = await fetch(`http://${import.meta.env.VITE_DOMAIN}:3000/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: localStorage.getItem("token"), P1 ,P2 }),
    });
    return res;
  }
  
  useEffect(() => {
    let newSocket: Socket | null = null;
    const te = async () => {
      const res = await fetch(`${SERVER_URL}/api/chat/getCookieValue`, { credentials: 'include' })
      const usercookie = await res.json()

      const userId = usercookie.user_id
      setCurrentUser({ id: userId })

      newSocket = io(SERVER_URL);     
      setSocket(newSocket)

      newSocket.on('connect', () => {
        setIsConnected(true);
        newSocket.emit('authenticate', userId)
      })

      newSocket.on('disconnect', () => {
        setIsConnected(false)
      })

      newSocket.on("newConversation", async () => {
        await fetchConversations()
      })

      newSocket.on('receiveMessage', (message: any) => {
        setMessages(prev => {
          return [...prev, message]
        })

        setConversations(prev => prev.map(conv => {
          if (conv.id === message.conversation_id) {
            return {
              ...conv,
              last_message_body: message.body,
              last_message_created_at: message.created_at
            }
          }
          return conv
        }))
      })
  
      newSocket.on('blockStatusChanged', (data: any) => {
        const { conversationId, blockedBy } = data
        if (blockedBy === 'other') {
          setBlockedConversations((prev: any) => ({
            ...prev,
            [conversationId]: { blocked: true, blockedBy: 'other' }
          }))
        } else if (blockedBy === null) {
          setBlockedConversations((prev: any) => {
            const updated = { ...prev }
            delete updated[conversationId]
            return updated
          })
        }
        setInvitePrompt(null)
        setPerndingInvite(false)
      })

      newSocket.on('gameInvite', (data: any) => {        
        setInvitePrompt(data)
      })

      newSocket.on('cancelInvite', () => {
        setInvitePrompt(null)
      })

      newSocket.on('gameInviteResponse', (data: any) => {
        if (data.accepted) {
          navigate(`/loading?mode=2`);
        }
        setPerndingInvite(false)
      })
    }
    te();
    return ()=>{
      if (newSocket)
      newSocket.close();
    }
  }, [])

  useEffect(() => {
    if (selectedId)
      navigate(`/chat/${selectedId}`)
  }, [selectedId, navigate])

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/chat/conversations`, { credentials: 'include' })
      const conversationsData = await res.json()
      setConversations(conversationsData)
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    }
  }

  const handleSendMessage = (content: string, conversationId: string) => {
    if (!socket || !isConnected) {
      console.error('Not connected to socket server')
      return
    }

    socket.emit('sendMessage', {
      conversationId: conversationId,
      content: content
    })
  }

  const sendInvite = (conversation: any) => {
    if (!socket || !isConnected || !conversation?.other_user_id) return

    socket.emit('gameInvite', {
      conversationId: conversation.id,
      toUserId: conversation.other_user_id,
      fromUserId: currentUser?.id,
    })
    setPerndingInvite(true);
  }

  const cancelInvite = (conversation: any) => {
    if (!socket || !isConnected || !conversation?.other_user_id) return

    socket.emit('cancelInvite', {
      toUserId: conversation.other_user_id,
    })
    setPerndingInvite(false);
  }

  const respondInvite = async (accepted: boolean) => {
    if (!socket || !invitePrompt) return
    try 
    {
      let res = await invitehandel(invitePrompt.fromUserId,  currentUser.id );
      socket.emit('gameInviteResponse', {
            conversationId: invitePrompt.conversationId,
            toUserId: invitePrompt.fromUserId,
            fromUserId: currentUser.id,
            accepted,
      })

      if (accepted && res.ok) {
          navigate(`/loading?mode=2`);
      }
    }
    catch (e)
    {
      console.log("catch Error" ,e);
    }
    setInvitePrompt(null)
  }

  const getChatHistory = async (conversationId: number) => {
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
  }

  const handleBlockConversation = (conversationId: number) => {
    setBlockedConversations((prev: any) => ({ ...prev, [conversationId]: { blocked: true, blockedBy: 'you' } }))
    setInvitePrompt(null)
    setPerndingInvite(false)
  }

  const handleUnblockConversation = (conversationId: number) => {
    setBlockedConversations((prev: any) => {
      const updated = { ...prev }
      delete updated[conversationId]
      return updated
    })
  }

  const checkBlockStatus = async (conversation: any) => {
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
          setBlockedConversations((prev: any) => ({
            ...prev,
            [conversation.id]: { blocked: true, blockedBy: data.blockedBy }
          }))
        } else {
          setBlockedConversations((prev: any) => {
            const updated = { ...prev }
            delete updated[conversation.id]
            return updated
          })
        }
      }
    } catch (error) {
      console.error('Failed to check block status:', error)
    }
  }

  return (
    <MessagesPageLayout 
      conversations={conversations}
      selectedId={selectedId}
      setSelectedId={setSelectedId}
      messages={messages}
      onSendMessage={handleSendMessage}
      onGetHistory={getChatHistory}
      isConnected={isConnected}
      currentUser={currentUser}
      onFetchConversations={fetchConversations}
      blockedConversations={blockedConversations}
      onBlockConversation={handleBlockConversation}
      onUnblockConversation={handleUnblockConversation}
      onCheckBlockStatus={checkBlockStatus}
      invitePrompt={invitePrompt}
      onInvite={sendInvite}
      onCancelInvite={cancelInvite}
      onRespondInvite={respondInvite}
      pendingInvite={pendingInvite}
      socket={socket}
    />
  )
}
