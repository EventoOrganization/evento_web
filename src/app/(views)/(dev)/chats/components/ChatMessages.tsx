"use client";
import { useSocket } from "@/contexts/(dev)/SocketProvider";
import { useEffect, useState } from "react";
import { MessageType } from "../types";

interface ChatMessagesProps {
  receiverId: string;
}

export default function ChatMessages({ receiverId }: ChatMessagesProps) {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<MessageType[]>([]);

  useEffect(() => {
    socket?.on("message:receive", (message: MessageType) => {
      if (message.receiverId === receiverId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket?.off("message:receive");
    };
  }, [receiverId]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`max-w-[75%] p-3 rounded-lg ${
            msg.senderId === receiverId
              ? "self-start bg-muted"
              : "self-end bg-evento-gradient text-white"
          }`}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
}
