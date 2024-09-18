"use client";
import { useSession } from "@/contexts/SessionProvider";
import { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  sendMessage: (message: string, receiverId: string) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
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
  const sendMessage = (
    message: string,
    receiverId?: string,
    groupId?: string,
  ) => {
    if (socket) {
      socket.emit("send_message", {
        groupId: groupId ?? null,
        senderId: user?._id,
        receiverId: receiverId ?? null,
        message,
      });
    }
  };
  return (
    <SocketContext.Provider value={{ socket, sendMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
