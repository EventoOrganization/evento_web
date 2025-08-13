import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEventStore } from "@/store/useEventsStore";
import { useProfileStore } from "@/store/useProfileStore";
import { EventType } from "@/types/EventType";
import { MailQuestion } from "lucide-react";
import EventPreview from "../event/components/EventPreview";

const PendingEvents = () => {
  const { userInfo } = useProfileStore();
  const { events, eventsStatus } = useEventStore();
  const currentDate = new Date();

  const getEventStatus = (eventId: string) => eventsStatus[eventId] || {};

  const isUpcomingOrOngoing = (event: EventType) => {
    if (!event.details?.date || !event.details?.endDate) return false;
    const eventStart = new Date(event.details.date);
    const eventEnd = new Date(event.details.endDate);
    return (
      eventStart > currentDate ||
      (eventStart <= currentDate && eventEnd > currentDate)
    );
  };

  // Debug: Log all events and their guest status
  console.log("🔍 PendingEvents Debug:", {
    totalEvents: events.length,
    userInfo: userInfo?._id,
    eventsWithGuests: events
      .filter((event) => event.guests && event.guests.length > 0)
      .map((event) => ({
        id: event._id,
        title: event.title,
        guests: event.guests?.map((g) => g._id),
        isUserGuest: event.guests?.some((g) => g._id === userInfo?._id),
        eventStatus: getEventStatus(event._id),
        isUpcoming: isUpcomingOrOngoing(event),
      })),
  });

  const upcomingGuestedEvents = events.filter((event: EventType) => {
    const eventStatus = getEventStatus(event._id);
    const hasResponded =
      eventStatus.isGoing || eventStatus.isFavourite || eventStatus.isRefused;
    const hasHidden = event.hiddenByUsers?.some((id) => id === userInfo?._id);
    const isGuest = event.guests?.some((guest) => guest._id === userInfo?._id);
    const isUpcoming = isUpcomingOrOngoing(event);

    // Debug: Log each event's filtering criteria
    console.log(`🔍 Event ${event.title} (${event._id}):`, {
      isGuest,
      isUpcoming,
      hasResponded,
      hasHidden,
      willShow: isGuest && isUpcoming && !hasResponded && !hasHidden,
    });

    return isGuest && isUpcoming && !hasResponded && !hasHidden;
  });

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger>
          <PopoverTrigger asChild>
            <div className="relative cursor-pointer">
              <MailQuestion className="w-6 h-6 text-gray-600" />
              {upcomingGuestedEvents.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {upcomingGuestedEvents.length}
                </span>
              )}
            </div>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>
          {upcomingGuestedEvents.length} events pending
        </TooltipContent>
      </Tooltip>
      <PopoverContent
        className="w-fit max-w-2xl p-2 bg-white shadow-lg rounded-md border"
        align="start"
        sideOffset={10}
        side="bottom"
      >
        <p className="text-sm font-semibold mb-2">Pending Events</p>
        <ul
          className={` grid grid-cols-1 md:grid-cols-${upcomingGuestedEvents.length === 1 ? 1 : upcomingGuestedEvents.length === 2 ? 2 : upcomingGuestedEvents.length === 3 ? 3 : 4} gap-2`}
        >
          {upcomingGuestedEvents.map((event) => (
            <li key={event._id} className="max-w-40">
              <EventPreview key={event._id} event={event} title={event.title} />
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default PendingEvents;
