// components/EventDescriptionTab.tsx

import AddressModal from "@/components/AddressModal";
import AddToCalendar from "@/components/AddToCalendar";
import EventoLoader from "@/components/EventoLoader";
import {
  default as TruncatedText,
  default as TruncateText,
} from "@/components/TruncatedText";
import { useSession } from "@/contexts/SessionProvider";
import EventActionIcons from "@/features/event/components/EventActionIcons";
import { EventType } from "@/types/EventType";
import { renderDate } from "@/utils/dateUtils";
import Link from "next/link";
import EventAnnouncement from "../EventAnnouncement";
import { EventStatusKeys } from "./EventIdTabs";
interface EventDescriptionTabProps {
  event: EventType;
  isAdmin?: boolean;
  updateEventStatusLocally?: (
    statusKey: EventStatusKeys,
    value: boolean,
  ) => void;
  setEvent?: (event: EventType) => void;
}

const EventDescriptionTab: React.FC<EventDescriptionTabProps> = ({
  event,
  isAdmin,
  updateEventStatusLocally,
  setEvent,
}) => {
  const { user } = useSession();
  const filteredAnnouncements =
    event.announcements &&
    event.announcements.filter((announcement) => {
      if (isAdmin) return true;
      if (!user) return false;

      const isDirectRecipient = announcement.receivers.userIds?.includes(
        user._id,
      );
      const hasMatchingStatus =
        announcement.receivers.status &&
        ((announcement.receivers.status === "going" && event.isGoing) ||
          (announcement.receivers.status === "invited" && event.isFavourite) ||
          (announcement.receivers.status === "decline" && event.isRefused));

      return isDirectRecipient || hasMatchingStatus;
    });

  return (
    <div className="flex flex-col h-full gap-2 w-full">
      <h2 className="text-xl font-bold">{event?.title}</h2>
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
      <EventActionIcons
        event={event}
        updateEventStatusLocally={updateEventStatusLocally}
        isLocal
      />
      <AddToCalendar event={event} />
      <h3 className="text-base">Event Description</h3>
      <TruncatedText
        expand={
          filteredAnnouncements && filteredAnnouncements.length > 0
            ? false
            : true
        }
        className="px-0 text-muted-foreground"
        text={event?.details?.description || ""}
      />
      <Link
        href={event?.details?.URLlink || ""}
        target="_blank"
        className="underline text-blue-500"
      >
        <TruncateText
          text={event?.details?.URLtitle || event?.details?.URLlink || ""}
        />
      </Link>{" "}
      <h3 className="text-base">Event Activity</h3>
      {filteredAnnouncements && filteredAnnouncements.length > 0 && (
        <EventAnnouncement
          event={event}
          isAdmin={isAdmin}
          setEvent={setEvent}
        />
      )}
    </div>
  );
};

export default EventDescriptionTab;
