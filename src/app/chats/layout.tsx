"use client";

import Burger from "@/components/Burger";
import ChatHeader from "@/features/chat/components/ChatHeader";
import ConversationList from "@/features/chat/components/ConversationList";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const handleSelectConversation = () => {
    setIsOpen(false);
  };
  return (
    <>
      <Burger
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        className="z-10 absolute top-5 right-5 md:hidden"
      />
      <div className="h-screen w-screen fixed inset-0 md:pb-0">
        <div className="flex w-full h-full">
          {/* Sidebar for Conversations */}
          <div
            className={cn(
              "md:flex transition-all md:opacity-100 md:translate-x-0 duration-300 md:w-1/4  md:min-w-72 h-full flex-col",
              {
                "translate-x-[-100%] w-0 opacity-0": !isOpen,
                "translate-x-0 w-full opacity-100": isOpen,
              },
            )}
          >
            <ConversationList
              setIsOpen={setIsOpen}
              onSelectConversation={handleSelectConversation}
            />
          </div>

          {/* Chat content (messages) */}
          <div
            className={cn(
              "md:w-3/4 w-full transition-all duration-300 flex flex-col h-full",
              {
                "w-0 opacity-0": isOpen,
              },
            )}
          >
            <ChatHeader />
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
