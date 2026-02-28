import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useChatSocket } from "../context/ChatSocketContext"
import "../components/chat/App.css"
import MessagesPageLayout from "../components/chat/MessagesPageLayout"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost'
const SERVER_URL = API_URL

let inviteHandle = async (P1, P2) => 
{
  const res = await fetch(`http://${import.meta.env.VITE_DOMAIN}:3000/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({token:localStorage.getItem("token") , P1 ,P2 }),
  });
  return res;
}

export default function Chat() {
  const { socket, isConnected, invitePrompt, setInvitePrompt, currentUser, pendingInvite, setPendingInvite } = useChatSocket()
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedId, setSelectedId] = useState<number>()
  const [messages, setMessages] = useState<any[]>([])
  const [blockedConversations, setBlockedConversations] = useState<any>({})
  const navigate = useNavigate()

  useEffect(() => {
    if (!socket) return

    const handleNewConversation = async () => {
      console.log("new conversation arrived")
      await fetchConversations()
    }

    const handleReceiveMessage = (message: any) => {
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
    }
    
    const handleBlockStatusChanged = (data: any) => {
      const { conversationId, blockedBy } = data
      if (blockedBy === 'other') {
        setBlockedConversations((prev: any) => ({
          ...prev,
          [conversationId]: { blocked: true, blockedBy: 'other' }
        }))
      } else if (blockedBy === null) {
        setBlockedConversations((prev: any) => ({
          ...prev,
          [conversationId]: { blocked: false, blockedBy: null }
        }))
      }
    }

    const handleGameInviteResponse = (data: any) => {
      setPendingInvite(false)
      if (data.accepted) {
        navigate(`/loading?mode=2`);
      }
    }


    socket.on("newConversation", handleNewConversation)
    socket.on('receiveMessage', handleReceiveMessage)
    socket.on('blockStatusChanged', handleBlockStatusChanged)
    socket.on('gameInviteResponse', handleGameInviteResponse)

    return () => {
      socket.off("newConversation", handleNewConversation)
      socket.off('receiveMessage', handleReceiveMessage)
      socket.off('blockStatusChanged', handleBlockStatusChanged)
      socket.off('gameInviteResponse', handleGameInviteResponse)
    }

  }, [socket, navigate])
  
  const fetchConversations = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/api/chat/conversations`, { credentials: 'include' })
        const conversationsData = await res.json()
        setConversations(conversationsData)
      } catch (error) {
        console.error('Failed to fetch conversations:', error)
      }
    }

  useEffect(() => {
    if (selectedId)
      navigate(`/chat/${selectedId}`)
  }, [selectedId, navigate])

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

  const sendInvite = async (conversation: any) => {
    if (!socket || !isConnected || !conversation?.other_user_id) return

    const response = await fetch(`${SERVER_URL}/api/chat/invite`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: conversation.other_user_id })
    })
    
    const re = await response.json()
      
    socket.emit('gameInvite', {
      conversationId: conversation.id,
      toUserId: conversation.other_user_id,
      fromUserId: currentUser?.id,
    })
    setPendingInvite(true)
  }

  const cancelInvite = async (conversation: any) => {
    if (!socket || !isConnected || !conversation?.other_user_id) return

    const response = await fetch(`${SERVER_URL}/api/chat/deleteInvite`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: conversation.other_user_id })
    })
    
    const re = await response.json()    



    socket.emit('cancelInvite', {
      toUserId: conversation.other_user_id,
    })
    setPendingInvite(false)
  }

  const respondInvite = async (accepted: boolean) => {
    if (!socket || !invitePrompt) return
    try 
    {
      let res = await inviteHandle(invitePrompt.fromUserId,  currentUser.id );
      socket.emit('gameInviteResponse', {
            conversationId: invitePrompt.conversationId,
            toUserId: invitePrompt.fromUserId,
            fromUserId: currentUser.id,
            accepted,
      })

      if (res.ok)
      {
          const response = await fetch(`${SERVER_URL}/api/chat/deleteInvite`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: invitePrompt.fromUserId })
          })
    
          if (accepted) {
            navigate(`/loading?mode=2`);
          }
      }
    }
    catch (e)
    {
      console.log("catch Error" ,e);
    }
    setInvitePrompt(null)
    setPendingInvite(false)
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
    setPendingInvite(false)
  }

  const handleUnblockConversation = (conversationId: number) => {
    setBlockedConversations((prev: any) => ({
      ...prev,
      [conversationId]: { blocked: false, blockedBy: null }
    }))
  }

  const checkInvitationStatus = async (conversation: any) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/chat/invitation/status`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: conversation.other_user_id })
      })
      const data = await res.json()
      if (res.ok) {
        if (data.pending === true) {
          setPendingInvite(true)
          if (data.invitedBy === "other") {
            setInvitePrompt({
              conversationId: conversation.id,
              fromUserId: conversation.other_user_id,
            })
          }
        } else {
          setPendingInvite(false)
        } 
      }
    } catch (error) {
      console.error('Failed to check invitation status:', error)
    }

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
          setBlockedConversations((prev: any) => ({
            ...prev,
            [conversation.id]: { blocked: false, blockedBy: null }
          }))
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
      onCheckInvitationStatus={checkInvitationStatus}
      invitePrompt={invitePrompt}
      onInvite={sendInvite}
      onCancelInvite={cancelInvite}
      onRespondInvite={respondInvite}
      pendingInvite={pendingInvite}
      socket={socket}
    />
  )
}
