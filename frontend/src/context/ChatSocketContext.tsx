import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth, refreshToken } from "@/lib/tokenRefresh";

type ChatSocketContextValue = {
  socket: Socket | null;
  isConnected: boolean;
  invitePrompt: any;
  setInvitePrompt: (invite: any) => void;
  currentUser: any;
  friendsList: any;
  setFriendsList: (friends: any) => void;
  pendingAddFriend: boolean;
  setPendingAddFriend: (pending: boolean) => void;
};

const ChatSocketContext = createContext<ChatSocketContextValue | null>(null);

const API_URL = import.meta.env.VITE_API_URL || "https://localhost";
const SERVER_URL = API_URL;

export const ChatSocketProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [invitePrompt, setInvitePrompt] = useState<any>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [friendsList, setFriendsList] = useState<any>({})
    const [pendingInvitations, setPendingInvitations] = useState<any>({})
    const [blockedConversations, setBlockedConversations] = useState<any>({})


    const { isLoggedIn, isLoading, accessToken, updateAccessToken } = useAuth();


  useEffect(() => {
    if (isLoading) {
      console.log("[ChatSocket] Waiting for auth to finish loading...");
      return;
    }

    if (!isLoggedIn) {
      return;
    }
    
    const chatSocket = io(SERVER_URL, {
      withCredentials: true,
      reconnection: true,
      auth: {
        token: accessToken
      }
    });
    setSocket(chatSocket);
    chatSocket.on("connect", () => {});

    chatSocket.on("connect_error", async () => {
      try {
        const result = await refreshToken();
        if (result) {
          updateAccessToken(result.accessToken);
          chatSocket.auth = { token: result.accessToken };
        }
      } catch (err) {
        console.error("[ChatSocket] Token refresh failed:", err);
      }
    });

    chatSocket.on("authenticate", (data: any) => {
      setCurrentUser({ id: data.userId });
      setIsConnected(true);
    });

    chatSocket.on("disconnect", () => {
      setFriendsList({});
      setPendingInvitations({});
      setBlockedConversations({});
      setIsConnected(false)
    });
    
    chatSocket.on("Invite", (data: any) => {
      setInvitePrompt(data);
    });

    chatSocket.on('onlineFriends', (data: any) => {
      setFriendsList((prev: any) => {
        const updated = { ...prev };
        data.onlineFriends.forEach((friendId: number) => {
          updated[friendId] = { ...updated[friendId], online: true };
        });
        return updated;
      });
    });
    
    chatSocket.on('friendOnline', (data: any) => {
      setFriendsList((prev: any) => ({
        ...prev,
        [data.userId]: { ...prev[data.userId], online: true }
      }));
    });

    chatSocket.on('friendOffline', (data: any) => {
      setFriendsList((prev: any) => ({
        ...prev,
        [data.userId]: { ...prev[data.userId], online: false }
      }));
    });

    const handleGameInviteResponse = (data: any) => {
      if (data.invitationType === "game_request") {
        if (data.accepted) {
          navigate(`/loading?mode=2`);
        }
      } else if (data.invitationType === "friend_request") {
        if (data.accepted) {
          setFriendsList((prev: any) => ({
            ...prev,
            [data.fromUserId]: { isFriend: true }
          }))
        }
      }
      setPendingInvitations((prev: any) => ({
        ...prev,
        [data.conversationId]: {
          ...prev[data.conversationId],
          [`${data.invitationType}`]: false
        }
      }))
    }    
    chatSocket.on('InviteResponse', handleGameInviteResponse)

    const handleCancelInvite = async ({invitationType}) => {
      setInvitePrompt(null);
    }
    chatSocket.on("cancelInvite", handleCancelInvite);
    
    const handleUnfriend = ({ userId, conversationId }: any) => {
      console.log("hit")
      setFriendsList((prev: any) => ({
        ...prev,
        [userId]: { isFriend: false }
      })) 
      setPendingInvitations((prev: any) => ({
        ...prev,
        [conversationId]: {
          ...prev[conversationId],
          game_request: false,
        }
      }))
    }   
    chatSocket.on('unfriend', handleUnfriend)

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
    chatSocket.on('blockStatusChanged', handleBlockStatusChanged)


    return () => {
      chatSocket.disconnect();
      chatSocket.off('unfriend', handleUnfriend)
      chatSocket.off('InviteResponse', handleGameInviteResponse)
      chatSocket.off('blockStatusChanged', handleBlockStatusChanged)

    };
  }, [isLoggedIn, isLoading]);

  return (
    <ChatSocketContext.Provider value={{ socket, currentUser, isConnected, invitePrompt, setInvitePrompt, pendingInvitations, setPendingInvitations, friendsList, setFriendsList, blockedConversations, setBlockedConversations }}>
      {children}
    </ChatSocketContext.Provider>
  );
};

export const useChatSocket = () => {
  const context = useContext(ChatSocketContext);
  if (!context) {
    throw new Error("useChatSocket must be used inside ChatSocketProvider");
  }
  return context;
};
