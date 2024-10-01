"use client";
import { useSession } from "@/contexts/SessionProvider";
import { useSocket } from "@/contexts/SocketProvider";
import ChatInput from "@/features/chat/components/ChatInput";
import MessageList from "@/features/chat/components/MessageList";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

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
  const { socket, messages, setMessages, activeConversation } = useSocket();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversationId");
  const { user } = useSession();
  console.log(activeConversation);
  useEffect(() => {
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
  }, [token, conversationId, setMessages]);

  // Join the conversation room when the conversationId is available
  useEffect(() => {
    if (socket && conversationId) {
      console.log(`Joining conversation room with ID: ${conversationId}`);
      socket.emit("join_conversations", {
        conversationIds: [conversationId],
      });
    }
  }, [socket, conversationId]);

  const sendMessage = (message: string) => {
    if (!conversationId || !user?._id) return;

    const messageData = {
      message,
      senderId: user._id,
      conversationId,
      messageType: "text",
    };

    // Emit the message via the socket
    socket?.emit("send_message", messageData);

    console.log("Message sent via socket:", messageData);
  };

  return (
    <div className="flex flex-col h-full ">
      {conversationId ? (
        <>
          <MessageList
            messages={messages}
            currentUserId={user?._id ?? ""}
            setMessages={setMessages}
          />
          <ChatInput onSendMessage={sendMessage} />
        </>
      ) : (
        <div className="flex h-full justify-center items-center bg-background">
          <p>No conversation selected</p>
        </div>
      )}
    </div>
  );
}
