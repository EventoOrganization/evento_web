"use client";
import { useSession } from "@/contexts/SessionProvider";
import { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  notifications: string[];
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const { token, user } = useSession();

  useEffect(() => {
    if (!token || !user) return;

    const newSocket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
      transports: ["websocket"],
      auth: { token },
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      setSocket(newSocket);

      newSocket.emit("connect_user", { userId: user._id });
    });

    newSocket.on("notification", (notification) => {
      console.log("Notification received:", notification);
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [token, user]);

  return (
    <SocketContext.Provider value={{ socket, notifications }}>
      {children}
    </SocketContext.Provider>
  );
};
