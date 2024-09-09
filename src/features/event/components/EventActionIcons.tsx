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
  const [goingStatus, setGoingStatus] = useState<Record<string, boolean>>({});
  const [favouriteStatus, setFavouriteStatus] = useState<
    Record<string, boolean>
  >({});
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  // check initial status
  const refreshStatus = async () => {
    // console.log("refreshing status", token);
    if (!event || !token) return;
    try {
      const [attendingResponse, favouriteResponse] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/isAttending/${event._id}`,
          {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/isFavourite/${event._id}`,
          {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),
      ]);

      if (!attendingResponse.ok || !favouriteResponse.ok) {
        throw new Error("Error fetching event status");
      }

      const attendingData = await attendingResponse.json();
      const favouriteData = await favouriteResponse.json();

      setGoingStatus((prevStatus) => ({
        ...prevStatus,
        [event._id]: attendingData.attending,
      }));

      setFavouriteStatus((prevStatus) => ({
        ...prevStatus,
        [event._id]: favouriteData.favourite,
      }));
    } catch (error) {
      console.error("Error checking event status:", error);
    }
  };

  useEffect(() => {
    refreshStatus();
  }, [event, token]);
  // handle going status
  const handleGoing = async () => {
    if (!token) {
      console.log("Not logged in");
      setIsAuthModalOpen(true);
      return;
    } else if (!event) {
      console.log("No event");
      return;
    } else {
      try {
        console.log("Before toggle goingStatus:", goingStatus[event._id]);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/attendEventConfm`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ eventId: event._id, userId: user?._id }),
          },
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Si l'événement est marqué comme "favourite", le retirer des favoris
        if (favouriteStatus[event._id]) {
          setFavouriteStatus((prevStatus) => ({
            ...prevStatus,
            [event._id]: false,
          }));
        }

        // Toggle going status
        setGoingStatus((prevStatus) => ({
          ...prevStatus,
          [event._id]: !prevStatus[event._id],
        }));
        console.log("After toggle goingStatus:", !goingStatus[event._id]);
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
        console.log(
          "Before toggle favouriteStatus:",
          favouriteStatus[event._id],
        );
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/eventFavourite`,
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

        // Si l'événement est marqué comme "going", le retirer des participants
        if (goingStatus[event._id]) {
          setGoingStatus((prevStatus) => ({
            ...prevStatus,
            [event._id]: false,
          }));
        }

        // Toggle favourite status
        setFavouriteStatus((prevStatus) => ({
          ...prevStatus,
          [event._id]: !prevStatus[event._id],
        }));
        console.log(
          "After toggle favouriteStatus:",
          !favouriteStatus[event._id],
        );
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

  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        onClick={handleGoing}
        className="relative flex items-center justify-center w-10 h-10"
      >
        {event && !goingStatus[event?._id] ? (
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
        onClick={handleFavourite}
        className="relative flex items-center justify-center w-10 h-10"
      >
        {event && favouriteStatus[event?._id] ? (
          <BookmarkCheck className="z-10 text-white" />
        ) : (
          <Bookmark className="text-eventoPurpleLight" />
        )}
        <Circle
          strokeWidth={1.5}
          className={cn(
            "absolute inset-0 text-eventoPurpleLight rounded-full w-full h-full",
            {
              "bg-eventoPurpleLight text-white":
                event && favouriteStatus[event?._id],
            },
          )}
        />
      </button>
      <button
        onClick={handleSend}
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
            refreshStatus();
          }}
        />
      )}
    </div>
  );
};

export default EventActionIcons;
