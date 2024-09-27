"use client";
import { Input } from "@/components/ui/input";
import { useSession } from "@/contexts/SessionProvider";
import { useSocket } from "@/contexts/SocketProvider";
import { useEventoStore } from "@/store/useEventoStore";
import { UserType } from "@/types/UserType";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Importe useRouter
import { useState } from "react";
import { getConversationDetails } from "./action";
const ConversationList = ({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const {
    conversations,
    deleteConversation,
    startPrivateChat,
    setActiveConversation,
  } = useSocket();
  const { user } = useSession();
  const { users } = useEventoStore((state) => ({
    users: state.users as UserType[],
  }));
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter(); // Ajoute le hook useRouter

  const privateConversationUserIds = conversations
    .filter((conv) => !conv.groupId)
    .map((conv) => {
      const isSender = conv.senderId === user?._id;
      return isSender ? conv.reciverId : conv.senderId;
    })
    .filter((id): id is string => typeof id === "string");

  const filteredConversations = conversations.filter((conversation) => {
    const { title } = getConversationDetails(conversation, user);
    const lastMessage = conversation?.lastMessage || "";

    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const filteredUsers = searchTerm
    ? users.filter(
        (u) =>
          !privateConversationUserIds.includes(u._id) &&
          (u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${u.firstName} ${u.lastName}`
              .toLowerCase()
              .includes(searchTerm.toLowerCase())),
      )
    : [];
  const handleSelectConversation = (conversation: any) => {
    setActiveConversation(conversation);
    router.push(`/chats?conversationId=${conversation._id}`);
    setIsOpen(false);
    setSearchTerm("");
  };
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <Input
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        className="mb-2"
        type="text"
        placeholder="Search or start new chat"
      />

      {filteredConversations.length === 0 && filteredUsers.length === 0 ? (
        <p>No conversations found.</p>
      ) : (
        <ul className="space-y-2 mb-2">
          {filteredConversations.map((conversation) => {
            const { title, profileImageUrl } = getConversationDetails(
              conversation,
              user,
            );
            return (
              <li
                key={conversation._id}
                className="flex items-center justify-between p-2 bg-white rounded-lg shadow cursor-pointer"
                onClick={() => {
                  handleSelectConversation(conversation);
                }}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative w-12 h-12">
                    <Image
                      src={profileImageUrl}
                      alt={title}
                      width={30}
                      height={30}
                      className="rounded-full w-full h-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold truncate">{title}</h3>
                    <p className="text-sm text-gray-500">
                      {conversation.lastMessage || "No messages yet"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conversation._id);
                  }}
                >
                  delete
                </button>
              </li>
            );
          })}

          {filteredUsers.map((user) => (
            <li
              key={user._id}
              className="flex items-center justify-between p-2 bg-white rounded-lg shadow cursor-pointer"
              onClick={() => {
                startPrivateChat(user._id);
                setSearchTerm("");
              }}
            >
              <div className="flex items-center space-x-4">
                <div className="relative w-12 h-12">
                  <Image
                    src={user.profileImage || ""}
                    alt={user.username}
                    width={30}
                    height={30}
                    className="rounded-full w-full h-full"
                  />
                </div>
                <div>
                  <h3 className="font-bold truncate">{user.username}</h3>
                  <p className="text-sm text-gray-500">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConversationList;
