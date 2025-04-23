// features/chat/components/ChatHeader.tsx
"use client";

import SmartImage from "@/components/SmartImage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSocket } from "@/contexts/(dev)/SocketProvider";
import { useEffect, useState } from "react";
const ChatHeader = () => {
  const { activeConversation } = useSocket();
  const [animationClass, setAnimationClass] = useState("");
  useEffect(() => {
    if (activeConversation) {
      setAnimationClass("animate-fade-in");
      const timeout = setTimeout(() => {
        setAnimationClass("");
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [activeConversation]);
  return (
    <div className="fixed w-full flex items-center p-4 bg-evento-gradient text-white border-b z-10 ">
      {activeConversation ? (
        <>
          <div className={`relative w-10 h-10 mr-3 ${animationClass}`}>
            {activeConversation?.initialMedia[0]?.url ? (
              <SmartImage
                src={activeConversation?.initialMedia[0]?.url || ""}
                alt={activeConversation?.title || ""}
                fill
                className="rounded-full "
              />
            ) : (
              <Avatar className="w-10 h-10 rounded-full">
                <AvatarImage
                  className="w-10 h-10 rounded-full"
                  src="/evento-logo.png"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
          </div>{" "}
        </>
      ) : (
        <p className={`py-2 ${animationClass}`}>Select a conversation</p>
      )}
      <h3 className={`text-lg font-bold ${animationClass}`}>
        {activeConversation && activeConversation.title}
      </h3>
    </div>
  );
};

export default ChatHeader;
