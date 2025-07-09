"use client";

import { useSession } from "@/contexts/(prod)/SessionProvider";
import { cn } from "@/lib/utils";
import { UserType } from "@/types/UserType";
import { ConversationType } from "../types";
import { UnreadBadge } from "./UnreadBadge";

interface ConversationListItemProps {
  conversation: ConversationType;
  isSelected: boolean;
  onSelect: (conversation: ConversationType) => void;
}

export function ConversationListItem({
  conversation,
  isSelected,
  onSelect,
}: ConversationListItemProps) {
  const { user } = useSession();
  const userId = user?._id;

  const otherParticipants = conversation.participants.filter(
    (p: UserType) => p._id !== userId,
  );

  return (
    <li
      key={conversation._id}
      className={cn(
        "relative rounded-md p-3 cursor-pointer bg-card hover:bg-evento-gradient-button transition-colors",
        { "bg-background": isSelected },
      )}
      onClick={() => onSelect(conversation)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          {conversation.title ? (
            <p className="font-medium truncate">{conversation.title}</p>
          ) : (
            <div className="flex items-center gap-2 truncate">
              {otherParticipants.slice(0, 4).map((p: UserType) => (
                <img
                  key={p._id}
                  src={p.profileImage || "/evento-logo.png"}
                  alt={p.username}
                  className="w-6 h-6 rounded-full shrink-0"
                />
              ))}
              {otherParticipants.length > 4 && (
                <p className="text-xs text-muted-foreground">
                  +{otherParticipants.length - 4}
                </p>
              )}
              <p className="ml-2 font-medium truncate">
                {otherParticipants.map((p) => p.username).join(", ")}
              </p>
            </div>
          )}
        </div>

        {/* Badge des unread messages */}
        <UnreadBadge conversationId={conversation._id} />
      </div>

      <p className="text-xs line-clamp-1 mt-1 text-muted-foreground">
        {conversation.lastMessage?.message || "No message yet"}
      </p>
    </li>
  );
}
