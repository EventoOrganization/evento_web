"use client";

import { useSession } from "@/contexts/(prod)/SessionProvider";
import { useEffect, useState } from "react";
import { useSocket } from "../contexts/SocketProvider";
import { useOnMessage } from "../hooks/useOnMessage";
import { MessageType } from "../types";

interface ChatMessagesProps {
  conversationId: string;
}

export default function ChatMessages({ conversationId }: ChatMessagesProps) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const { user } = useSession();
  const { conversations } = useSocket();

  useOnMessage((msg: MessageType) => {
    console.log("[Chat] New message received in ChatMessages:", msg);
    if (msg.conversationId === conversationId) {
      setMessages((prev) => [...prev, msg]);
    }
  });

  useEffect(() => {
    if (!conversationId) return;
    const conv = conversations.find((c) => c._id === conversationId);
    if (!conv) return;
    setMessages(conv.recentMessages || []);
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
      {messages.map((msg) => (
        <div
          key={msg._id}
          className={`max-w-[75%] p-3 rounded-lg ${
            msg.senderId === user?._id
              ? "self-end bg-evento-gradient text-white"
              : "self-start bg-muted"
          }`}
        >
          {msg.message}
        </div>
      ))}
    </div>
  );
}
