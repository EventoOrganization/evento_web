import { useSession } from "@/contexts/SessionProvider";
import AuthModal from "@/features/auth/components/AuthModal";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useEventStatusStore } from "@/store/useEventStatusStore";
import { EventType } from "@/types/EventType";
import {
  Bookmark,
  BookmarkCheck,
  Circle,
  CircleCheck,
  CircleCheckBig,
  Send,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import QuestionModal from "./QuestionModal";

type EventActionIconsProps = {
  event: EventType;
  className?: string;
};

const EventActionIcons: React.FC<EventActionIconsProps> = ({
  event,
  className = "",
}) => {
  const { toast } = useToast();
  const { token, user } = useSession();
  const { eventStatuses, toggleGoing, toggleFavourite, setEventStatus } =
    useEventStatusStore();
  const [showQuestionModal, setShowQuestionModal] = useState<boolean>(false);
  const [mandatoryQuestions, setMandatoryQuestions] = useState<any[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const currentStatus = eventStatuses[event._id] || {
    going: event.isGoing || false,
    favourite: event.isFavourite || false,
  };

  useEffect(() => {
    setEventStatus(event._id, {
      going: currentStatus.going,
      favourite: currentStatus.favourite,
      refused: event.isRefused || false,
    });
    const requiredQuestions = event.questions?.filter((q) => q.required) || [];
    if (requiredQuestions.length > 0) {
      setMandatoryQuestions(requiredQuestions);
    }
  }, [event, currentStatus.going, currentStatus.favourite, setEventStatus]);

  const handleGoing = async (submittedAnswers: any) => {
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }

    if (currentStatus.going) {
      console.log("unGoing");
    } else {
      if (submittedAnswers.length < mandatoryQuestions.length) {
        setShowQuestionModal(true);
        return;
      }
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/attendEventStatus`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            eventId: event._id,
            userId: user?._id,
            attendStatus: eventStatuses[event._id]?.going,
            rsvpAnswers: submittedAnswers, // Use the answers passed from the modal
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!eventStatuses[event._id].going) {
        toast({
          title: "You marked this event as going",
          className: "bg-evento-gradient text-white",
          duration: 1000,
        });
      }

      toggleGoing(event._id);
    } catch (error) {
      console.error("Error marking event as going:", error);
      alert("Failed to mark as going. Please try again.");
    }
  };

  const handleFavourite = async () => {
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/favouriteEventStatus`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ eventId: event._id }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: eventStatuses[event._id]?.favourite
          ? "You unfavoured this event"
          : "You favoured this event",
        className: "bg-evento-gradient text-white",
        duration: 1000,
      });

      toggleFavourite(event._id);
    } catch (error) {
      console.error("Error marking event as favourite:", error);
      alert("Failed to mark as favourite. Please try again.");
    }
  };

  const handleSend = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this event",
          text: "Check out this event I found!",
          url: `${process.env.NEXT_PUBLIC_API_URL}/event/${event?._id}`,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      console.log("Web Share API is not supported in this browser.");
    }
  };

  const handleSubmitQuestions = (answers: any) => {
    setShowQuestionModal(false);
    handleGoing(answers); // Pass the answers directly to handleGoing
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        onClick={(e) => {
          handleGoing([]);
          currentStatus.favourite && handleFavourite();
          e.stopPropagation();
        }}
        className="relative flex items-center justify-center w-10 h-10 hover:opacity-80"
      >
        {!currentStatus.going ? (
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
      <button
        onClick={(e) => {
          handleFavourite();
          currentStatus.going && handleGoing([]);
          e.stopPropagation();
        }}
        className="relative flex items-center justify-center w-10 h-10 hover:opacity-80"
      >
        {currentStatus.favourite ? (
          <BookmarkCheck className="z-10 text-white" />
        ) : (
          <Bookmark className="text-eventoPurpleLight" />
        )}
        <Circle
          strokeWidth={1.5}
          className={cn(
            "absolute inset-0 text-eventoPurpleLight rounded-full w-full h-full",
            {
              "bg-evento-gradient text-white": currentStatus.favourite,
            },
          )}
        />
      </button>
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
      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={() => {
            setIsAuthModalOpen(false);
          }}
        />
      )}
      {showQuestionModal && (
        <QuestionModal
          questions={mandatoryQuestions}
          onSubmit={handleSubmitQuestions}
          onClose={() => setShowQuestionModal(false)}
        />
      )}
    </div>
  );
};

export default EventActionIcons;
