import { useSession } from "@/contexts/(prod)/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useSocket } from "../contexts/SocketProvider";
import { ConversationType } from "../types";

// src/hooks/useCreateConversation.ts
export function useCreateConversation(): (
  participants: string[],
  event?: string | null,
) => Promise<ConversationType> {
  const { token } = useSession();
  const { socket, updateConversations } = useSocket();
  const { toast } = useToast();

  return async (participants, event) => {
    if (!token) throw new Error("No auth token");

    // 1) Création via HTTP
    const res = await fetchData<ConversationType>(
      "/chats/conversations",
      HttpMethod.POST,
      { participants, event },
      token,
    );

    if (!res.ok || !res.data) {
      toast({
        title: "Erreur de création",
        description: res.error || "Failed to create conversation",
        variant: "destructive",
      });
      throw new Error(res.error || "Failed to create conversation");
    }

    const newConv = res.data;

    // 2) On l’ajoute au contexte
    updateConversations((prev) => [newConv, ...prev]);

    // 3) On rejoint la room en temps réel
    socket?.emit("join_conversations", {
      conversationIds: [newConv._id],
    });

    return newConv;
  };
}
