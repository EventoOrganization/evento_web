"use client";

import { Input } from "@/components/ui/input";
import { useSession } from "@/contexts/SessionProvider";
import { toast } from "@/hooks/use-toast";
import { useEventoStore } from "@/store/useEventoStore";
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
interface StartConversationResponse {
  conversation: {
    _id: string;
  };
}
const ConversationList = ({
  setIsOpen,
  onSelectConversation,
}: {
  setIsOpen: (isOpen: boolean) => void;
  onSelectConversation: (title: string, profileImageUrl: string) => void;
}) => {
  const { token, user } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [privateConversationUserIds, setPrivateConversationUserIds] = useState<
    string[]
  >([]);
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const router = useRouter();
  const { users } = useEventoStore((state) => state);
  const [searchTerm, setSearchTerm] = useState("");
  // const { toast } = useToast();
  useEffect(() => {
    const fetchConversations = async () => {
      const result = await fetchData<any[]>(
        "/chats/fetchConversations",
        HttpMethod.GET,
        null,
        token,
      );
      if (result.ok && result.data) {
        console.log("Conversations:", result);
        const structuredConversations = result.data.map((conversation) => {
          // Determine if the logged-in user is the sender or receiver, then set accordingly
          const isSender = conversation.senderId._id === user?._id;
          const otherUser = isSender
            ? conversation.reciverId
            : conversation.senderId;

          // Standard fields
          const conversationData = {
            _id: conversation._id,
            title: "",
            lastMessage: conversation.lastmessage?.message || "No messages yet",
            initialMedia: conversation.groupId
              ? conversation.groupId.eventId?.initialMedia || []
              : [{ url: otherUser.profileImage || "/defaultImage.png" }],
          };

          // Adjust based on conversation type
          if (conversation.groupId) {
            // Group conversation logic remains unchanged
            conversationData.title =
              conversation.groupId.groupName || "Group Chat";
            conversationData.initialMedia =
              conversation.groupId.eventId?.initialMedia || [];
          } else {
            // Private conversation uses other user's data
            conversationData.title = otherUser.username || "Private Chat";
            conversationData.initialMedia =
              [{ url: otherUser.profileImage }] || [];
          }

          return conversationData;
        });

        setConversations(structuredConversations);
        const privateUserIds = result.data
          .filter(
            (conversation) =>
              !conversation.groupId && conversation.senderId._id !== user?._id, // Exclure les conversations de groupe
          )
          .map((conversation) => conversation.senderId._id);
        setPrivateConversationUserIds(privateUserIds);
      }
    };
    fetchConversations();
  }, [user]);
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestedUsers([]);
    } else {
      const filteredUsers = users.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return (
          !privateConversationUserIds.includes(user._id) && // Exclure les utilisateurs avec qui il y a déjà une conversation privée
          (user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fullName.includes(searchTerm.toLowerCase()))
        );
      });
      setSuggestedUsers(filteredUsers);
    }
  }, [searchTerm, users, privateConversationUserIds]);
  const startPrivateChat = async (userId: string) => {
    try {
      const result = await fetchData<StartConversationResponse>(
        "/chats/startPrivateConversation",
        HttpMethod.POST,
        { userId },
        token,
      );
      if (result.ok && result.data) {
        router.push(`/chats?conversationId=${result.data.conversation._id}`);
        setSearchTerm("");
      }
    } catch (err) {
      console.error("Error starting private chat:", err);
    }
  };
  const handleSelectConversation = (conversationId: string) => {
    const selectedConversation = conversations.find(
      (c) => c._id === conversationId,
    );
    if (selectedConversation) {
      console.log(selectedConversation);
      router.push(`/chats?conversationId=${conversationId}`);
      setIsOpen(false);
      onSelectConversation(
        selectedConversation.title,
        selectedConversation.initialMedia[0].url,
      );
    }
  };
  const filteredConversations = conversations.filter((conversation) => {
    return (
      conversation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (conversation.lastMessage &&
        conversation.lastMessage
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
    );
  });

  const deleteConversation = async (conversationId: string) => {
    try {
      const result = await fetchData(
        `/chats/deleteConversation/${conversationId}`,
        HttpMethod.DELETE,
        { conversationId },
        token,
      );
      if (result.ok) {
        toast({
          description: "Conversation deleted successfully",
          className: "bg-evento-gradient text-white",
          duration: 3000,
        });
        setConversations((prev) =>
          prev.filter((c) => c._id !== conversationId),
        );
      }
    } catch (err) {
      toast({
        description: "Failed to delete conversation",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-2"
        type="text"
        placeholder="Search or start new chat"
      />

      {filteredConversations.length === 0 ? (
        <p>No conversations found.</p>
      ) : (
        <ul className="space-y-2 mb-2">
          {filteredConversations.map((conversation) => (
            <li
              key={conversation._id}
              className="flex items-center justify-between p-2 bg-white rounded-lg shadow cursor-pointer"
              onClick={() => handleSelectConversation(conversation._id)}
            >
              <div className="flex items-center space-x-4">
                <div className="relative w-12 h-12">
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
                  <h3 className="font-bold truncate">{conversation.title}</h3>
                  <p className="text-sm text-gray-500">
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
              <button onClick={() => deleteConversation(conversation._id)}>
                delete
              </button>
            </li>
          ))}
        </ul>
      )}
      {suggestedUsers.length > 0 && (
        <ul className="mb-4 space-y-2">
          {suggestedUsers.map((user) => (
            <li
              key={user._id}
              className="flex items-center p-2 bg-white rounded-lg shadow cursor-pointer"
              onClick={() => startPrivateChat(user._id)}
            >
              <div className="relative w-12 h-12 mr-4">
                <Image
                  src={user.profileImage || "/defaultImage.png"}
                  alt={user.username}
                  fill
                  className="rounded-full"
                />
              </div>
              <div>
                <h3 className="font-bold">{user.username}</h3>
                <p className="text-sm text-gray-500">
                  {user.firstName} {user.lastName}
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
