"use client";
import { useSession } from "@/contexts/SessionProvider";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  messages: any[];
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  conversations: any[];
  updateConversations: (func: (prevConversations: any[]) => any[]) => void;
  activeConversation: any | null;
  setActiveConversation: React.Dispatch<React.SetStateAction<any | null>>;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any | null>(
    null,
  );
  const activeConversationRef = useRef<any>(null); // useRef to hold current active conversation
  const { token, user } = useSession();

  useEffect(() => {
    activeConversationRef.current = activeConversation; // Update the ref when activeConversation changes
  }, [activeConversation]);

  useEffect(() => {
    if (!token || !user) {
      console.log("No token or user, disconnecting socket...");
      socket?.disconnect();
      return;
    }

    const newSocket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
      transports: ["websocket"],
      auth: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      setSocket(newSocket);

      newSocket.emit("connect_user", { userId: user._id });
    });

    newSocket.on("send_message_emit", (newMessage) => {
      console.log("New message received:", newMessage);
      if (!newMessage || !newMessage.constantId || !newMessage.message) {
        console.error("Invalid message structure received:", newMessage);
        return;
      }

      const currentActiveConversation = activeConversationRef.current;

      updateConversations((prevConversations) => {
        const updatedConversations = prevConversations.map((conv) => {
          if (conv._id === newMessage.constantId) {
            const isMessageDuplicate =
              Array.isArray(conv.messages) &&
              conv.messages.some((msg: any) => msg._id === newMessage._id);

            // If the message is not a duplicate, add it
            if (!isMessageDuplicate) {
              const updatedConv = {
                ...conv,
                lastMessage: newMessage.message,
                messages: [newMessage, ...(conv.messages || [])],
              };

              // Update activeConversation if it's the same conversation
              if (
                currentActiveConversation &&
                currentActiveConversation._id === conv._id
              ) {
                setActiveConversation(updatedConv);
              }

              return updatedConv;
            }
          }
          return conv;
        });
        return updatedConversations;
      });
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      if (newSocket.connected) {
        newSocket.off("connect");
        newSocket.off("send_message_emit");
        newSocket.disconnect();
        console.log("Socket disconnected via cleanup");
      }
      setSocket(null);
    };
  }, [token, user]);

  const updateConversations = (func: (prevConversations: any[]) => any[]) => {
    setConversations((prevConversations) => {
      const updatedConversations = func(prevConversations);
      return updatedConversations;
    });
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        messages,
        setMessages,
        conversations,
        updateConversations,
        activeConversation,
        setActiveConversation,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
