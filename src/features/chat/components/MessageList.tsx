// features/chat/components/MessageList.tsx
"use client";

import Image from "next/image";

interface Message {
  _id: string;
  senderId: {
    _id: string;
    username: string;
    profileImage: string;
  };
  message: string;
  message_type: string;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        messages.map((msg) => (
          <div
            key={msg._id}
            className={`mb-2 p-2 max-w-xs ${
              msg.senderId._id === currentUserId
                ? "bg-green-200 ml-auto"
                : "bg-gray-200"
            } rounded-lg`}
          >
            {/* Handle different message types */}
            {msg.message_type === "text" && <p>{msg.message}</p>}

            {msg.message_type === "image" && (
              <Image src={msg.message} alt="Image" width={200} height={200} />
            )}

            {msg.message_type === "video" && (
              <video src={msg.message} controls width="300" />
            )}

            {/* Sender Information */}
            <div className="mt-1 text-xs text-gray-500">
              <p>{msg.senderId.username}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MessageList;
