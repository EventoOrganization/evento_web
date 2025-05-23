// src/app/(views)/(dev)/chats/functions/markAsRead.ts

import { MessageType } from "../types";
import { isAtBottom } from "../utils/isAtBottom";

interface MarkAsReadParams {
  socket: any;
  activeConversationId: string;
  messages: MessageType[];
  bottomRef: React.RefObject<HTMLDivElement>;
}

export async function markAsRead({
  socket,
  activeConversationId,
  messages,
  bottomRef,
}: MarkAsReadParams) {
  if (!messages.length || !bottomRef.current || !socket) {
    console.log("[markAsRead] ❌ Missing messages, bottomRef or socket, abort");
    return;
  }

  const isBottom = isAtBottom(bottomRef.current);

  if (!isBottom) {
    console.log("[markAsRead] ⬆️ User not at bottom, not marking as read.");
    return;
  }

  const lastMessage = messages[messages.length - 1];
  if (lastMessage.clientId) return;
  try {
    socket.emit("mark-as-read", {
      conversationId: activeConversationId,
      lastSeenMessageId: lastMessage._id,
    });
  } catch (err) {
    console.error("[markAsRead] ❌ Error emitting mark-as-read:", err);
  }
}
