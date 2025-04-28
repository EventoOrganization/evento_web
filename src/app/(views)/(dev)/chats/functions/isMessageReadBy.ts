import { ConversationType } from "../types";

export function isMessageReadBy(
  conversation: ConversationType,
  userId: string,
  messageId: string,
): boolean {
  if (!conversation.readReceipts) return false;
  const lastSeenMessageId = conversation.readReceipts[userId];
  if (!lastSeenMessageId) return false;

  return lastSeenMessageId === messageId || false;
}
