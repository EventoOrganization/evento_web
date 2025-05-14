// ChatButton.tsx
"use client";

import { useSocket } from "@/app/(views)/(dev)/chats/contexts/SocketProvider";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { EventType } from "@/types/EventType";
import { MessageCircle, MessageCircleMore } from "lucide-react";
import { useRouter } from "next/navigation";
import { useJoinConversation } from "../hooks/useJoinConversation";

export const StartEventChatButton = ({ event }: { event: EventType }) => {
  const { setActiveConversation } = useSocket();
  const joinConversation = useJoinConversation();
  const { user } = useSession();
  const conv = event.conversation;
  const router = useRouter();
  const alreadyChatting =
    conv && conv.participants.find((p) => p._id === user?._id);

  const handleClick = async () => {
    if (!conv) return;
    try {
      if (!alreadyChatting) {
        await joinConversation(conv._id);
      }
      setActiveConversation(conv);
    } catch (error) {
      console.log(error);
    } finally {
      router.push(`/chats`);
    }
  };
  return (
    <Button variant="ghost">
      {alreadyChatting ? (
        <>
          <Tooltip>
            <TooltipTrigger className="flex items-center gap-2">
              <MessageCircleMore onClick={handleClick} />
            </TooltipTrigger>
            <TooltipContent>Continu to chat</TooltipContent>
          </Tooltip>
        </>
      ) : (
        <>
          <Tooltip>
            <TooltipTrigger className="flex items-center gap-2">
              Start Chatting in this event
              <MessageCircle onClick={handleClick} />
            </TooltipTrigger>
            <TooltipContent>Click to start participate</TooltipContent>
          </Tooltip>
        </>
      )}
    </Button>
  );
};
