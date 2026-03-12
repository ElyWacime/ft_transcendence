import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useChatSocket } from "../context/ChatSocketContext"
import "../components/chat/App.css"
import MessagesPageLayout from "../components/chat/MessagesPageLayout"
import { useAuth } from "@/context/AuthContext"
import { fetchWithAuth } from "@/lib/tokenRefresh"
import { toast } from "sonner";


const API_URL = import.meta.env.VITE_API_URL || 'https://localhost'
const SERVER_URL = API_URL
const GAME_SERVICE_URL = import.meta.env.VITE_GAME_SERVICE_URL || `https://${import.meta.env.VITE_DOMAIN}`

type StartConversationParams = {
  userId: number
  socket?: Socket | null
  accessToken?: string
  updateAccessToken?: (newToken: string) => void
}

export const handleStartConversation = async ({ userId, socket, accessToken, updateAccessToken }: StartConversationParams) => {
  try {
    const res = await fetchWithAuth(`${SERVER_URL}/api/chat/conversations/start`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receipentId: userId })
    }, accessToken, updateAccessToken)
    const data = await res.json()
    if (data.conversationId) {
      socket?.emit("newConversation", { userId })
      return data.conversationId as number
    }
  } catch (error) {
    console.error('Failed to start conversation:', error)
  }
  return null
}

