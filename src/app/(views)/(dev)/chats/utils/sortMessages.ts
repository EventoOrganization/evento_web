// utils/sortMessages.ts

import { MessageType } from "@/app/(views)/(dev)/chats/types";

export function sortMessagesByCreatedAt(messages: MessageType[]) {
  return [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}
