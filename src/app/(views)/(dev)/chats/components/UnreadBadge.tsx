// src/components/chat/UnreadBadge.tsx
import { cn } from "@/lib/utils"; // ton utilitaire de classNames
import { useUnreadCounts } from "../hooks/useUnreadCounts";

interface UnreadBadgeProps {
  conversationId?: string;
  className?: string;
}

export function UnreadBadge({ conversationId, className }: UnreadBadgeProps) {
  const { getUnreadForConversation, getTotalUnread } = useUnreadCounts();

  const unreadCount = conversationId
    ? getUnreadForConversation(conversationId)
    : getTotalUnread();

  if (unreadCount <= 0) return null;

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-red-500 text-white text-xs min-w-[20px] h-[20px] px-1",
        className,
      )}
    >
      {unreadCount}
    </div>
  );
}
