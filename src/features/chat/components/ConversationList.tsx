"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/contexts/SessionProvider";
import { useSocket } from "@/contexts/SocketProvider";
import { toast } from "@/hooks/use-toast";
import { useUsersStore } from "@/store/useUsersStore";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { startPrivateChat } from "./chatsActions";

const ConversationList = ({
  setIsOpen,
  onSelectConversation,
}: {
  setIsOpen: (isOpen: boolean) => void;
  onSelectConversation: (title: string, profileImageUrl: string) => void;
}) => {
  const { token } = useSession();
  const {
    conversations,
    updateConversations,
    setActiveConversation,
    activeConversation,
  } = useSocket();
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const router = useRouter();
  const { users } = useUsersStore();
  const [searchTerm, setSearchTerm] = useState("");
  // const { toast } = useToast();

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestedUsers([]);
    } else {
      const searchTermLower = searchTerm.toLowerCase(); // Optimisation pour ne pas recalculer à chaque utilisateur.
      const filteredUsers = users.filter((user) => {
        const userInConversations = conversations.some((conv) =>
          conv.title.toLowerCase().includes(user.username.toLowerCase()),
        );
        const userMatchesSearch =
          user.username.toLowerCase().includes(searchTermLower) ||
          (user.firstName ?? "").toLowerCase().includes(searchTermLower) ||
          (user.lastName ?? "").toLowerCase().includes(searchTermLower);
        return !userInConversations && userMatchesSearch; // Assure que l'utilisateur n'est pas déjà dans une conversation et correspond au terme de recherche.
      });
      setSuggestedUsers(filteredUsers);
    }
  }, [searchTerm, users, conversations]); // Ajout de `conversations` dans les dépendances pour garantir le rechargement.

  // const startPrivateChat = async (userId: string) => {
  //   try {
  //     const result = await fetchData<StartConversationResponse>(
  //       "/chats/startPrivateConversation",
  //       HttpMethod.POST,
  //       { userId },
  //       token,
  //     );
  //     if (result.ok && result.data) {
  //       console.log("Private chat started:", result.data);
  //       const conversation = result.data.conversation;
  //       const newConversation = {
  //         _id: conversation._id,
  //         title: `${conversation.reciverId?.username}`,
  //         lastMessage: "No messages yet",
  //         initialMedia: [
  //           {
  //             url:
  //               conversation.reciverId?.profileImage ||
  //               "/evento-logo.png",
  //           },
  //         ],
  //       };

  //       // Add the new conversation to the conversations list
  //       updateConversations((prev) => [...prev, newConversation]);

  //       // Set the new conversation as the active conversation
  //       setActiveConversation(newConversation);

  //       // Navigate to the new conversation
  //       router.push(`/chats?conversationId=${result.data.conversation._id}`);

  //       // Reset search term
  //       setSearchTerm("");
  //     }
  //   } catch (err) {
  //     console.error("Error starting private chat:", err);
  //   }
  // };

  const handleSelectConversation = (conversationId: string) => {
    const selectedConversation = conversations.find(
      (c) => c._id === conversationId,
    );
    if (selectedConversation) {
      setActiveConversation(selectedConversation);
      router.push(`/chats?conversationId=${conversationId}`);
      setIsOpen(false);
      onSelectConversation(
        selectedConversation.title,
        selectedConversation.initialMedia[0].url,
      );
    }
    setSearchTerm("");
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
        router.push("/chats");
        setActiveConversation(null);
        updateConversations((prev) =>
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
    <div className="flex-1 overflow-y-auto p-4 bg-gray-300 h-full">
      <div className="flex items-center gap-2 mb-2">
        {activeConversation && (
          <Button
            className="animate-slideInLeft duration-100 hidden md:block"
            onClick={() => setActiveConversation(false)}
          >
            <ArrowLeftIcon />
          </Button>
        )}
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className=""
          type="text"
          placeholder="Search or start new chat"
        />
      </div>
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
                <div className="relative w-10 h-10">
                  {conversation.initialMedia?.[0]?.url ? (
                    <Image
                      src={conversation.initialMedia?.[0]?.url || ""}
                      alt={conversation.title}
                      width={40}
                      height={40}
                      className="rounded-full w-10 h-10"
                    />
                  ) : (
                    <Avatar className="w-10 h-10 rounded-full">
                      <AvatarImage
                        className="w-10 h-10 rounded-full"
                        src="/evento-logo.png"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div>
                  <h3 className="font-bold truncate">{conversation.title}</h3>
                  <p className="text-sm text-gray-500">
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
              <button
                className="sr-only"
                onClick={() => deleteConversation(conversation._id)}
              >
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
              onClick={() =>
                startPrivateChat(
                  user._id,
                  token,
                  updateConversations,
                  setActiveConversation,
                  router,
                  setSearchTerm,
                )
              }
            >
              <div className="relative w-12 h-12 mr-4">
                {user.profileImage ? (
                  <Image
                    src={user.profileImage || "/evento-logo.png"}
                    alt={user.username}
                    fill
                    className="rounded-full"
                  />
                ) : (
                  <Avatar className="w-10 h-10 rounded-full">
                    <AvatarImage
                      className="w-10 h-10 rounded-full"
                      src="/evento-logo.png"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                )}
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
