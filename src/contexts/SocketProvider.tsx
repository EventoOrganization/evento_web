"use client";
import { useSession } from "@/contexts/SessionProvider";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

export interface ConversationType {
  _id: string;
  title: string;
  lastMessage: string;
  unread: boolean;
  initialMedia: { url: string }[];
  messages: MessageType[];
  reciverId: string;
  senderId: string;
  groupId: string;
}

export interface MessageType {
  _id: string;
  conversationId: string;
  message: string;
  senderId: string;
  timestamp: string;
}

interface SocketContextType {
  socket: Socket | null;
  messages: MessageType[];
  conversations: ConversationType[];
  activeConversation: ConversationType | null;
  setActiveConversation: (conversation: ConversationType | null) => void;
  startPrivateChat: (userId: string) => void; // Pour démarrer une nouvelle conversation
  selectConversation: (conversationId: string) => void; // Pour sélectionner une conversation
  deleteConversation: (conversationId: string) => void; // Pour supprimer une conversation
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<ConversationType | null>(null);
  const { token, user } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const router = useRouter();
  // Fonction pour charger les conversations
  const fetchConversations = async () => {
    try {
      console.time("FetchConversations");
      const result = await fetchData<ConversationType[]>(
        "/chats/fetchConversations",
        HttpMethod.GET,
        null,
        token,
      );
      if (result.ok && result.data) {
        setConversations(result.data);
        console.timeEnd("FetchConversations");
      } else {
        console.error("Failed to fetch conversations.");
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  // Fonction pour démarrer une nouvelle conversation privée
  const startPrivateChat = async (userId: string) => {
    try {
      // Appel API pour démarrer une nouvelle conversation privée
      const result = await fetchData<{ conversation: ConversationType }>(
        "/chats/startPrivateConversation",
        HttpMethod.POST,
        { userId },
        token,
      );
      if (result.ok && result.data) {
        const newConversation = result.data.conversation;

        // Met à jour la liste des conversations
        setConversations((prevConversations) => [
          ...prevConversations,
          newConversation, // Ajoute la nouvelle conversation complète
        ]);

        // Sélectionne la nouvelle conversation
        setActiveConversation(newConversation);

        // Redirige vers la page de la conversation
        router.push(`/chats?conversationId=${newConversation._id}`);
      }
    } catch (err) {
      console.error("Error starting private chat:", err);
    }
  };

  // Fonction pour sélectionner une conversation
  const selectConversation = (conversationId: string) => {
    const selectedConversation = conversations.find(
      (conv) => conv._id === conversationId,
    );
    if (selectedConversation) {
      setMessages((prevMessages) => [
        ...prevMessages,
        ...selectedConversation.messages,
      ]);
    }
  };

  // Fonction pour supprimer une conversation
  const deleteConversation = async (conversationId: string) => {
    try {
      const result = await fetchData(
        `/chats/deleteConversation/${conversationId}`,
        HttpMethod.DELETE,
        { conversationId },
        token,
      );
      if (result.ok) {
        setConversations((prev) =>
          prev.filter((c) => c._id !== conversationId),
        );
        console.log("Conversation deleted successfully");
      }
    } catch (err) {
      console.error("Failed to delete conversation", err);
    }
  };

  // Charger les conversations une fois l'utilisateur connecté
  useEffect(() => {
    if (user && token) {
      fetchConversations();
    }
  }, [token, user]);

  useEffect(() => {
    console.log("SocketProvider mounted");
    if (!token || !user) {
      console.log("No token or user, skipping socket connection");
      return;
    }

    if (!socketRef.current) {
      const newSocket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
        transports: ["websocket"],
        auth: { token },
      });

      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
        setSocket(newSocket);

        const conversationIds = conversations.map((conv) => conv._id);
        newSocket.emit("join_conversations", { conversationIds });
        console.log(`Joined all conversations: ${conversationIds}`);
      });

      newSocket.on("send_message_emit", (newMessage: MessageType) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setConversations((prevConversations) =>
          prevConversations.map((conversation) => {
            if (conversation._id === newMessage.conversationId) {
              return {
                ...conversation,
                lastMessage: newMessage.message,
                unread: true,
              };
            }
            return conversation;
          }),
        );
      });

      socketRef.current = newSocket;
    }

    return () => {
      if (socketRef.current?.connected) {
        socketRef.current.disconnect();
        console.log("Socket disconnected via cleanup");
      }
      setSocket(null);
      socketRef.current = null;
    };
  }, [token, conversations]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        messages,
        conversations,
        activeConversation,
        setActiveConversation,
        startPrivateChat,
        selectConversation,
        deleteConversation,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
