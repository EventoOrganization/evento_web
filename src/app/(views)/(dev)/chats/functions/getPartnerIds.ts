import { UserType } from "@/types/UserType";
import { ConversationType } from "../types";

export function getPartnerIds(conversations: ConversationType[]): Set<string> {
  const ids = new Set<string>();
  conversations.forEach((conv) =>
    conv.participants.forEach((participant: UserType) =>
      ids.add(participant._id),
    ),
  );
  return ids;
}
