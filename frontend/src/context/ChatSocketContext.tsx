import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

type ChatSocketContextValue = {
  socket: Socket | null;
  isConnected: boolean;
  invitePrompt: any;
  setInvitePrompt: (invite: any) => void;
  currentUser: any;
};

const ChatSocketContext = createContext<ChatSocketContextValue | null>(null);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost";
const SERVER_URL = API_URL;

export const ChatSocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [invitePrompt, setInvitePrompt] = useState<any>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [pendingInvite, setPendingInvite] = useState<boolean>(false)
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


    chatSocket.on("cancelInvite",() => {
      setInvitePrompt(null);
      setPendingInvite(false)
    });

    return () => {
      chatSocket.disconnect();
    };
  }, [isLoggedIn]);

  return (
    <ChatSocketContext.Provider value={{ socket, isConnected, invitePrompt, setInvitePrompt, currentUser, pendingInvite, setPendingInvite }}>
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
