import { useSession } from "@/contexts/SessionProvider";
import AuthModal from "@/features/auth/components/AuthModal";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/store/useGlobalStore";
import { EventType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { startOfDay } from "date-fns";
import {
  Bookmark,
  BookmarkCheck,
  Circle,
  CircleCheck,
  CircleCheckBig,
  Send,
  Loader2 as Spinner,
  X,
} from "lucide-react";
import React, { useState } from "react";
import QuestionModal from "./QuestionModal";
import RefusalModal from "./RefusalModal";

type EventActionIconsProps = {
  event: EventType;
  className?: string;
  updateEventStatusLocally?: (
    statusKey: EventStatusKeys,
    value: boolean,
  ) => void;
  isLocal?: boolean;
};
type EventStatusKeys = "isGoing" | "isFavourite" | "isRefused";

const EventActionIcons: React.FC<EventActionIconsProps> = ({
  event,
  className = "",
  updateEventStatusLocally,
  isLocal = false,
}) => {
  const { toast } = useToast();
  const { token, user } = useSession();
  const updateEventStatusInStore = useGlobalStore(
    (state) => state.updateEventStatus,
  );
  const [showQuestionModal, setShowQuestionModal] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isRefusalModalOpen, setIsRefusalModalOpen] = useState(false);
  const [refusalReason, setRefusalReason] = useState<string>("");
  const [loading, setLoading] = useState<string | null>(null);
  const hasEventEnded = event.details?.endDate
    ? new Date(event.details.endDate) < startOfDay(new Date())
    : false;

  if (hasEventEnded) {
    return null;
  }
  const updateEventStatus = async (
    status: EventStatusKeys,
    rsvpAnswers?: any,
    reason?: string,
  ) => {
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }
    console.log("token", token);
    const isCurrentlySet = event[status];

    try {
      setLoading(status);
      const body = {
        eventId: event._id,
        userId: user?._id,
        status: isCurrentlySet ? null : status,
        rsvpAnswers,
        reason,
      };
      const response = await fetchData(
        `/events/updateEventStatus`,
        HttpMethod.POST,
        body,
        token,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const action = isCurrentlySet ? "removed from" : "marked as";
      toast({
        title: `Event ${
          status === "isGoing"
            ? `${action} going`
            : status === "isFavourite"
              ? `${action} favourite`
              : `${action} refused`
        }`,
        className: "bg-evento-gradient text-white",
        duration: 1000,
      });
      if (isLocal && updateEventStatusLocally) {
        updateEventStatusLocally(status, !isCurrentlySet);
        updateEventStatusInStore(
          event._id,
          { [status]: !isCurrentlySet },
          user as UserType,
        );
      } else {
        updateEventStatusInStore(
          event._id,
          { [status]: !isCurrentlySet },
          user as UserType,
        );
      }
    } catch (error) {
      console.error(`Error updating event status (${status}):`, error);
    } finally {
      setLoading(null);
    }
  };

  const handleGoing = (submittedAnswers: any) => {
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }
    if (
      !event.isGoing &&
      event?.questions?.length !== undefined &&
      event?.questions?.length > 0 &&
      submittedAnswers.length < event.questions.length
    ) {
      setShowQuestionModal(true);
      return;
    }

    updateEventStatus("isGoing", submittedAnswers);
  };

  const handleFavourite = () => {
    updateEventStatus("isFavourite");
  };

  const handleRefused = async () => {
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      await updateEventStatus("isRefused", [], refusalReason);
      setRefusalReason("");
    } catch (error) {
      console.error("Error marking event as refused:", error);
      alert("Failed to mark as refused. Please try again.");
    }
  };

  const handleSend = async () => {
    const env = process.env.VERCEL_ENV;
    const baseUrl =
      env === "production"
        ? "https://www.evento-app.io"
        : env === "preview"
          ? `https://${process.env.VERCEL_URL}`
          : "http://localhost:3000";

    const eventUrl = `${baseUrl}/event/${event?._id}`;

    const shareApiSupported = true; // to check if the share api is supported

    if (shareApiSupported && navigator.share) {
      try {
        await navigator.share({
          title: "Check out this event",
          text: "Check out this event I found!",
          url: eventUrl,
        });
        console.log("Successful share");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else if (navigator.clipboard) {
      // Utiliser le presse-papier si le partage n'est pas supporté
      try {
        await navigator.clipboard.writeText(eventUrl);
        toast({
          title: "Link copied to clipboard!",
          description: "The event link has been copied. You can share it now.",
          className: "bg-evento-gradient text-white",
          duration: 3000,
        });
      } catch (error) {
        console.error("Failed to copy link:", error);
        toast({
          title: "Failed to copy",
          description: "Unable to copy the link to the clipboard.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } else {
      console.log("Clipboard API is not supported in this browser.");
      toast({
        title: "Sharing not supported",
        description: "Your browser does not support sharing or copying links.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleSubmitQuestions = (answers: any) => {
    setShowQuestionModal(false);
    handleGoing(answers);
  };
  return (
    <div className={`flex gap-2 ${className}`}>
      {/* Action to mark as Going */}
      <button
        onClick={(e) => {
          handleGoing([]);
          e.stopPropagation();
        }}
        className="relative flex items-center justify-center w-10 h-10 hover:opacity-80"
      >
        {loading === "isGoing" ? (
          <Spinner className="animate-spin text-eventoPurpleLight w-full h-full" />
        ) : !event.isGoing ? (
          <CircleCheck
            strokeWidth={1.5}
            className={cn("text-eventoPurpleLight w-full h-full")}
          />
        ) : (
          <CircleCheckBig
            strokeWidth={1.5}
            className={cn(
              "text-white bg-evento-gradient rounded-full w-full h-full",
            )}
          />
        )}
      </button>

      {/* Action to mark as Favourite */}
      <button
        onClick={(e) => {
          handleFavourite();
          e.stopPropagation();
        }}
        className="relative flex items-center justify-center w-10 h-10 hover:opacity-80"
      >
        {loading === "isFavourite" ? (
          <Spinner className="animate-spin text-eventoPurpleLight w-full h-full" />
        ) : event.isFavourite ? (
          <BookmarkCheck className="z-10 text-white" />
        ) : (
          <Bookmark className="text-eventoPurpleLight" />
        )}
        <Circle
          strokeWidth={1.5}
          className={cn(
            "absolute inset-0 text-eventoPurpleLight rounded-full w-full h-full",
            {
              "bg-evento-gradient text-white": event.isFavourite,
            },
          )}
        />
      </button>

      {/* Action to mark as Refused (only for private events) */}
      {event.eventType === "private" && (
        <button
          onClick={(e) => {
            event.isRefused ? handleRefused() : setIsRefusalModalOpen(true);
            e.stopPropagation();
          }}
          className="relative flex items-center justify-center w-10 h-10 hover:opacity-80"
        >
          {loading === "isRefused" ? (
            <Spinner className="animate-spin text-eventoPurpleLight w-full h-full" />
          ) : event.isRefused ? (
            <X className="z-10 text-white" />
          ) : (
            <X className="text-eventoPurpleLight" />
          )}
          <Circle
            strokeWidth={1.5}
            className={cn(
              "absolute inset-0 text-eventoPurpleLight rounded-full w-full h-full",
              {
                "bg-evento-gradient text-white": event.isRefused,
              },
            )}
          />
        </button>
      )}
      {/* Action to share the event */}
      <button
        onClick={(e) => {
          handleSend();
          e.stopPropagation();
        }}
        className="relative flex items-center justify-center w-10 h-10 hover:opacity-80"
      >
        <Send
          strokeWidth={2}
          strokeLinejoin="round"
          className="translate-y-[1px] -translate-x-[1px] text-eventoPurpleLight"
        />
        <Circle
          strokeWidth={1.5}
          className="absolute inset-0 text-eventoPurpleLight w-full h-full"
        />
      </button>

      {/* Modals for authentication, questions, and refusal */}
      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={() => setIsAuthModalOpen(false)}
        />
      )}

      {showQuestionModal && (
        <QuestionModal
          questions={event?.questions || []}
          onSubmit={handleSubmitQuestions}
          onClose={() => setShowQuestionModal(false)}
        />
      )}

      {isRefusalModalOpen && (
        <RefusalModal
          isOpen={isRefusalModalOpen}
          onClose={() => setIsRefusalModalOpen(false)}
          setRefusalReason={setRefusalReason}
          onSubmit={handleRefused}
          refusalReason={refusalReason}
        />
      )}
    </div>
  );
};

export default EventActionIcons;
