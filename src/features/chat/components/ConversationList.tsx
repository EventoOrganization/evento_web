"use client";

import { useSession } from "@/contexts/SessionProvider";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Conversation {
  _id: string;
  title: string;
  lastMessage: string;
  initialMedia: { url: string }[];
}

const ConversationList = () => {
  const { token } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchConversations = async () => {
      const result = await fetchData<Conversation[]>(
        "/chats/fetchConversations",
        HttpMethod.GET,
        null,
        token,
      );
      if (result.ok && result.data) {
        setConversations(result.data);
      }
    };

    fetchConversations();
  }, [token]);

  const handleSelectConversation = (conversationId: string) => {
    router.push(`/chats?conversationId=${conversationId}`);
  };
  console.log(conversations);
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {conversations.length === 0 ? (
        <p>No conversations found.</p>
      ) : (
        <ul className="space-y-2">
          {conversations.map((conversation) => (
            <li
              key={conversation._id}
              className="flex items-center p-2 bg-white rounded-lg shadow cursor-pointer"
              onClick={() => handleSelectConversation(conversation._id)}
            >
              <div className="relative w-12 h-12 mr-4">
                <Image
                  src={
                    conversation.initialMedia?.[0]?.url || "/defaultImage.png"
                  }
                  alt={conversation.title}
                  fill
                  className="rounded-full"
                />
              </div>
              <div>
                <h3 className="font-bold">{conversation.title}</h3>
                <p className="text-sm text-gray-500">
                  {conversation.lastMessage}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConversationList;
