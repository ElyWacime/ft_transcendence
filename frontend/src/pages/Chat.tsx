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
  const { socket, isConnected, invitePrompt, setInvitePrompt, currentUser, pendingInvite, setPendingInvite, pendingAddFriend, setPendingAddFriend, friendsList, setFriendsList } = useChatSocket()
  const [conversations, setConversations] = useState<any[]>([])
  const [selectedId, setSelectedId] = useState<number>()
  const [messages, setMessages] = useState<any[]>([])
  const [blockedConversations, setBlockedConversations] = useState<any>({})
  const navigate = useNavigate()

  useEffect(() => {
    if (!socket) return

    const handleNewConversation = async () => {
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



    socket.on("newConversation", handleNewConversation)
    socket.on('receiveMessage', handleReceiveMessage)
    socket.on('blockStatusChanged', handleBlockStatusChanged)

    return () => {
      socket.off("newConversation", handleNewConversation)
      socket.off('receiveMessage', handleReceiveMessage)
      socket.off('blockStatusChanged', handleBlockStatusChanged)
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

  const sendInvite = async (conversation: any, invitationType: string) => {
    if (!socket || !isConnected || !conversation?.other_user_id) return


    const response = await fetch(`${SERVER_URL}/api/chat/invite`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: conversation.other_user_id, invitation_type: invitationType })
    })
    const re = await response.json()


    if (re.invitationType === "game_request")
    {
      setPendingInvite(true)    
    } else if (re.invitationType === "friend_request")
    {
      setPendingAddFriend(true)
    }      
    socket.emit('gameInvite', {
      conversationId: conversation.id,
      toUserId: conversation.other_user_id,
      fromUserId: currentUser?.id,
      invitationType: invitationType
    })
  }

  const cancelInvite = async (conversation: any, invitationType: string) => {
    if (!socket || !isConnected || !conversation?.other_user_id) return

    const response = await fetch(`${SERVER_URL}/api/chat/deleteInvite`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: conversation.other_user_id, invitation_type: invitationType })
    })
    
    const re = await response.json()    

    if (re.invitationType === "game_request")
    {
      setPendingInvite(false)
      setInvitePrompt(null)
    } else if (re.invitationType === "friend_request")
    {
      setPendingAddFriend(false)
      setInvitePrompt(null)
    }          

    socket.emit('cancelInvite', {
      toUserId: conversation.other_user_id,
      invitationType: invitationType
    })
  }

  const respondInvite = async (accepted: boolean, invitationType: string) => {
    if (!socket || !invitePrompt) return
    try 
    {
      let res = await inviteHandle(invitePrompt.fromUserId,  currentUser.id );
      socket.emit('gameInviteResponse', {
            conversationId: invitePrompt.conversationId,
            toUserId: invitePrompt.fromUserId,
            fromUserId: currentUser.id,
            invitationType: invitationType,
            accepted,
      })

      if (res.ok)
      {
          const response = await fetch(`${SERVER_URL}/api/chat/deleteInvite`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: invitePrompt.fromUserId, invitation_type: invitationType })
          })
    
          const res = await response.json()


          if (accepted)
          {
            if (invitationType === "game_request")
            {
              navigate(`/loading?mode=2`);
            } else if (invitationType === "friend_request")
            {
              const response = await fetch(`${SERVER_URL}/api/chat/addFriend`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: invitePrompt.fromUserId })
              })
        
              if (response.ok) {
                setFriendsList((prev: any) => ({
                  ...prev,
                  [invitePrompt.fromUserId]: { isFriend: true }
                }))
              }

              socket.emit('friendOnline', { userId: invitePrompt.fromUserId })
            }              
          }
      }
    }
    catch (e)
    {
      console.log("catch Error" ,e);
    }

    setInvitePrompt(null)
    if (invitationType === "game_request")
    { 
      setPendingInvite(false)      
    } else if (invitationType === "friend_request")
    {
      setPendingAddFriend(false)
    }
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
  }


  const removeFriend = async (other_user_id: number) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/chat/removeFriend`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: other_user_id })
      })
      const data = await res.json()
      
      if (res.ok) {
        setFriendsList((prev: any) => ({
          ...prev,
          [other_user_id]: { isFriend: false }
        }))

        cancelInvite({ other_user_id }, "game_request")
        socket?.emit('unfriend', {
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
      const res = await fetch(`${SERVER_URL}/api/chat/invitation/status`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: conversation.other_user_id, invitationType: invitationType })
      })

      const data = await res.json()

      if (res.ok) {
        if (data.pending === true) {
          if (invitationType === "game_request") {
            setPendingInvite(true)
            if (data.invitedBy === "other") {
              setInvitePrompt({
                conversationId: conversation.id,
                fromUserId: conversation.other_user_id,
                invitationType: invitationType
              })
            }
          } else if (invitationType === "friend_request") {
            setPendingAddFriend(true)
            if (data.invitedBy === "other") {
              setInvitePrompt({
                conversationId: conversation.id,
                fromUserId: conversation.other_user_id,
                invitationType: invitationType
              })
            }
          }
        }
        else {
          if (invitationType === "game_request") {
            setPendingInvite(false)
            if (invitePrompt?.conversationId === conversation.id && 
                invitePrompt?.invitationType === "game_request") {
              setInvitePrompt(null)
            }
          } else if (invitationType === "friend_request") {
            setPendingAddFriend(false)
            if (invitePrompt?.conversationId === conversation.id && 
                invitePrompt?.invitationType === "friend_request") {
              setInvitePrompt(null)
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to check invitation status:', error)
    }
  }

  const checkFriendshipStatus = async (conversation: any) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/chat/friends/status`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: conversation.other_user_id })
      })
      const data = await res.json()
      if (res.ok) {
        if (data.friends) {
          setFriendsList((prev: any) => ({
            ...prev,
            [conversation.other_user_id]: {isFriend: true}
          })) 
        } else { 
          setFriendsList((prev: any) => ({
            ...prev,
            [conversation.other_user_id]: {isFriend: false}
          })) 
        }
      }
    } catch (error) {
      console.error('Failed to check friendship status:', error)
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
      onCheckFriendshipStatus={checkFriendshipStatus}
      friendsList={friendsList}
      invitePrompt={invitePrompt}
      onInvite={sendInvite}
      onCancelInvite={cancelInvite}
      onUnfriend={removeFriend}
      onRespondInvite={respondInvite}
      pendingInvite={pendingInvite}
      pendingAddFriend={pendingAddFriend}
      socket={socket}
    />
  )
}
