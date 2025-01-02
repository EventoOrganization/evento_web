// components/EventAttendeesTab.tsx

import CollapsibleList from "@/components/CollapsibleList";
import GuestAllowFriendToggle from "@/components/GuestAllowFriendToggle";
import { EventType } from "@/types/EventType";
import EventGuestModal from "./EventGuestModal";

interface EventAttendeesTabProps {
  event: EventType | undefined;
  isAdmin?: boolean;
  isPrivate?: boolean;
  setEvent?: (event: EventType) => void;
}

const EventAttendeesTab: React.FC<EventAttendeesTabProps> = ({
  event,
  isAdmin,
  isPrivate,
  setEvent,
}) => {
  const goingIds = new Set(
    (event?.attendees || []).map((user) => user._id!).filter((id) => id),
  );
  const favouritedIds = new Set(
    (event?.favouritees || []).map((user) => user._id!).filter((id) => id),
  );
  const refusedIds = new Set(
    (event?.refused || []).map((user) => user._id!).filter((id) => id),
  );
  const invitedUsers = [
    ...(event?.guests || []),
    ...(event?.tempGuests || []),
  ].filter(
    (user) =>
      user._id &&
      !goingIds.has(user._id) &&
      !favouritedIds.has(user._id) &&
      !refusedIds.has(user._id),
  );
  return (
    <div className="w-full">
      {isAdmin && (
        <div className="flex items-center justify-between gap-2">
          <GuestAllowFriendToggle event={event} />
          <EventGuestModal event={event} setEvent={setEvent} />
        </div>
      )}
      <CollapsibleList
        title="Going"
        count={event?.attendees?.length || 0}
        users={event?.attendees || []}
      />
      <CollapsibleList
        isAdmin={isAdmin}
        title="Invited"
        count={invitedUsers?.length || 0}
        users={invitedUsers || []}
        event={event}
        setEvent={setEvent}
      />
      {isPrivate && (
        <CollapsibleList
          title="Refused"
          count={event?.refused?.length || 0}
          users={event?.refused || []}
        />
      )}
      {isAdmin && (
        <>
          <CollapsibleList
            isAdmin={isAdmin}
            title="Requested to Join"
            count={event?.requested?.length || 0}
            users={event?.requested || []}
          />
          <CollapsibleList
            title="favorited"
            count={event?.favouritees?.length || 0}
            users={event?.favouritees || []}
          />
        </>
      )}
    </div>
  );
};

export default EventAttendeesTab;
