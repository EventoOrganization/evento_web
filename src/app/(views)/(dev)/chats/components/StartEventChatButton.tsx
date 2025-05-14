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
import { EventType } from "@/types/EventType";
import { MessageCircle, MessageCircleMore } from "lucide-react";
import { useRouter } from "next/navigation";

export const StartEventChatButton = ({ event }: { event: EventType }) => {
  const { conversations, setActiveConversation } = useSocket();
  console.log("event", event.conversation);
  const router = useRouter();
  const createConversation = useCreateConversation();
  const alreadyChatting = useHasConversation(event._id);

  const handleClick = async () => {
    try {
      if (!alreadyChatting) {
        // setActiveConversation();
      } else {
        let conv = conversations.find((c) =>
          c.participants.some((p) => p._id === event._id),
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
