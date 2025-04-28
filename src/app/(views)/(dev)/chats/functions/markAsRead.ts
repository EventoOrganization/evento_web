// src/app/(views)/(dev)/chats/functions/markAsRead.ts

import { MessageType } from "../types";
import { isAtBottom } from "../utils/isAtBottom";

interface MarkAsReadParams {
  socket: any;
  activeConversationId: string;
  messages: MessageType[];
  scrollRef: React.RefObject<HTMLDivElement>;
}

export async function markAsRead({
  socket,
  activeConversationId,
  messages,
  scrollRef,
}: MarkAsReadParams) {
  if (!messages.length || !scrollRef.current || !socket) return;

  const isBottom = isAtBottom(scrollRef.current);
  if (!isBottom) return;

  const lastMessage = messages[messages.length - 1];

  console.log("[markAsRead] ✉️ Sending mark-as-read:", {
    conversationId: activeConversationId,
    lastSeenMessageId: lastMessage._id,
  });

  try {
    socket.emit("mark-as-read", {
      conversationId: activeConversationId,
      lastSeenMessageId: lastMessage._id,
    });

    console.log("[markAsRead] ✅ Emitted successfully!");
  } catch (err) {
    console.error("[markAsRead] ❌ Error emitting mark-as-read:", err);
  }
}
