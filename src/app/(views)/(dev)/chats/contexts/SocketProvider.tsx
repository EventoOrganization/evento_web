"use client";

import { useSession } from "@/contexts/(prod)/SessionProvider";
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
  addPendingMessageToConversation: (convId: string, msg: MessageType) => void;
  replacePendingInConv: (convId: string, official: MessageType) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  conversations: [],
  activeConversation: null,
  setActiveConversation: () => {},
  updateConversations: () => {},
  addPendingMessageToConversation: () => {},
  replacePendingInConv: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, isAuthenticated, isTokenChecked, user } = useSession();
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
    });

    // new-message mean someone has sent a message in a conversation where you are
    sock.on("new_message", (payload: MessageType) => {
      console.log("[SocketProvider] 📨 Received new-message:", payload);
      replacePendingInConv(payload.conversationId, payload);
      updateConversations((prevConvs) =>
        prevConvs.map((conv) => {
          if (conv._id !== payload.conversationId) return conv;

          const isMe = payload.senderId === user?._id;
          const currentUnread = conv.unreadCounts?.[user?._id || ""] || 0;
          const isConvActive = activeConversationRef.current?._id === conv._id;

          return {
            ...conv,
            recentMessages: (() => {
              const existing = (conv.recentMessages || []).find(
                (msg: MessageType) =>
                  msg._id === payload._id ||
                  (msg.clientId &&
                    payload.clientId &&
                    msg.clientId === payload.clientId),
              );

              if (existing) return conv.recentMessages; // ne pas doubler
              return [...(conv.recentMessages || []), payload];
            })(),

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

  const addPendingMessageToConversation = useCallback(
    (convId: string, msg: MessageType) => {
      console.log("[addPendingMessageToConversation] 📨 Adding msg:", msg);
      updateConversations((prev) =>
        prev.map((conv) =>
          conv._id === convId
            ? {
                ...conv,
                recentMessages: [...(conv.recentMessages || []), msg],
              }
            : conv,
        ),
      );
    },
    [updateConversations],
  );

  const replacePendingInConv = useCallback(
    (convId: string, official: MessageType) => {
      console.log(
        "[replacePendingInConv] 🔄 Trying to replace in conv:",
        convId,
      );
      if (!official.clientId) {
        console.warn(
          "[replacePendingInConv] ⚠️ No clientId on official message:",
          official._id,
        );
      }

      updateConversations((prev) =>
        prev.map((conv) => {
          if (conv._id !== convId) return conv;

          const updatedMessages = (conv.recentMessages || []).map(
            (msg: MessageType) => {
              const shouldReplace =
                msg.clientId &&
                official.clientId &&
                msg.clientId === official.clientId;

              if (shouldReplace) {
                console.log(
                  "[replacePendingInConv] ✅ Replacing pending message",
                  msg.clientId,
                  "with official",
                  official._id,
                );
                return official;
              }

              return msg;
            },
          );

          return {
            ...conv,
            recentMessages: updatedMessages,
          };
        }),
      );
    },
    [updateConversations],
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        conversations,
        updateConversations,
        activeConversation: _activeConversation,
        setActiveConversation,
        addPendingMessageToConversation,
        replacePendingInConv,
      }}
    >
      <ConversationsInitializer />
      <ConversationWatcher />
      {children}
    </SocketContext.Provider>
  );
};
