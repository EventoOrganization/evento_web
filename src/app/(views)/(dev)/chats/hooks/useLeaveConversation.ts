// hooks/useLeaveConversation.ts
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { fetchData, HttpMethod } from "@/utils/fetchData";

export function useLeaveConversation() {
  const { token } = useSession();
  const { toast } = useToast();

  return async (conversationId: string) => {
    if (!token) throw new Error("No auth token");
    try {
      const res = await fetchData(
        `/chats/conversations/${conversationId}/leave`,
        HttpMethod.PATCH,
        null,
        token,
      );
      if (!res.ok) throw new Error(res.error || "Échec du départ");

      toast({
        title: "Conversation quittée",
        description: "Vous avez quitté la conversation.",
        variant: "eventoSuccess",
      });
    } catch (err: any) {
      toast({
        title: "Erreur de départ",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };
}
