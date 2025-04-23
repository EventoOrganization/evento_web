"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";
import { ConversationSidebar } from "./ConversationSidebar";

const ChatPage = () => {
  const [isConvSelected, setIsConvSelected] = useState(false);

  return (
    <>
      <ChatHeader
        isConvSelected={isConvSelected}
        onBack={() => setIsConvSelected(false)}
      />

      <div className="flex h-full pb-16">
        <ConversationSidebar
          isConvSelected={isConvSelected}
          onSelect={() => setIsConvSelected(true)}
        />

        <div
          className={cn("flex-1 flex flex-col h-full bg-background", {
            "hidden md:flex": !isConvSelected,
          })}
        >
          <div className="bg-muted p-4 border-b font-bold text-lg h-16">
            <h2>Chat with Alice</h2>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>

          <ChatMessages />
          <ChatInput />
        </div>
      </div>
    </>
  );
};

export default ChatPage;
