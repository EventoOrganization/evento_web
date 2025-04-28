import { useSession } from "@/contexts/(prod)/SessionProvider";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../contexts/SocketProvider";
import { markAsRead } from "../functions/markAsRead";
import { useOnMessage } from "../hooks/useOnMessage";
import { ConversationType, MessageType } from "../types";
import { sortMessagesByCreatedAt } from "../utils/sortMessages";
import { useOlderMessages } from "./useOlderMessages";

export function useChatMessages(activeConversation: ConversationType | null) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [noMoreMessages, setNoMoreMessages] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollDown, setCanScrollDown] = useState(true);
  const { user, token } = useSession();
  const { conversations, updateConversations, socket } = useSocket();
  const { fetchOlderMessages } = useOlderMessages(
    activeConversation?._id || null,
  );

  // Puis dans ton useEffect:
  useEffect(() => {
    if (canScrollDown) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      if (!token) return;
      markAsRead({
        socket,
        activeConversationId: activeConversation?._id || "",
        messages,
        scrollRef,
      });
    }
  }, [messages]);

  useOnMessage((msg: MessageType) => {
    if (msg.conversationId !== activeConversation?._id) return;
    setCanScrollDown(true);
    console.log("[Chat] 🔔 New incoming message:", msg);

    setMessages((prev) => [...prev, msg]);
    updateConversations((prevConvs) =>
      prevConvs.map((conv) =>
        conv._id === msg.conversationId
          ? {
              ...conv,
              recentMessages: [...(conv.recentMessages || []), msg],
              lastMessage: msg,
            }
          : conv,
      ),
    );
  });

  useEffect(() => {
    if (!activeConversation) return;
    const conv = conversations.find((c) => c._id === activeConversation._id);
    if (!conv) return;
    setMessages(sortMessagesByCreatedAt(conv.recentMessages || []));
    setNoMoreMessages(false);
  }, [activeConversation]);

  const loadOlderMessages = async () => {
    setCanScrollDown(false);
    if (!messages.length || noMoreMessages) {
      console.log("[Chat] ⚠️ No messages or no more messages to load.");
      return;
    }

    console.log(
      "[Chat] 📜 Fetching older messages before:",
      messages[0]?.createdAt,
    );

    const oldest = messages[0];
    const { messages: older, hasMore } = await fetchOlderMessages(
      oldest.createdAt,
    );

    if (older.length) {
      console.log(`[Chat] ✅ Fetched ${older.length} older messages`);
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
    scrollRef,
  };
}