export default function Chat() {
  const { socket, isConnected, pendingInvitations, setPendingInvitations, invitePrompt, setInvitePrompt, currentUser, friendsList, setFriendsList, blockedConversations, setBlockedConversations } = useChatSocket()
  const { accessToken, updateAccessToken } = useAuth()
  const [conversations, setConversations] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const selectedId = id && /^\d+$/.test(id) ? parseInt(id, 10) : undefined

  const inviteHandle = async (P1, P2) => 
  {
    const res = await fetchWithAuth(`${GAME_SERVICE_URL}/api/game/invite`, {
        method: 'POST',
        credentials: "include",
        body: JSON.stringify({ P1 ,P2 }),
    }, accessToken, updateAccessToken);
    return res;
  }

  useEffect(() => {
    if (!socket) return

    const handleNewConversation = async () => {
      await fetchConversations()
    }

    const handleReceiveMessage = (message: any) => {
      if (message.conversation_id === selectedId)
      {
        setMessages(prev => {
          return [...prev, message]
        })
      }
    
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
        
    socket.on("newConversation", handleNewConversation)
    socket.on('receiveMessage', handleReceiveMessage)

    return () => {
      socket.off("newConversation", handleNewConversation)
      socket.off('receiveMessage', handleReceiveMessage)
    }
  }, [socket, navigate, selectedId])

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
      try {
        const res = await fetchWithAuth(`${SERVER_URL}/api/chat/conversations`, { method: 'GET', credentials: 'include' }, accessToken, updateAccessToken)
        const conversationsData = await res.json()
        setConversations(conversationsData)        
        for (const conversation of conversationsData) {
          checkFriendshipStatus(conversation);
        }
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

  const sendInvite = async (conversation: any, invitationType: string) => {
    if (!socket || !isConnected || !conversation?.other_user_id) return


    const response = await fetchWithAuth(`${SERVER_URL}/api/chat/invite`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: conversation.other_user_id, invitationType: invitationType })
    }, accessToken, updateAccessToken)
    const re = await response.json()

    setPendingInvitations((prev: any) => ({
      ...prev,
      [conversation.id]: {
        ...prev[conversation.id],
        [invitationType]: true
      }
    }))
    
    socket.emit('Invite', {
      conversationId: conversation.id,
      toUserId: conversation.other_user_id,
      fromUserId: currentUser?.id,
      invitationType: invitationType
    })
  }

  const cancelInvite = async (conversation: any, invitationType: string) => {
    if (!socket || !isConnected || !conversation?.other_user_id) return


    await fetchWithAuth(`${SERVER_URL}/api/chat/uninvite`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: conversation.other_user_id, invitationType: invitationType })
    }, accessToken, updateAccessToken)
    
    setPendingInvitations((prev: any) => ({
      ...prev,
      [conversation.id]: {
        ...prev[conversation.id],
        [invitationType]: false
      }
    }))

    socket.emit('cancelInvite', {
      conversationId: conversation.id,
      toUserId: conversation.other_user_id,
      invitationType: invitationType
    })
  }

  const respondInvite = async (accepted: boolean, invitationType: string) => {
    if (!socket || !selectedId) return

    const activeInvitePrompt = invitePrompt?.[selectedId]
    if (!activeInvitePrompt) return
    
    let t = false

    if (accepted)
    {
      if (invitationType === "game_request")
      {
        let res = await inviteHandle(activeInvitePrompt.fromUserId,  currentUser.id);
        if (res.ok)
          navigate(`/loading?mode=2`);
        else
        {
          toast.error("Your friend is on another match!")
          t = true
        }
      } else if (invitationType === "friend_request")
      {
        const response = await fetchWithAuth(`${SERVER_URL}/api/chat/friends/add`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: activeInvitePrompt.fromUserId })
        }, accessToken, updateAccessToken)
  
        if (response.ok) {
          setFriendsList((prev: any) => ({
            ...prev,
            [activeInvitePrompt.fromUserId]: { ...prev[activeInvitePrompt.fromUserId], isFriend: true }
          }))
        }
        socket.emit('AddFriendOnline', { userId: activeInvitePrompt.fromUserId })
      }              
    }

    if (t == false)
    {
        await fetchWithAuth(`${SERVER_URL}/api/chat/uninvite`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: activeInvitePrompt.fromUserId, invitationType: invitationType })
        }, accessToken, updateAccessToken)    

        socket.emit('InviteResponse', {
                conversationId: activeInvitePrompt.conversationId,
                toUserId: activeInvitePrompt.fromUserId,
                fromUserId: currentUser.id,
                invitationType: invitationType,
                accepted,
        })    

        setInvitePrompt((prev: any) => {
          const updated = { ...prev }
          delete updated[activeInvitePrompt.conversationId]
          return updated
        })      
    }
  }

  const getChatHistory = async (conversationId: number) => {
    if (!conversationId) {
      console.error('No conversation ID provided')
      return
    }
    try {
      const res = await fetchWithAuth(`${SERVER_URL}/api/chat/conversations/${conversationId}/messages`, { method: 'GET', credentials: 'include' }, accessToken, updateAccessToken)
      const historyData = await res.json()
      setMessages(historyData)
    } catch (error) {
      console.error('Failed to fetch chat history:', error)
    }
  }

  const handleBlockConversation = (conversationId: number) => {
    setBlockedConversations((prev: any) => ({ ...prev, [conversationId]: { blocked: true, blockedBy: 'you' } }))
  }

  const removeFriend = async (conversation: any) => {
    const other_user_id = conversation.other_user_id
    try {
      const res = await fetchWithAuth(`${SERVER_URL}/api/chat/friends/remove`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: other_user_id })
      }, accessToken, updateAccessToken)
      const data = await res.json()
      
      if (res.ok) {
        cancelInvite( conversation  , "game_request")
        setFriendsList((prev: any) => ({
          ...prev,
          [other_user_id]: { ...prev[other_user_id], isFriend: false }
        }))

        socket?.emit('unfriend', {
          conversationId: conversation.id,
          userId: other_user_id,
          toUnfriend: currentUser?.id
        })
      }
    } catch (error) {
      console.error('Failed to remove friend:', error)
    }
  }

  const handleUnblockConversation = (conversationId: number) => {
    setBlockedConversations((prev: any) => ({
      ...prev,
      [conversationId]: { blocked: false, blockedBy: null }
    }))
  }

  const checkInvitationStatus = async (conversation: any, invitationType: string) => {
    try {
      const res = await fetchWithAuth(`${SERVER_URL}/api/chat/invitations/status`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: conversation.other_user_id, invitationType: invitationType })
      }, accessToken, updateAccessToken)

      const data = await res.json()

      if (res.ok) {
        if (data.pending === true) {
          if (data.invitedBy === "other") {
            setInvitePrompt((prev: any) => ({
              ...prev,
              [conversation.id]: {
                conversationId: conversation.id,
                fromUserId: conversation.other_user_id,
                invitationType: invitationType
              }
            }))
          } else
          {
            setPendingInvitations((prev: any) => ({
              ...prev,
              [conversation.id]: {
                ...prev[conversation.id],
                [invitationType]: data.pending
              }
            }))            
          }
        } else {
          if (data.invitedBy === "other") {
            setInvitePrompt((prev: any) => {
              const updated = { ...prev }
              delete updated[conversation.id]
              return updated
            })
          } else {
            setPendingInvitations((prev: any) => ({
              ...prev,
              [conversation.id]: {
                ...prev[conversation.id],
                [invitationType]: data.pending
              }
            }))
          }
        }
      }
    } catch (error) {
      console.error('Failed to check invitation status:', error)
    }
  }
  
  const checkFriendshipStatus = async (conversation: any) => {
    try {
      const res = await fetchWithAuth(`${SERVER_URL}/api/chat/friends/status`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: conversation.other_user_id })
      }, accessToken, updateAccessToken)
      const data = await res.json()
      if (res.ok) {
          setFriendsList((prev: any) => ({
            ...prev,
            [conversation.other_user_id]: {...prev[conversation.other_user_id], isFriend: data.friends}
          })) 
      }
    } catch (error) {
      console.error('Failed to check friendship status:', error)
    }
  }

  const checkBlockStatus = async (conversation: any) => {
    if (!conversation?.id || !conversation?.other_user_id) return
    try {
      const res = await fetchWithAuth(`${SERVER_URL}/api/chat/block/status`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: conversation.other_user_id })
      }, accessToken, updateAccessToken)
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
      messages={messages}
      onSendMessage={handleSendMessage}
      onGetHistory={getChatHistory}
      isConnected={isConnected}
      currentUser={currentUser}
      onFetchConversations={fetchConversations}
      blockedConversations={blockedConversations}
      pendingInvitations={pendingInvitations}
      onBlockConversation={handleBlockConversation}
      onUnblockConversation={handleUnblockConversation}
      onCheckBlockStatus={checkBlockStatus}
      onCheckInvitationStatus={checkInvitationStatus}
      onCheckFriendshipStatus={checkFriendshipStatus}
      friendsList={friendsList}
      invitePrompt={invitePrompt}
      onInvite={sendInvite}
      onCancelInvite={cancelInvite}
      onUnfriend={removeFriend}
      onRespondInvite={respondInvite}
      socket={socket}
    />
  )
}