"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EzTag from "@ezstart/ez-tag";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSendMessage } from "../hooks/useSendMessage";

interface ChatInputProps {
  conversationId: string;
}

export default function ChatInput({ conversationId }: ChatInputProps) {
  const [text, setText] = useState("");
  const sendMessage = useSendMessage();
  const inputRef = useRef<HTMLInputElement>(null);

  const disabled = !conversationId;

  useEffect(() => {
    if (conversationId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [conversationId]);

  const handleSend = async () => {
    if (!text.trim()) return;

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
