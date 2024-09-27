// features/chat/components/ChatHeader.tsx
"use client";

import { useSession } from "@/contexts/SessionProvider";
import { useSocket } from "@/contexts/SocketProvider";
import Image from "next/image";
import { getConversationDetails } from "./action";

const ChatHeader = () => {
  const { activeConversation } = useSocket();
  const { user } = useSession();
  console.log(activeConversation);
  const { title, profileImageUrl } = getConversationDetails(
    activeConversation,
    user,
  );
  return (
    <div className="fixed w-full flex items-center p-4 bg-gray-200 border-b">
      <div className="relative w-10 h-10 mr-3">
        <Image
          src={profileImageUrl || "/defaultImage.png"}
          alt={title}
          fill
          className="rounded-full"
        />
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
  );
};

export default ChatHeader;
