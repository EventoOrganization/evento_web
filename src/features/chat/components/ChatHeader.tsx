// features/chat/components/ChatHeader.tsx
"use client";

import Image from "next/image";

interface ChatHeaderProps {
  title: string;
  profileImageUrl: string;
}

const ChatHeader = ({ title, profileImageUrl }: ChatHeaderProps) => {
  return (
    <div className="flex items-center p-4 bg-gray-100 border-b">
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
