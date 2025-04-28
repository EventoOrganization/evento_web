"use client";

import { useSession } from "@/contexts/(prod)/SessionProvider";
import { cn } from "@/lib/utils";
import { UserType } from "@/types/UserType";
import EzTag from "@ezstart/ez-tag";
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
      <EzTag as="div" className="flex items-center justify-between">
        <div className="flex items-center gap-2 truncate">
          {conversation.title ? (
            <EzTag as="p" className="font-medium truncate">
              {conversation.title}
            </EzTag>
          ) : (
            <EzTag as="div" className="flex items-center gap-2 truncate">
              {otherParticipants.slice(0, 4).map((p: UserType) => (
                <img
                  key={p._id}
                  src={p.profileImage || "/evento-logo.png"}
                  alt={p.username}
                  className="w-6 h-6 rounded-full shrink-0"
                />
              ))}
              {otherParticipants.length > 4 && (
                <EzTag as="p" className="text-xs text-muted-foreground">
                  +{otherParticipants.length - 4}
                </EzTag>
              )}
              <EzTag as="p" className="ml-2 font-medium truncate">
                {otherParticipants.map((p) => p.username).join(", ")}
              </EzTag>
            </EzTag>
          )}
        </div>

        {/* Badge des unread messages */}
        <UnreadBadge conversationId={conversation._id} />
      </EzTag>

      <EzTag as="p" className="text-xs line-clamp-1 mt-1 text-muted-foreground">
        {conversation.lastMessage?.message || "No message yet"}
      </EzTag>
    </li>
  );
}
