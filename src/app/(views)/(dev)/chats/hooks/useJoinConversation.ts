// src/app/(views)/(dev)/chats/hooks/useJoinConversation.ts
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { useSocket } from "../contexts/SocketProvider";
import { ConversationType } from "../types";

export function useJoinConversation(): (
  conversationId: string,
) => Promise<ConversationType> {
  const { token } = useSession();
  const { socket, updateConversations } = useSocket();
  const { toast } = useToast();

  return async (conversationId: string) => {
    if (!token) throw new Error("No auth token");

    // 1) Requête PATCH pour rejoindre la conversation
    const res = await fetchData<ConversationType>(
      `/chats/conversations/${conversationId}/join`,
      HttpMethod.PATCH,
      {},
      token,
    );

    if (!res.ok || !res.data) {
      toast({
        title: "Erreur",
        description: res.error || "Impossible de rejoindre la conversation",
        variant: "destructive",
      });
      throw new Error(res.error || "Failed to join conversation");
    }

    const joinedConv = res.data;

    // 2) Notification de succès
    toast({
      title: "Welcome",
      description: "You have joined the conversation",
      variant: "evento",
    });

    // 3) Mise à jour locale du store :
    //    - on remplace la conv existante si elle y est,
    //    - ou on l'ajoute en tête
    updateConversations((prev) => {
      const without = prev.filter((c) => c._id !== joinedConv._id);
      return [joinedConv, ...without];
    });

    // 4) Émission socket pour rejoindre le canal
    socket?.emit("join_conversations", {
      conversationIds: [joinedConv._id],
    });

    return joinedConv;
  };
}
