"use client";
import { useSession } from "@/contexts/SessionProvider";
import { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  messages: any[];
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
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
  const { token, user } = useSession();

  useEffect(() => {
    if (!token || !user) {
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
      console.log("New message received via Socket.IO:", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      if (newSocket.connected) {
        newSocket.disconnect();
        console.log("Socket disconnected via cleanup");
      }
      setSocket(null);
    };
  }, [token, user]);

  return (
    <SocketContext.Provider value={{ socket, messages, setMessages }}>
      {children}
    </SocketContext.Provider>
  );
};
