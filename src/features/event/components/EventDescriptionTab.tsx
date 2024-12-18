// components/EventDescriptionTab.tsx

import AddressModal from "@/components/AddressModal";
import AddToCalendar from "@/components/AddToCalendar";
import EventoLoader from "@/components/EventoLoader";
import {
  default as TruncatedText,
  default as TruncateText,
} from "@/components/TruncatedText";
import EventActionIcons from "@/features/event/components/EventActionIcons";
import { EventType } from "@/types/EventType";
import { renderDate } from "@/utils/dateUtils";
import Link from "next/link";
import { EventStatusKeys } from "./EventIdTabs";
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
  console.log("event", event.details?.URLlink);
  return (
    <div className="space-y-2 w-full">
      <h2 className="text-xl font-bold">{event?.title}</h2>
      <div className="flex justify-between items-center text-sm">
        <AddressModal address={event?.details?.location} />
      </div>
      <div className="flex flex-wrap text-sm justify-between text-muted-foreground">
        <p className="whitespace-nowrap text-black font-bold">
          {renderDate(event) || <EventoLoader />}
        </p>
        <p className="whitespace-nowrap">
          {event?.details?.startTime}
          {event?.details?.endTime ? ` - ${event?.details?.endTime}` : ""}
        </p>
      </div>
      <TruncatedText
        className="px-0 text-muted-foreground"
        text={event?.details?.description || ""}
      />
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
      <Link
        href={event?.details?.URLlink || ""}
        target="_blank"
        className="underline text-blue-500"
      >
        <TruncateText
          text={event?.details?.URLtitle || event?.details?.URLlink || ""}
        />
      </Link>
      <AddToCalendar event={event} />
      <EventActionIcons
        event={event}
        updateEventStatusLocally={updateEventStatusLocally}
        isLocal
      />
    </div>
  );
};

export default EventDescriptionTab;
