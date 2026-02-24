import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost";
const SERVER_URL = API_URL;

export const ChatSocketProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [invitePrompt, setInvitePrompt] = useState<any>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [pendingInvite, setPendingInvite] = useState<boolean>(false)
    const [pendingAddFriend, setPendingAddFriend] = useState<boolean>(false)
    const [friendsList, setFriendsList] = useState<any>({})
    const { isLoggedIn } = useAuth();


  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    const chatSocket = io(SERVER_URL, {
      autoConnect: true,
    });
    setSocket(chatSocket);
    chatSocket.on("connect", async () => {
        try {
          const res = await fetch(`${SERVER_URL}/api/chat/getCookieValue`, { credentials: 'include' });
          const usercookie = await res.json();
          const userId = usercookie.user_id;
          setCurrentUser({ id: userId });
          chatSocket.emit('authenticate', userId);
          setIsConnected(true);
        } catch (error) {
          console.error('Failed to authenticate:', error);
        }
      }
    );

    chatSocket.on("disconnect", () => setIsConnected(false));
    
    chatSocket.on("gameInvite", (data: any) => {
      setInvitePrompt(data);
    });


    const handleGameInviteResponse = (data: any) => {
      if (data.invitationType === "game_request") {
        setPendingInvite(false)
        if (data.accepted) {
          navigate(`/loading?mode=2`);
        }
      } else if (data.invitationType === "friend_request") {
        setPendingAddFriend(false)
        if (data.accepted) {
          setFriendsList((prev: any) => ({
            ...prev,
            [data.fromUserId]: { isFriend: true }
          }))
        }
      }
    }


    chatSocket.on('gameInviteResponse', handleGameInviteResponse)

    
    chatSocket.on("cancelInvite",({invitationType}) => {
      if (invitationType === "game_request") {
        setInvitePrompt(null);
        setPendingInvite(false)
      } else if (invitationType === "friend_request") {
        setInvitePrompt(null);
        setPendingAddFriend(false)
      }
    });

    const handleUnfriend = ({ userId }: any) => {
      // console.log("Unfriended userId:", userId)
      setPendingInvite(false)
      setInvitePrompt(null)
      setFriendsList((prev: any) => ({
        ...prev,
        [userId]: { isFriend: false }
      }))
    }   
    
    chatSocket.on('unfriend', handleUnfriend)


    return () => {
      chatSocket.disconnect();
      chatSocket.off('unfriend', handleUnfriend)

    };
  }, [isLoggedIn]);

  return (
    <ChatSocketContext.Provider value={{ socket, isConnected, invitePrompt, setInvitePrompt, currentUser, pendingInvite, setPendingInvite, pendingAddFriend, setPendingAddFriend, friendsList, setFriendsList }}>
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
