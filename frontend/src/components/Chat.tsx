import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageSquare, X } from "lucide-react";
import { ChatMessage, api } from "@/lib/api";

interface ChatProps {
  isOpen: boolean;
  onToggle: () => void;
  currentPlayerId?: string;
  currentPlayerAlias?: string;
}

export const Chat = ({ isOpen, onToggle, currentPlayerId, currentPlayerAlias }: ChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load initial messages
    const loadMessages = async () => {
      try {
        const msgs = await api.getMessages();
        setMessages(msgs);
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    loadMessages();

    // Simulate real-time updates (in a real app, use WebSocket)
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !currentPlayerId || !currentPlayerAlias) {
      return;
    }

    try {
      await api.sendMessage(currentPlayerId, currentPlayerAlias, newMessage.trim());
      setNewMessage("");
      
      // Refresh messages
      const msgs = await api.getMessages();
      setMessages(msgs);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        size="icon"
        className="fixed bottom-6 right-6 z-50 bg-gradient-primary animate-pulse-glow"
      >
        <MessageSquare className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 h-96 z-50 bg-gradient-secondary border-border shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span>Chat</span>
          </CardTitle>
          <Button onClick={onToggle} size="icon" variant="ghost">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex flex-col h-full">
        {/* Messages Area */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-4">
          <div className="space-y-3 pb-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm py-8">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No messages yet</p>
                <p>Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex flex-col space-y-1 ${
                    message.playerId === currentPlayerId ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-2 rounded-lg text-sm ${
                      message.type === 'system'
                        ? 'bg-muted text-muted-foreground text-center w-full'
                        : message.playerId === currentPlayerId
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border'
                    }`}
                  >
                    {message.type !== 'system' && (
                      <div className="font-semibold text-xs opacity-70 mb-1">
                        {message.playerAlias}
                      </div>
                    )}
                    <div>{message.message}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-border">
          {currentPlayerId && currentPlayerAlias ? (
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-card border-border"
                maxLength={200}
              />
              <Button 
                type="submit" 
                size="icon"
                disabled={!newMessage.trim()}
                className="bg-gradient-primary"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              Join the tournament to chat
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
