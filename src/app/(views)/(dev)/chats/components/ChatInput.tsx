"use client";

import { useSocket } from "@/app/(views)/(dev)/chats/contexts/SocketProvider";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import EzTag from "@ezstart/ez-tag";
import { Send } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
  conversationId: string; // remplace receiverId
}

export default function ChatInput({ conversationId }: ChatInputProps) {
  const [text, setText] = useState("");
  const { socket } = useSocket();
  const { user } = useSession();

  const handleSend = () => {
    if (!text.trim() || !user) return;

    socket?.emit("send_message", {
      conversationId,
      senderId: user._id,
      message: text,
      messageType: "text",
    });
    setText("");
  };

  const disabled = !conversationId;

  return (
    <EzTag as="div" className="p-4 border-t flex gap-2">
      <input
        disabled={disabled}
        className="flex-1 border px-4 py-2 rounded-lg text-sm disabled:opacity-50"
        placeholder={
          disabled ? "Sélectionnez une conversation" : "Écrivez un message…"
        }
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        className="bg-evento-gradient text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
      >
        <Send className="w-4 h-4" />
      </button>
    </EzTag>
  );
}
