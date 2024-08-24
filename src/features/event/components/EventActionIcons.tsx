import BookingIcon from "@/components/icons/BookingIcon";
import GoingIcon from "@/components/icons/GoingIncon";
import SendIcon from "@/components/icons/SendIcon";
import React from "react";

type EventActionIconsProps = {
  event: any;
  className?: string;
};

const EventActionIcons: React.FC<EventActionIconsProps> = ({
  event,
  className = "",
}) => {
  const handleGoing = (event: any) => {
    alert("Going action for event:");
    console.log(event);

    // Add your logic here
  };

  const handleBooking = (event: any) => {
    alert("Booking action for event:");
    console.log(event);
    // Add your logic here
  };

  const handleSend = (event: any) => {
    alert("Send action for event:");
    console.log(event);
    // Add your logic here
  };
  return (
    <div className={`flex gap-2 ${className}`}>
      <button onClick={() => handleGoing(event)}>
        <GoingIcon />
      </button>
      <button onClick={() => handleBooking(event)}>
        <BookingIcon />
      </button>
      <button onClick={() => handleSend(event)}>
        <SendIcon />
      </button>
    </div>
  );
};

export default EventActionIcons;
