"use client";

import { useSession } from "@/contexts/(prod)/SessionProvider";
import { formatTime } from "@/utils/formatTime";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../contexts/SocketProvider";
import { useOnMessage } from "../hooks/useOnMessage";
import { ConversationType, MessageType } from "../types";

interface ChatMessagesProps {
  activeConversation: ConversationType | null;
}

export default function ChatMessages({
  activeConversation,
}: ChatMessagesProps) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const { user } = useSession();
  const { conversations, updateConversations } = useSocket();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Listen for new messages
  useOnMessage((msg: MessageType) => {
    console.log("[Chat] New message received:", msg);

    if (msg.conversationId === activeConversation?._id) {
      setMessages((prev) => [...prev, msg]);
    }

    updateConversations((prevConvs) =>
      prevConvs.map((conv) => {
        if (conv._id === msg.conversationId) {
          const updatedConv = {
            ...conv,
            recentMessages: [...(conv.recentMessages || []), msg],
            lastMessage: msg,
          };
          console.log("[Chat] Updating conversation:", updatedConv);
          return updatedConv;
        }
        return conv;
      }),
    );
  });

  // Update messages
  useEffect(() => {
    if (!activeConversation) return;
    const conv = conversations.find((c) => c._id === activeConversation._id);
    if (!conv) return;
    const sortedMessages = [...(conv.recentMessages || [])].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    setMessages(sortedMessages || []);
  }, [activeConversation]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto px-4 py-2 space-y-4 text-xs">
      {messages.map((msg, i) => {
        const isMine = msg.senderId === user?._id;
        const isLast = i === messages.length - 1;
        const timestamp = msg.createdAt;
        return (
          <div
            key={msg._id}
            className={`flex mb-2 ${isMine ? "justify-end" : "justify-start"}`}
          >
            <div
              ref={isLast ? bottomRef : null}
              className={`px-4 py-2 rounded-lg max-w-xs md:max-w-md text-sm break-words ${
                isMine
                  ? "bg-eventoPurpleDark text-white rounded-br-none"
                  : "bg-muted  rounded-bl-none"
              }`}
            >
              {msg.message}
              {/* Si tu veux ajouter l'heure plus tard, ici */}
              {timestamp && (
                <div className="text-[10px] text-right mt-1 opacity-50">
                  {formatTime(timestamp)}
                </div>
              )}
              {/* <div className="text-[10px] text-right mt-1 opacity-50">{formatTime(msg.createdAt)}</div> */}
            </div>
          </div>
        );
      })}
    </div>
  );
}
