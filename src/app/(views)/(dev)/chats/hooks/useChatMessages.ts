import { useSession } from "@/contexts/(prod)/SessionProvider";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../contexts/SocketProvider";
import { markAsRead } from "../functions/markAsRead";
// import { useOnMessage } from "../hooks/useOnMessage";
import { ConversationType, MessageType } from "../types";
import { sortMessagesByCreatedAt } from "../utils/sortMessages";
import { useOlderMessages } from "./useOlderMessages";

export function useChatMessages(activeConversation: ConversationType | null) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [noMoreMessages, setNoMoreMessages] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastSeenMessageId = useRef<string | null>(null);
  const [canScrollDown, setCanScrollDown] = useState(true);
  const { user, token } = useSession();
  const { conversations, socket, updateConversations } = useSocket();
  const { fetchOlderMessages } = useOlderMessages(
    activeConversation?._id || null,
  );

  useEffect(() => {
    if (canScrollDown) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!activeConversation || !user || !messages.length || !socket || !token) {
      return;
    }

    const latestMessage = messages[messages.length - 1];

    if (lastSeenMessageId.current === latestMessage._id) {
      return;
    }

    lastSeenMessageId.current = latestMessage._id;

    markAsRead({
      socket,
      activeConversationId: activeConversation._id,
      messages,
      bottomRef,
    });

    updateConversations((prevConvs) =>
      prevConvs.map((conv) =>
        conv._id === activeConversation._id
          ? {
              ...conv,
              readReceipts: {
                ...(conv.readReceipts || {}),
                [user._id]: latestMessage._id,
              },
              unreadCounts: {
                ...(conv.unreadCounts || {}),
                [user._id]: 0,
              },
            }
          : conv,
      ),
    );
  }, [messages, activeConversation, socket, token]);

  useEffect(() => {
    if (!activeConversation) return;
    const conv = conversations.find((c) => c._id === activeConversation._id);
    if (!conv) return;
    setMessages(sortMessagesByCreatedAt(conv.recentMessages || []));
    setNoMoreMessages(false);
  }, [activeConversation, conversations]);

  const loadOlderMessages = async () => {
    setCanScrollDown(false);
    if (!messages.length || noMoreMessages) {
      console.log("[Chat] ⚠️ No messages or no more messages to load.");
      return;
    }

    const oldest = messages[0];
    const { messages: older, hasMore } = await fetchOlderMessages(
      oldest.createdAt,
    );

    if (older.length) {
      setMessages((prev) => sortMessagesByCreatedAt([...older, ...prev]));
    } else {
      console.log("[Chat] 🛑 No older messages fetched (empty array)");
    }

    if (!hasMore) {
      console.log("[Chat] 🚫 Backend says no more older messages.");
      setNoMoreMessages(true);
    }
  };

  return {
    messages,
    user,
    loadOlderMessages,
    noMoreMessages,
    bottomRef,
  };
}
