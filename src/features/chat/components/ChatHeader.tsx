// features/chat/components/ChatHeader.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSocket } from "@/contexts/SocketProvider";
import Image from "next/image";
const ChatHeader = () => {
  const { activeConversation } = useSocket();
  return (
    <div className="fixed w-full flex items-center p-4 bg-evento-gradient text-white border-b z-10">
      {activeConversation ? (
        <>
          <div className="relative w-10 h-10 mr-3 ">
            {activeConversation?.initialMedia[0]?.url ? (
              <Image
                src={activeConversation?.initialMedia[0]?.url || ""}
                alt={activeConversation?.title || ""}
                fill
                className="rounded-full"
              />
            ) : (
              <Avatar className="w-10 h-10 rounded-full">
                <AvatarImage
                  className="w-10 h-10 rounded-full"
                  src="https://github.com/shadcn.png"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
          </div>{" "}
        </>
      ) : (
        <p className="py-2">Select a conversation</p>
      )}
      <h3 className="text-lg font-bold">
        {activeConversation && activeConversation.title}
      </h3>
    </div>
  );
};

export default ChatHeader;
