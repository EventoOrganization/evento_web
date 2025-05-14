import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StepBackIcon, Trash } from "lucide-react";
import { useSocket } from "../contexts/SocketProvider";
import { useDeleteConversation } from "../hooks/useDeleteConversation";
import { useLeaveConversation } from "../hooks/useLeaveConversation";
import { ConversationType } from "../types";

interface ConversationManagerProps {
  conversation: ConversationType;
  onConversationEnded: () => void;
}

const ConversationManager = ({
  conversation,
  onConversationEnded,
}: ConversationManagerProps) => {
  const deleteConversation = useDeleteConversation();
  const leaveConversation = useLeaveConversation();
  const { updateConversations } = useSocket();
  const handleDeleteConversation = async () => {
    try {
      await deleteConversation(conversation._id);
      updateConversations((prev) =>
        prev.filter((c) => c._id !== conversation._id),
      );
      onConversationEnded();
    } catch (err) {}
  };

  const handleLeaveConversation = async () => {
    try {
      await leaveConversation(conversation._id);
      updateConversations((prev) =>
        prev.filter((c) => c._id !== conversation._id),
      );
      onConversationEnded();
    } catch (err) {}
  };

  return (
    <>
      {!conversation.eventId ? (
        <Tooltip>
          <TooltipTrigger className="flex items-center gap-2">
            <Button variant="ghost" onClick={handleDeleteConversation}>
              <Trash className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-background">
            Delete conversation
          </TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger className="flex items-center gap-2">
            <Button variant="outline" onClick={handleLeaveConversation}>
              <StepBackIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Leave conversation</TooltipContent>
        </Tooltip>
      )}
    </>
  );
};

export default ConversationManager;
