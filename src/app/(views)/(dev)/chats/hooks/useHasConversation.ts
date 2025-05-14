import { useMemo } from "react";
import { useSocket } from "../contexts/SocketProvider";
import { getPartnerIds } from "../functions/getPartnerIds";

export function useHasConversation(userId: string): boolean {
  const { conversations } = useSocket();
  const partnerIds = useMemo(
    () => getPartnerIds(conversations),
    [conversations],
  );
  return partnerIds.has(userId);
}
