// hooks/useDeleteConversation.ts
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { fetchData, HttpMethod } from "@/utils/fetchData";

export function useDeleteConversation() {
  const { token } = useSession();
  const { toast } = useToast();

  return async (conversationId: string) => {
    if (!token) throw new Error("No auth token");
    try {
      const res = await fetchData(
        `/chats/conversations/${conversationId}`,
        HttpMethod.DELETE,
        null,
        token,
      );
      if (!res.ok) throw new Error(res.error || "Échec de la suppression");

      toast({
        title: "Conversation supprimée",
        description: "La conversation a été supprimée avec succès.",
        variant: "eventoSuccess",
      });
    } catch (err: any) {
      toast({
        title: "Erreur de suppression",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };
}
