"use client";
import { useSocket } from "@/app/(views)/(dev)/chats/contexts/SocketProvider";
import { useEffect, useState } from "react";
import { MessageType } from "../types";

interface ChatMessagesProps {
  conversationId: string;
}

export default function ChatMessages({ conversationId }: ChatMessagesProps) {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<MessageType[]>([]);

  useEffect(() => {
    const handler = (msg: MessageType) => {
      // ton schéma doit inclure `msg.constantId` ou `msg.conversationId`
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket?.on("send_message_emit", handler);
    return () => {
      socket?.off("send_message_emit", handler);
    };
  }, [socket, conversationId]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`max-w-[75%] p-3 rounded-lg ${
            msg.senderId /* ton user._id */ === conversationId
              ? "self-start bg-muted"
              : "self-end bg-evento-gradient text-white"
          }`}
        >
          {msg.message /* ou msg.text selon ton modèle */}
        </div>
      ))}
    </div>
  );
}
