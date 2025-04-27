// hooks/useSendMessage.ts
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { MessageType } from "../types";

export function useSendMessage() {
  const { token } = useSession();

  return async (conversationId: string, message: string) => {
    const res = await fetchData<MessageType>(
      "/chats/messages",
      HttpMethod.POST,
      { conversationId, message },
      token,
    );

    if (!res.ok || !res.data) throw new Error(res.error || "Envoi échoué");
    return res.data;
  };
}
