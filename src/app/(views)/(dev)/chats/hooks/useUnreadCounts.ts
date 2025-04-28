// src/hooks/useUnreadCounts.ts
import { useSocket } from "@/app/(views)/(dev)/chats/contexts/SocketProvider";
import { useSession } from "@/contexts/(prod)/SessionProvider";

export function useUnreadCounts() {
  const { conversations } = useSocket();
  const { user } = useSession();

  if (!user)
    return { getUnreadForConversation: () => 0, getTotalUnread: () => 0 };

  const getUnreadForConversation = (conversationId: string): number => {
    const conv = conversations.find((c) => c._id === conversationId);
    if (!conv || !conv.unreadCounts) return 0;
    return conv.unreadCounts[user._id] || 0;
  };

  const getTotalUnread = (): number => {
    return conversations.reduce((acc, conv) => {
      if (!conv.unreadCounts) return acc;
      return acc + (conv.unreadCounts[user._id] || 0);
    }, 0);
  };

  return { getUnreadForConversation, getTotalUnread };
}
