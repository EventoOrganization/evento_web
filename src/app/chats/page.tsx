"use client";

import { useSession } from "@/contexts/SessionProvider";
import ChatInput from "@/features/chat/components/ChatInput";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useSearchParams } from "next/navigation";

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
  const { user } = useSession();

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
      console.log("Message sent:", result.data);
      // setMessages((prev) => [...prev, result.data]);
    }
  };

  return (
    <div className="flex flex-col h-full ">
      {conversationId ? (
        <>
          {/* <MessageList
            messages={messages}
            currentUserId={user?._id ?? ""}
            setMessages={setMessages}
          /> */}
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
