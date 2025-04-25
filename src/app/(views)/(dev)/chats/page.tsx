"use client";
import ComingSoon from "@/components/ComingSoon";
import { cn } from "@/lib/utils";
import EzTag from "@ezstart/ez-tag";
import { useState } from "react";
import { ChatHeader } from "./components/ChatHeader";
import ChatInput from "./components/ChatInput";
import ChatMessages from "./components/ChatMessages";
import { ConversationSidebar } from "./components/ConversationSidebar";

const ChatPage = () => {
  const [isConvSelected, setIsConvSelected] = useState(false);
  const dev = process.env.NODE_ENV === "development";

  return (
    <>
      <ChatHeader
        isConvSelected={isConvSelected}
        onBack={() => setIsConvSelected(false)}
      />

      <EzTag as="div" className="flex h-full pb-16">
        {!dev ? (
          <ComingSoon
            className="w-full md:w-fit"
            message="Conversation sidebar is currently under development"
          />
        ) : (
          <ConversationSidebar
            isConvSelected={isConvSelected}
            onSelect={() => setIsConvSelected(true)}
          />
        )}

        <EzTag
          as="div"
          className={cn("flex-1 flex flex-col h-full bg-background", {
            "hidden md:flex": !isConvSelected,
          })}
        >
          <EzTag as="div" className="bg-muted p-4 border-b font-bold text-lg">
            {!dev ? (
              <>
                <h2>Receiver Name</h2>
                <p className="text-xs text-muted-foreground">Statue</p>
              </>
            ) : (
              <>
                <h2>Chat with Alice</h2>
                <p className="text-xs text-muted-foreground">Online</p>
              </>
            )}
          </EzTag>

          {!dev ? (
            <ComingSoon message="Chat messages is currently under development" />
          ) : (
            <ChatMessages receiverId="123" />
          )}
          <ChatInput receiverId="123" />
        </EzTag>
      </EzTag>
    </>
  );
};

export default ChatPage;
