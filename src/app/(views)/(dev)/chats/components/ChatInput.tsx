"use client";
import { useSocket } from "@/contexts/(dev)/SocketProvider";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { Send } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
  receiverId: string;
}

export default function ChatInput({ receiverId }: ChatInputProps) {
  const [text, setText] = useState("");
  const { socket } = useSocket();
  const { user } = useSession();

  const handleSend = () => {
    if (!text.trim() || !user) return;

    const message = {
      senderId: user._id,
      receiverId,
      text,
      createdAt: new Date().toISOString(),
    };

    socket?.emit("message:send", message);
    setText("");
  };

  return (
    <div className="p-4 border-t flex gap-2">
      <input
        className="flex-1 border px-4 py-2 rounded-lg text-sm"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={handleSend}
        className="bg-evento-gradient text-white px-4 py-2 rounded-lg text-sm"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
}
