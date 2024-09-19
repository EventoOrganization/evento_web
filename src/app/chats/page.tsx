// app/chats/page.tsx
"use client";

import { useSession } from "@/contexts/SessionProvider";
import ChatInput from "@/features/chat/components/ChatInput";
import MessageList from "@/features/chat/components/MessageList";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

// Define the MessageType structure
type MessageType = {
  _id: string;
  senderId: string;
  message: string;
  receiverId: string;
  timestamp: string;
  message_type: number;
};

export default function ChatPage() {
  const { token } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]); // Type messages as an array of MessageType
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Fetch initial messages when the page loads
    const fetchMessages = async () => {
      const result = await fetchData<MessageType[]>(
        "/chats/messages",
        HttpMethod.GET,
        null,
        token,
      );
      if (result.ok && result.data) {
        setMessages(result.data); // Messages will now be of the correct type
      }
    };

    fetchMessages();

    if (socketRef.current) {
      socketRef.current.on(
        "send_message_emit",
        (newMessage: MessageType | null) => {
          if (newMessage) {
            // TypeScript still allows null, so we add an explicit check to only allow valid MessageType
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          }
        },
      );
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("send_message_emit");
      }
    };
  }, [token]);

  const sendMessage = async (message: string) => {
    const body = { message, senderId: user?._id };
    const result = await fetchData<MessageType>(
      "/chats/sendMessage",
      HttpMethod.POST,
      body,
      token,
    );

    if (result.ok && result.data) {
      setMessages((prev) => [...prev, result.data]); // Add the new message to the state
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <MessageList messages={messages} />
      <ChatInput onSendMessage={sendMessage} />
    </div>
  );
}
