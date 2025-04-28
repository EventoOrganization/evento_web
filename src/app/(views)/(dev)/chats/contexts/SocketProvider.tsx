"use client";

import { useSession } from "@/contexts/(prod)/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";
import { ConversationsInitializer } from "../components/ConversationsInitializer";
import { ConversationType } from "../types";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  conversations: ConversationType[];
  updateConversations: (updater: (prev: any[]) => any[]) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  conversations: [],
  updateConversations: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, isAuthenticated, isTokenChecked } = useSession();
  const { toast } = useToast();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    if (!isTokenChecked || !isAuthenticated || !token) {
      socket?.disconnect();
      setSocket(null);
      setIsConnected(false);
      return;
    }

    const sock = io(process.env.NEXT_PUBLIC_API_URL!, {
      transports: ["websocket"],
      auth: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    sock.on("connect", () => {
      console.log("[Socket] connected", sock.id);
      setSocket(sock);
      setIsConnected(true);
    });

    sock.on("disconnect", (reason) => {
      console.warn("[Socket] disconnected:", reason);
      setSocket(null);
      setIsConnected(false);
    });

    sock.on("connect_error", (err) => {
      console.error("[Socket] connection error:", err.message);
      toast({
        title: "Socket error",
        description: err.message,
        variant: "destructive",
      });
    });

    return () => {
      sock.off("connect");
      sock.off("disconnect");
      sock.off("connect_error");
      sock.disconnect();
    };
  }, [isTokenChecked, isAuthenticated, token]);

  const updateConversations = useCallback((updater: (prev: any[]) => any[]) => {
    setConversations((prev) => updater(prev));
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket, isConnected, conversations, updateConversations }}
    >
      <ConversationsInitializer />
      {children}
    </SocketContext.Provider>
  );
};
