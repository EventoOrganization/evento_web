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
import { UnreadBadge } from "./UnreadBadge";

export const StartEventChatButton = ({ event }: { event: EventType }) => {
  const { setActiveConversation } = useSocket();
  const joinConversation = useJoinConversation();
  const { user } = useSession();
  const conv = event.conversation;
  const router = useRouter();
  console.log("user", user?._id);
  console.log("conv", conv?.participants);
  const alreadyChatting = conv?.participants.some(
    (participant) => participant._id === user?._id,
  );

  console.log("alreadyChatting", alreadyChatting);
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
    <Button
      size={"sm"}
      variant="ghost"
      className="relative"
      onClick={handleClick}
    >
      {alreadyChatting ? (
        <>
          <Tooltip>
            <TooltipTrigger className="flex items-center gap-2">
              <MessageCircleMore size={20} />
            </TooltipTrigger>
            <TooltipContent>Continu to chat</TooltipContent>
          </Tooltip>
        </>
      ) : (
        <>
          <Tooltip>
            <TooltipTrigger className="flex items-center gap-2">
              Start Chatting
              <MessageCircle size={20} />
            </TooltipTrigger>
            <TooltipContent>Click to start participate</TooltipContent>
          </Tooltip>
        </>
      )}
      <UnreadBadge
        conversationId={conv?._id}
        className="absolute top-0 right-1"
      />
    </Button>
  );
};
