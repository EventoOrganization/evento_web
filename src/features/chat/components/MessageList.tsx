// features/chat/components/MessageList.tsx
"use client";

import Image from "next/image";

interface Message {
  _id: string;
  senderId: string;
  message: string;
  message_type: number;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        messages.map((msg) => (
          <div
            key={msg._id}
            className={`mb-2 p-2 max-w-xs ${
              msg.senderId === "currentUserId"
                ? "bg-green-200 ml-auto"
                : "bg-gray-200"
            } rounded-lg`}
          >
            {msg.message_type === 1 ? (
              <p>{msg.message}</p>
            ) : msg.message_type === 2 ? (
              <Image src={msg.message} alt="Image" width={200} height={200} />
            ) : msg.message_type === 3 ? (
              <video src={msg.message} controls width="300" />
            ) : null}
          </div>
        ))
      )}
    </div>
  );
};

export default MessageList;
