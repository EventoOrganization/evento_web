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
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import RefusalModal from "./RefusalModal";

type EventActionIconsProps = {
  event: EventType;
  className?: string;
};

const PrivateEventActionIcons: React.FC<EventActionIconsProps> = ({
  event,
  className = "",
}) => {
  const { toast } = useToast();
  const { token, user } = useSession();
  const {
    eventStatuses,
    toggleGoing,
    toggleFavourite,
    setEventStatus,
    toggleRefused,
  } = useEventStatusStore();
  const currentStatus = eventStatuses[event._id] || {
    going: event.isGoing || false,
    favourite: event.isFavourite || false,
    refused: event.isRefused || false,
  };
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isRefusalModalOpen, setIsRefusalModalOpen] = useState(false);
  const [refusalReason, setRefusalReason] = useState<string>("");
  useEffect(() => {
    setEventStatus(event._id, {
      going: currentStatus.going,
      favourite: currentStatus.favourite,
      refused: currentStatus.refused,
    });
  }, [
    event,
    currentStatus.going,
    currentStatus.favourite,
    currentStatus.refused,
    setEventStatus,
  ]);
  // Handle Going status

  const handleGoing = async () => {
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    } else if (!event) {
      return;
    } else {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/events/attendEventStatus`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ eventId: event?._id, userId: user?._id }),
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
    }
  };

  // Handle Maybe status
  const handleMaybe = async () => {
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
          body: JSON.stringify({ eventId: event?._id, userId: user?._id }),
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!eventStatuses[event._id]?.favourite) {
        toast({
          title: eventStatuses[event._id]?.favourite
            ? "You unfavoured this event"
            : "You favoured this event",
          className: "bg-evento-gradient text-white",
          duration: 1000,
        });
      }
      toggleFavourite(event._id);
    } catch (error) {
      console.error("Error marking event as maybe:", error);
      alert("Failed to mark as maybe. Please try again.");
    }
  };

  const handleRefused = async () => {
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/refusedEventStatus`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            eventId: event?._id,
            reason: refusalReason,
            userId: user?._id,
          }),
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toggleRefused(event._id);
      if (!eventStatuses[event._id]?.refused) {
        toast({
          title: eventStatuses[event._id]?.refused
            ? "You refused this event"
            : "You refused to participate to this event",
          className: "bg-evento-gradient text-white",
          duration: 1000,
        });
      }
      setRefusalReason("");
    } catch (error) {
      console.error("Error marking event as refused:", error);
      alert("Failed to mark as refused. Please try again.");
    }
  };

  const handleSend = () => {
    handleNativeShare();
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out this event",
          text: "Check out this event I found!",
          url: "https://localhost:3000/event/" + event?._id,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      console.log("Web Share API is not supported in this browser.");
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        onClick={(e) => {
          handleGoing();
          currentStatus.favourite && handleMaybe();
          currentStatus.refused && handleRefused();
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
              "text-white bg-eventoPurpleLight rounded-full w-full h-full",
            )}
          />
        )}
      </button>
      <button
        onClick={(e) => {
          handleMaybe();
          currentStatus.going && handleGoing();
          currentStatus.refused && handleRefused();
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
              "bg-eventoPurpleLight text-white": currentStatus.favourite,
            },
          )}
        />
      </button>
      <button
        onClick={(e) => {
          currentStatus.refused ? handleRefused() : setIsRefusalModalOpen(true);
          currentStatus.going && handleGoing();
          currentStatus.favourite && handleMaybe();
          e.stopPropagation();
        }}
        className="relative flex items-center justify-center w-10 h-10 hover:opacity-80"
      >
        {currentStatus.refused ? (
          <X className="z-10 text-white" />
        ) : (
          <X className="text-eventoPurpleLight" />
        )}
        <Circle
          strokeWidth={1.5}
          className={cn(
            "absolute inset-0 text-eventoPurpleLight rounded-full w-full h-full",
            {
              "bg-eventoPurpleLight text-white": currentStatus.refused,
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
      )}{" "}
      <RefusalModal
        isOpen={isRefusalModalOpen}
        onClose={() => setIsRefusalModalOpen(false)}
        setRefusalReason={setRefusalReason}
        onSubmit={handleRefused}
        refusalReason={refusalReason}
      />
    </div>
  );
};

export default PrivateEventActionIcons;
