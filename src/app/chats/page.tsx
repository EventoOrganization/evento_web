"use client";

import { useSession } from "@/contexts/SessionProvider";
import { useSocket } from "@/contexts/SocketProvider";
import ChatInput from "@/features/chat/components/ChatInput";
import MessageList from "@/features/chat/components/MessageList";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Define the MessageType structure that matches MessageList's expectations
type MessageType = {
  _id: string;
  senderId: {
    _id: string;
    username: string;
    profileImage: string;
  };
  message: string;
  receiverId: string;
  timestamp: string;
  message_type: string;
};

export default function ChatPage() {
  const { token } = useSession();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversationId");
  const [messages, setMessages] = useState<any[]>([]);
  const { user } = useSession();
  const { socket } = useSocket();
  useEffect(() => {
    if (!socket) return;
    const fetchMessages = async () => {
      if (!conversationId) return;

      const result = await fetchData<MessageType[]>(
        `/chats/fetchMessages/${conversationId}`,
        HttpMethod.GET,
        null,
        token,
      );
      if (result.ok && result.data) {
        setMessages(result.data);
      }
    };

    fetchMessages();

    socket.on("send_message_emit", (newMessage: MessageType | null) => {
      if (newMessage) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    return () => {
      socket.off("send_message_emit");
    };
  }, [token, conversationId, socket]);

  const sendMessage = async (message: string) => {
    if (!conversationId) return;
    console.log(message);
    const body = {
      message,
      senderId: user?._id,
      conversationId,
      messageType: "text",
    };
    const result = await fetchData<MessageType>(
      `/chats/sendMessage`,
      HttpMethod.POST,
      body,
      token,
    );

    if (result.ok && result.data) {
      setMessages((prev) => [...prev, result.data]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <MessageList messages={messages} currentUserId={user?._id ?? ""} />
      <ChatInput onSendMessage={sendMessage} />
    </div>
  );
}
