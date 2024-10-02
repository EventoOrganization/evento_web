"use client";
import { useSession } from "@/contexts/SessionProvider";
import { useSocket } from "@/contexts/SocketProvider";
import ChatInput from "@/features/chat/components/ChatInput";
import MessageList from "@/features/chat/components/MessageList";
import { useSearchParams } from "next/navigation";

export default function ChatPage() {
  const { socket, activeConversation } = useSocket();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversationId");
  const { user } = useSession();

  const sendMessage = (message: string) => {
    if (!conversationId || !user?._id) return;

    const messageData = {
      message,
      senderId: user._id,
      conversationId,
      messageType: "text",
    };
    socket?.emit("send_message", messageData);
  };

  return (
    <div className="flex flex-col h-full relative w-full">
      {conversationId ? (
        <>
          <MessageList
            messages={activeConversation?.messages}
            currentUserId={user?._id ?? ""}
          />
          {activeConversation && <ChatInput onSendMessage={sendMessage} />}
        </>
      ) : (
        <div className="flex h-full justify-center items-center bg-background">
          <p>No conversation selected</p>
        </div>
      )}
    </div>
  );
}
