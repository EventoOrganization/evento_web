// components/EventAttendeesTab.tsx

import CollapsibleList from "@/components/CollapsibleList";
import ExportCSVButton from "@/components/ExportCSVButton";
import GuestAllowFriendToggle from "@/components/GuestAllowFriendToggle";
import { Label } from "@/components/ui/label";
import { EventType } from "@/types/EventType";
import EventGuestModal from "./EventGuestModal";
import HideGuestList from "./HideGuestList";

interface EventAttendeesTabProps {
  event: EventType | undefined;
  isAdmin?: boolean;
  isPrivate?: boolean;
  isGuest?: boolean;
  setEvent?: (event: EventType) => void;
}

const EventAttendeesTab: React.FC<EventAttendeesTabProps> = ({
  event,
  isAdmin,
  isPrivate,
  isGuest,
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
        <div className="grid grid-cols-2 items-center justify-between gap-2 mb-2">
          <GuestAllowFriendToggle event={event} />
          <EventGuestModal event={event} setEvent={setEvent} />
          <HideGuestList event={event} />
          <ExportCSVButton event={event} />
        </div>
      )}
      {isGuest && event?.guestsAllowFriend && (
        <div className="grid grid-cols-2 items-center justify-between gap-2 mb-2">
          <Label>You are autorized to invite friends</Label>
          <EventGuestModal event={event} setEvent={setEvent} />{" "}
        </div>
      )}
      <CollapsibleList
        title="Going"
        count={event?.attendees?.length || 0}
        users={event?.attendees || []}
        event={event}
        isAdmin={isAdmin}
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
          isAdmin={isAdmin}
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
            title={event?.eventType === "public" ? "Favourite" : "Maybe"}
            count={event?.favouritees?.length || 0}
            users={event?.favouritees || []}
          />
        </>
      )}
    </div>
  );
};

export default EventAttendeesTab;
