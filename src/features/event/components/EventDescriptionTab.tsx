// components/EventDescriptionTab.tsx

import AddToCalendar from "@/components/AddToCalendar";
import {
  default as TruncatedText,
  default as TruncateText,
} from "@/components/TruncatedText";
import EventActionIcons from "@/features/event/components/EventActionIcons";
import { EventType } from "@/types/EventType";
import Link from "next/link";
import { EventStatusKeys } from "./EventIdTabs";
import EventTimeSlots from "./EventTimeSlots";
interface EventDescriptionTabProps {
  event: EventType;
  updateEventStatusLocally?: (
    statusKey: EventStatusKeys,
    value: boolean,
  ) => void;
}

const EventDescriptionTab: React.FC<EventDescriptionTabProps> = ({
  event,
  updateEventStatusLocally,
}) => {
  return (
    <div className="space-y-4 w-full">
      <h1 className="text-xl font-bold">{event?.title}</h1>
      <ul className="flex flex-wrap gap-2">
        {event.interests &&
          event.interests?.map((interest) => {
            return (
              <li
                key={interest._id || interest.name}
                className="bg-eventoPurpleLight/30 w-fit px-2 py-1 rounded-lg text-sm"
              >
                {interest.name}
              </li>
            );
          })}
      </ul>
      <Link href={event?.details?.URLlink || ""} target="_blank">
        <TruncateText
          text={event?.details?.URLtitle || event?.details?.URLlink || ""}
          isLink
        />
      </Link>
      <EventTimeSlots event={event} />
      <TruncatedText
        className="px-0"
        text={event?.details?.description || ""}
        expand={true}
      />
      {event.isGoing && <AddToCalendar event={event} />}
      <EventActionIcons
        event={event}
        updateEventStatusLocally={updateEventStatusLocally}
        isLocal
      />
    </div>
  );
};

export default EventDescriptionTab;
