import { useEventStore } from "@/store/useEventsStore";
import { EventType } from "@/types/EventType";
import { getCapacityStatus } from "@/utils/availabilityStatus";

const EventLimit = ({ event }: { event: EventType }) => {
  const eventStatus =
    useEventStore((state) => event && state.eventsStatus[event._id]) || {};
  const currentGuests = event.attendees?.length ?? 0;
  const limitedGuests = event.limitedGuests;
  if (
    limitedGuests === null ||
    limitedGuests === undefined ||
    limitedGuests === 0
  )
    return;
  const status = getCapacityStatus(
    currentGuests,
    limitedGuests || 0,
    eventStatus.isGoing,
  );
  return (
    <div
      className={`flex items-center justify-center 
      border rounded px-2 py-1
      ${status.bgColor} ${status.textColor} ${status.borderColor} 
      font-semibold text-sm text-center `}
    >
      {status.label}
    </div>
  );
};

export default EventLimit;
