"use client";
import { useSession } from "@/contexts/SessionProvider";
import { createContext, useContext, useEffect, useState } from "react";
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
  const { token, user } = useSession();

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

      // User connects to their specific socket
      newSocket.emit("connect_user", { userId: user._id });
    });

    // Listen for new messages from the server
    newSocket.on("send_message_emit", (newMessage) => {
      console.log("New message received via Socket.IO:", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    newSocket.on("conversation_update", (updatedConversation) => {
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv._id === updatedConversation._id ? updatedConversation : conv,
        ),
      );
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
    console.log("Updating conversations:", func);
    setConversations(func);
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
