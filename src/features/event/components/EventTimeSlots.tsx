import { EventType } from "@/types/EventType";
import React from "react";

type Props = {
  event?: EventType;
};

const EventTimeSlots: React.FC<Props> = ({ event }) => {
  // Helper function to format date and time
  const formatTimeSlot = (slot: {
    date: string;
    startTime: string;
    endTime: string;
  }) => {
    // Parse the date without applying the UTC conversion
    const date = new Date(slot.date);

    // Combine the date and time manually, without converting to UTC
    const startDate = new Date(`${slot.date}T${slot.startTime}`);
    const endDate = new Date(`${slot.date}T${slot.endTime}`);

    // Format options for date and time
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const formattedDate = date.toLocaleDateString("en-UK", dateOptions);
    const startTime = startDate.toLocaleTimeString("en-UK", timeOptions);
    const endTime = endDate.toLocaleTimeString("en-UK", timeOptions);

    return `${formattedDate}\n${startTime} - ${endTime}`;
  };

  return (
    <div>
      {event?.details?.timeSlots && event?.details?.timeSlots?.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {event.details.timeSlots.map((slot, index) => (
            <React.Fragment key={index}>
              <li className="">{formatTimeSlot(slot)}</li>
              {index < (event.details?.timeSlots?.length ?? 0) - 1}
            </React.Fragment>
          ))}
        </ul>
      ) : (
        <p>
          {event?.details?.startTime} - {event?.details?.endTime}
        </p>
      )}
    </div>
  );
};

export default EventTimeSlots;
