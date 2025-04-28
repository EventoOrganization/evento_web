"use client";

import { useSession } from "@/contexts/(prod)/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";
import { ConversationsInitializer } from "../components/ConversationsInitializer";
import { ConversationWatcher } from "../components/ConversationWatcher";
import { ConversationType, MessageType } from "../types";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  conversations: ConversationType[];
  activeConversation: ConversationType | null;
  setActiveConversation: (conv: ConversationType | null) => void;
  updateConversations: (updater: (prev: any[]) => any[]) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  conversations: [],
  activeConversation: null,
  setActiveConversation: () => {},
  updateConversations: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, isAuthenticated, isTokenChecked, user } = useSession();
  const { toast } = useToast();
  const pathname = usePathname();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const activeConversationRef = useRef<ConversationType | null>(null);

  const setActiveConversation = (conv: ConversationType | null) => {
    activeConversationRef.current = conv;
    _setActiveConversation(conv);
  };
  const [_activeConversation, _setActiveConversation] =
    useState<ConversationType | null>(null);

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
    // new-message mean someone has sent a message in a conversation where you are
    sock.on("new_message", (payload: MessageType) => {
      console.log("[SocketProvider] 📨 Received new-message:", payload);

      updateConversations((prevConvs) =>
        prevConvs.map((conv) => {
          if (conv._id !== payload.conversationId) return conv;

          const isMe = payload.senderId === user?._id;
          const currentUnread = conv.unreadCounts?.[user?._id || ""] || 0;
          const isConvActive = activeConversationRef.current?._id === conv._id;

          return {
            ...conv,
            recentMessages: [...(conv.recentMessages || []), payload],
            lastMessage: payload,
            unreadCounts: {
              ...(conv.unreadCounts || {}),
              ...(isMe || isConvActive
                ? {}
                : { [user?._id || ""]: currentUnread + 1 }),
            },
          };
        }),
      );
    });

    // read-receipt mean someone has read a message in a conversation where you are
    sock.on(
      "read_receipt",
      (payload: {
        conversationId: string;
        userId: string;
        lastSeenMessageId: string;
      }) => {
        console.log("[SocketProvider] 📨 Received read-receipt:", payload);

        setConversations((prevConvs) =>
          prevConvs.map((conv) =>
            conv._id === payload.conversationId
              ? {
                  ...conv,
                  readReceipts: {
                    ...(conv.readReceipts || {}),
                    [payload.userId]: payload.lastSeenMessageId,
                  },
                }
              : conv,
          ),
        );
      },
    );

    return () => {
      sock.off("connect");
      sock.off("disconnect");
      sock.off("connect_error");
      sock.off("read-receipt");
      sock.off("new-message");
      sock.disconnect();
    };
  }, [isTokenChecked, isAuthenticated, token]);

  const updateConversations = useCallback((updater: (prev: any[]) => any[]) => {
    console.log("[SocketProvider] updating conversations");
    setConversations((prev) => updater(prev));
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        conversations,
        updateConversations,
        activeConversation: _activeConversation,
        setActiveConversation,
      }}
    >
      <ConversationsInitializer />
      <ConversationWatcher />
      {children}
    </SocketContext.Provider>
  );
};
