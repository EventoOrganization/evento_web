"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import EzTag from "@ezstart/ez-tag";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../contexts/SocketProvider";
import { useSendMessage } from "../hooks/useSendMessage";
import { ConversationType } from "../types";

interface ChatInputProps {
  activeConversation: ConversationType | null;
}

export default function ChatInput({ activeConversation }: ChatInputProps) {
  const [text, setText] = useState("");
  const sendMessage = useSendMessage();
  const { user } = useSession();
  const { addPendingMessageToConversation } = useSocket();
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationId = activeConversation?._id;
  const disabled = !conversationId;

  useEffect(() => {
    if (conversationId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [conversationId]);

  const handleSend = async () => {
    if (!text.trim() || !conversationId || !user) return;
    const clientId =
      "cid_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
    const pendingMsg = {
      _id: clientId,
      senderId: user._id,
      conversationId,
      message: text,
      messageType: "text",
      createdAt: new Date().toISOString(),
      pending: true,
    };
    addPendingMessageToConversation(conversationId, pendingMsg);
    try {
      await sendMessage(conversationId, text);
      setText("");
    } catch (e) {
      console.error("Message failed:", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSend();
  };

  return (
    <form onSubmit={handleSubmit}>
      <EzTag as="div" className="p-4 border-t flex gap-2">
        <Input
          ref={inputRef}
          disabled={disabled}
          placeholder={
            disabled ? "Select a conversation" : "Write a message..."
          }
          className="text-[16px]"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button type="submit" disabled={disabled || !text.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </EzTag>
    </form>
  );
}
