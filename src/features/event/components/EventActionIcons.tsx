import { useSession } from "@/contexts/SessionProvider";
import AuthModal from "@/features/auth/components/AuthModal";
import { cn } from "@/lib/utils";
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

type EventActionIconsProps = {
  event?: EventType;
  className?: string;
};

const EventActionIcons: React.FC<EventActionIconsProps> = ({
  event,
  className = "",
}) => {
  const { token, user } = useSession();
  const [goingStatus, setGoingStatus] = useState<boolean>(
    event?.isGoing ?? false,
  );
  const [favouriteStatus, setFavouriteStatus] = useState<boolean>(
    event?.isFavourite ?? false,
  );
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

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
            body: JSON.stringify({
              eventId: event._id,
              userId: user?._id,
              attendStatus: goingStatus,
            }),
          },
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (favouriteStatus) {
          handleFavourite();
          setFavouriteStatus(false);
        }
        setGoingStatus(!goingStatus);
      } catch (error) {
        console.error("Error marking event as going:", error);
        alert("Failed to mark as going. Please try again.");
      }
    }
  };

  // handle favourite status
  const handleFavourite = async () => {
    if (!token) {
      console.log("Not logged in");
      setIsAuthModalOpen(true);
      return;
    } else if (!event) {
      console.log("No event");
      return;
    } else {
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

        if (goingStatus) {
          handleGoing();
          setGoingStatus(false);
        }

        setFavouriteStatus(!favouriteStatus);
      } catch (error) {
        console.error("Error marking event as favourite:", error);
        alert("Failed to mark as favourite. Please try again.");
      }
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
  useEffect(() => {}, [goingStatus, favouriteStatus]);
  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        onClick={(e) => {
          handleGoing();
          e.stopPropagation();
        }}
        className="relative flex items-center justify-center w-10 h-10"
      >
        {event && !goingStatus ? (
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
          handleFavourite();
          e.stopPropagation();
        }}
        className="relative flex items-center justify-center w-10 h-10"
      >
        {event && favouriteStatus ? (
          <BookmarkCheck className="z-10 text-white" />
        ) : (
          <Bookmark className="text-eventoPurpleLight" />
        )}
        <Circle
          strokeWidth={1.5}
          className={cn(
            "absolute inset-0 text-eventoPurpleLight rounded-full w-full h-full",
            {
              "bg-eventoPurpleLight text-white": event && favouriteStatus,
            },
          )}
        />
      </button>
      <button
        onClick={(e) => {
          handleSend();
          e.stopPropagation();
        }}
        className="relative flex items-center justify-center w-10 h-10"
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
    </div>
  );
};

export default EventActionIcons;
