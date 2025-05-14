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

export const StartChatButton = ({ user }: { user: UserType }) => {
  const { conversations, setActiveConversation } = useSocket();
  const router = useRouter();
  const createConversation = useCreateConversation();
  const alreadyChatting = useHasConversation(user._id);

  const handleClick = async () => {
    try {
      if (!alreadyChatting) {
        const newConv = await createConversation([user._id]);
        setActiveConversation(newConv);
      } else {
        let conv = conversations.find((c) =>
          c.participants.some((p) => p._id === user._id),
        );
        console.log("conv", conv);
        if (!conv) return;
        setActiveConversation(conv);
      }
    } catch (error) {
    } finally {
      router.push("/chats");
    }
  };

  return (
    <Button variant="ghost">
      {alreadyChatting ? (
        <>
          <Tooltip>
            <TooltipTrigger>
              <MessageCircleMore onClick={handleClick} />
            </TooltipTrigger>
            <TooltipContent>
              You already have a conversation, click to open it
            </TooltipContent>
          </Tooltip>
        </>
      ) : (
        <>
          <Tooltip>
            <TooltipTrigger>
              <MessageCircle onClick={handleClick} />
            </TooltipTrigger>
            <TooltipContent>Click to start a conversation</TooltipContent>
          </Tooltip>
        </>
      )}
    </Button>
  );
};
