import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@/contexts/SessionProvider";
import { useSocket } from "@/contexts/SocketProvider";
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
}

const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const { token } = useSession();
  const { activeConversation } = useSocket();
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
    } else {
      console.error("Failed to delete message");
    }
  };
  if (!activeConversation)
    return (
      <div className="flex h-full justify-center items-center bg-background">
        <p>No conversation selected</p>
      </div>
    );
  return (
    <div className="flex-1 overflow-y-auto p-2 pt-20 pb-14">
      {!messages || messages.length === 0 ? (
        <p>No messages found. Start the conversation by sending a message.</p>
      ) : (
        [...messages].reverse().map((msg: Message) => (
          <div
            key={msg._id}
            className={`flex items-center mb-2 ${
              msg.senderId._id === currentUserId ? "justify-end" : ""
            }`}
          >
            {msg.senderId._id !== currentUserId && (
              <div className="w-8 h-8 mr-2">
                {msg.senderId.profileImage ? (
                  <Image
                    src={msg.senderId.profileImage}
                    alt="Profile Image"
                    width={32}
                    height={32}
                    className="rounded-full w-8 h-8"
                  />
                ) : (
                  <Avatar className="w-8 h-8 rounded-full">
                    <AvatarImage
                      className="w-8 h-8 rounded-full"
                      src="/icon-384x384.png"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                )}
              </div>
            )}
            <div
              className={`flex flex-col max-w-[85%] p-2 rounded-lg ${
                msg.senderId._id === currentUserId
                  ? "bg-green-200"
                  : "bg-background"
              }`}
            >
              <p className="break-words whitespace-pre-wrap">{msg.message}</p>
            </div>
            {msg.senderId._id === currentUserId && (
              <button
                onClick={() => deleteMessage(msg._id)}
                className="hidden ml-2 text-red-500 text-sm"
              >
                Delete
              </button>
            )}
            {msg.senderId._id === currentUserId && (
              <div className="w-8 h-8 ml-2">
                {msg.senderId.profileImage ? (
                  <Image
                    src={msg.senderId.profileImage}
                    alt="Profile Image"
                    width={32}
                    height={32}
                    className="rounded-full w-8 h-8"
                  />
                ) : (
                  <Avatar className="w-8 h-8 rounded-full">
                    <AvatarImage
                      className="w-8 h-8 rounded-full"
                      src="/icon-384x384.png"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                )}
              </div>
            )}
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
