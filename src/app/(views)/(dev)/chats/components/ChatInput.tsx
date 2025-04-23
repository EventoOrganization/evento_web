// features/chat/components/ChatInput.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyboardEvent, useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent the default action to avoid line breaks for example
      handleSendMessage();
    }
  };

  return (
    <div className="fixed w-full xl:w-3/4 bottom-0 right-0 p-2 border-t flex gap-2 items-center bg-evento-gradient">
      <Input
        type="text"
        className=""
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
      />
      <Button variant={"outline"} onClick={handleSendMessage} className="">
        Send
      </Button>
    </div>
  );
};

export default ChatInput;
