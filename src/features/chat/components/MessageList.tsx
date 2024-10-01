"use client";

import { useSession } from "@/contexts/SessionProvider";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import Image from "next/image";
import { useEffect, useRef } from "react";

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
  setMessages: (
    messages: ((prevMessages: Message[]) => Message[]) | Message[],
  ) => void;
}

const MessageList = ({
  messages,
  currentUserId,
  setMessages,
}: MessageListProps) => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const { token } = useSession();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const deleteMessage = async (messageId: string) => {
    const result = await fetchData(
      `/chats/deleteMessage/${messageId}`,
      HttpMethod.DELETE,
      null,
      token,
    );
    if (result.ok) {
      setMessages((prevMessages: Message[]) =>
        prevMessages.filter((msg: Message) => msg._id !== messageId),
      );
    } else {
      console.error("Failed to delete message");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 pt-20 ">
      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        messages.map((msg: Message) => (
          <div
            key={msg._id}
            className={`flex items-center mb-2 p-2 w-fit ${
              msg.senderId._id === currentUserId && "bg-green-200 ml-auto"
            }  rounded-lg`}
          >
            {msg.senderId._id !== currentUserId && (
              <div className="mr-2 w-8 h-8">
                <Image
                  src={msg.senderId.profileImage || "/default-profile.png"}
                  alt="Profile Image"
                  width={40}
                  height={40}
                  className="rounded-full w-8 h-8"
                />
              </div>
            )}
            <div
              className={`flex-grow  ${
                msg.senderId._id === currentUserId
                  ? "bg-green-200 ml-auto"
                  : "bg-gray-200 p-2 rounded-lg"
              }`}
            >
              {msg.message_type === "text" && <p>{msg.message}</p>}

              {msg.message_type === "image" && (
                <Image src={msg.message} alt="Image" width={200} height={200} />
              )}

              {msg.message_type === "video" && (
                <video src={msg.message} controls width="300" />
              )}

              {/* <div className="mt-1 text-xs text-gray-500">
                <p>{msg.senderId.username}</p>
              </div> */}
            </div>
            {msg.senderId._id === currentUserId && (
              <button
                onClick={() => deleteMessage(msg._id)}
                className="ml-2 text-red-500 text-sm sr-only"
              >
                Supprimer
              </button>
            )}
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
