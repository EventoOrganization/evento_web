import BookingIcon from "@/components/icons/BookingIcon";
import GoingIcon from "@/components/icons/GoingIncon";
import SendIcon from "@/components/icons/SendIcon";
import { useSession } from "@/contexts/SessionProvider";
import AuthModal from "@/features/auth/components/AuthModal";
import { EventType } from "@/types/EventType";
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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  useEffect(() => {
    if (!event) return;
    const checkIfGoing = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/isAttending/${event._id}`,
          {
            credentials: "include",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGoingStatus((prevStatus) => ({
          ...prevStatus,
          [event._id]: data.attending,
        }));
      } catch (error) {
        console.error("Error checking if user is going:", error);
      }
    };

    checkIfGoing();
  }, [event, token]);

  const handleGoing = async () => {
    if (!event || !token) {
      console.log("Not logged in");
      setIsAuthModalOpen(true);
      return;
    } else {
      try {
        console.log("Going", goingStatus);
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
        setGoingStatus((prevStatus) => ({
          ...prevStatus,
          [event._id]: !goingStatus[event._id],
        }));
      } catch (error) {
        console.error("Error marking event as going:", error);
        alert("Failed to mark as going. Please try again.");
      }
    }
  };

  const handleBooking = () => {
    if (!event) return;

    const startDate = event.details?.date
      ? new Date(event.details.date).toISOString().replace(/-|:|\.\d+/g, "")
      : "";

    const endDate = event.details?.endDate
      ? new Date(event.details.endDate).toISOString().replace(/-|:|\.\d+/g, "")
      : "";
    const title = encodeURIComponent(event.title);
    const description = encodeURIComponent(event.details?.description || "");
    const location = encodeURIComponent(event.details?.location || "");

    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${description}&location=${location}&sf=true&output=xml`;

    window.open(googleCalendarUrl, "_blank");
  };

  const handleSend = () => {
    if (!event) return;
    alert("Send action for event:");
    console.log(event);
    // Add your logic here
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <button onClick={handleGoing}>
        <GoingIcon />
      </button>
      <button onClick={handleBooking}>
        <BookingIcon />
      </button>
      <button onClick={handleSend}>
        <SendIcon />
      </button>
      {isAuthModalOpen && (
        <AuthModal onAuthSuccess={() => setIsAuthModalOpen(false)} />
      )}
    </div>
  );
};

export default EventActionIcons;
