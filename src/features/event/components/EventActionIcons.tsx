import BookingIcon from "@/components/icons/BookingIcon";
import GoingIcon from "@/components/icons/GoingIncon";
import SendIcon from "@/components/icons/SendIcon";
import AuthModal from "@/features/auth/components/AuthModal";
import { useAuthStore } from "@/store/useAuthStore";
import { Event } from "@/types/EventType";
import React, { useEffect, useState } from "react";
import { isUserLoggedInCSR } from "../eventActions";

type EventActionIconsProps = {
  event?: any;
  className?: string;
};

const EventActionIcons: React.FC<EventActionIconsProps> = ({
  event,
  className = "",
}) => {
  // console.log("event", event);
  const [goingStatus, setGoingStatus] = useState<Record<string, boolean>>({});
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const token = isUserLoggedInCSR();
  const user = useAuthStore((state) => state.user);
  useEffect(() => {
    if (!event) return;
    const checkIfGoing = async () => {
      // console.log(event._id, token);
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
        console.log("response", data.attending);
        setGoingStatus((prevStatus) => ({
          ...prevStatus,
          [event._id]: data.attending,
        }));
      } catch (error) {
        console.error("Error checking if user is going:", error);
      }
    };

    checkIfGoing();
  }, []);
  const handleGoing = async (event: Event) => {
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!event) return;
    try {
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
  };
  const handleBooking = (event: Event) => {
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

  const handleSend = (event: Event) => {
    alert("Send action for event:");
    console.log(event);
    // Add your logic here
  };
  return (
    <div className={`flex gap-2 ${className}`}>
      <button onClick={() => handleGoing(event)}>
        {/* {goingStatus[event._id] ? <CrossIcon /> : <GoingIcon />} */}
        <GoingIcon />
      </button>
      <button onClick={() => handleBooking(event)}>
        <BookingIcon />
      </button>
      <button onClick={() => handleSend(event)}>
        <SendIcon />
      </button>
      {isAuthModalOpen && (
        <AuthModal onAuthSuccess={() => setIsAuthModalOpen(false)} />
      )}
    </div>
  );
};

export default EventActionIcons;
