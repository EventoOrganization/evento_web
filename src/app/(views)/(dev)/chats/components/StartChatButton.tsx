// ChatButton.tsx
"use client";

import { useSocket } from "@/app/(views)/(dev)/chats/contexts/SocketProvider";
import { useCreateConversation } from "@/app/(views)/(dev)/chats/hooks/useCreateConversation";
import { useHasConversation } from "@/app/(views)/(dev)/chats/hooks/useHasConversation";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserType } from "@/types/UserType";
import { MessageCircle, MessageCircleMore } from "lucide-react";
import { useRouter } from "next/navigation";
import { UnreadBadge } from "./UnreadBadge";

export const StartChatButton = ({ user }: { user: UserType }) => {
  const { conversations, setActiveConversation } = useSocket();
  const router = useRouter();
  const createConversation = useCreateConversation();
  const alreadyChatting = useHasConversation(user._id);

  // 1) On récupère la conv existante (ou undefined)
  const conv = conversations.find((c) =>
    c.participants.some((p) => p._id === user._id),
  );

  const handleClick = async () => {
    try {
      if (!alreadyChatting) {
        const newConv = await createConversation([user._id]);
        setActiveConversation(newConv);
      } else if (conv) {
        setActiveConversation(conv);
      }
    } catch (error) {
      console.error(error);
    } finally {
      router.push("/chats");
    }
  };

  return (
    <Button variant="ghost" className="relative" onClick={handleClick}>
      {alreadyChatting ? (
        <Tooltip>
          <TooltipTrigger>
            <MessageCircleMore />
          </TooltipTrigger>
          <TooltipContent>
            You already have a conversation, click to open it
          </TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger>
            <MessageCircle />
          </TooltipTrigger>
          <TooltipContent>Click to start a conversation</TooltipContent>
        </Tooltip>
      )}

      {/* 2) On passe conv?._id à ton badge */}
      <UnreadBadge
        conversationId={conv?._id}
        className="absolute top-0 right-2"
      />
    </Button>
  );
};
