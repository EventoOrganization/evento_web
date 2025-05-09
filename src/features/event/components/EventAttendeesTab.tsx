// components/EventAttendeesTab.tsx

import CollapsibleList from "@/components/CollapsibleList";
import GuestAllowFriendToggle from "@/components/GuestAllowFriendToggle";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { EventType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import Link from "next/link";
import { useEffect, useState } from "react";
import { isApproved } from "../eventActions";
import AddAnnoncement from "../update/AddUpdate";
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
  const [isSelectEnable, setIsSelectEnable] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  useEffect(() => {
    console.log("isSelectEnable", isSelectEnable);
  }, [isSelectEnable]);
  useEffect(() => {
    console.log("selectedIds", selectedIds);
  }, [selectedIds]);
  const approvedGoingUsers = (event?.attendees || []).filter(
    (user) => event && isApproved(event, user as UserType),
  );

  const pendingApprovalUsers = (event?.attendees || []).filter(
    (user) => event && !isApproved(event, user as UserType),
  );

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

          {event?.googleSheetUrl ? (
            <Button
              asChild
              variant={"link"}
              className={cn(`text-eventoPurpleLight`, {})}
              onClick={() => {
                if (!event?.googleSheetUrl) {
                  alert("No Google Sheet URL found");
                  return;
                }
              }}
            >
              <Link href={`${event?.googleSheetUrl}`} target="_blank">
                Google Sheet
              </Link>
            </Button>
          ) : (
            <Button
              variant={"link"}
              className={cn(`text-eventoPurpleLight`)}
              onClick={() => {
                alert("Sorry, this event is to old. No Google Sheet URL found");
              }}
            >
              Google Sheet
            </Button>
          )}
          {/* <ExportCSVButton event={event} /> */}
          <AddAnnoncement
            event={event}
            setEvent={setEvent}
            invitedUsers={invitedUsers}
            setIsSelectEnable={setIsSelectEnable}
            selectedIds={selectedIds}
          />
        </div>
      )}
      {isGuest && event?.guestsAllowFriend && (
        <div className="grid grid-cols-2 items-center justify-between gap-2 mb-2">
          <Label>You are authorized to invite friends</Label>
          <EventGuestModal event={event} setEvent={setEvent} />{" "}
        </div>
      )}
      {isAdmin || !event?.showUsersLists ? (
        <>
          <CollapsibleList
            title="Going"
            count={approvedGoingUsers?.length || 0}
            users={event?.attendees || []}
            event={event}
            isAdmin={isAdmin}
            setEvent={setEvent}
            isSelectEnable={isSelectEnable}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
          />
          {isAdmin && event?.requiresApproval && (
            <CollapsibleList
              title="Going Pending Approval"
              count={pendingApprovalUsers?.length || 0}
              users={event?.attendees || []}
              event={event}
              isAdmin={isAdmin}
              setEvent={setEvent}
              isSelectEnable={isSelectEnable}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
            />
          )}
          <CollapsibleList
            isAdmin={isAdmin}
            title="Invited"
            count={invitedUsers?.length || 0}
            users={invitedUsers || []}
            event={event}
            setEvent={setEvent}
            isSelectEnable={isSelectEnable}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
          />
          {isPrivate && (
            <CollapsibleList
              title="Refused"
              count={event?.refused?.length || 0}
              users={event?.refused || []}
              isAdmin={isAdmin}
              isSelectEnable={isSelectEnable}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
            />
          )}
        </>
      ) : (
        <p className="p-4 mt-8 text-center">Sorry, the guestlist is private.</p>
      )}
      {isAdmin && (
        <>
          {Array.isArray(event?.requested) && event.requested.length > 0 && (
            <CollapsibleList
              isAdmin={isAdmin}
              title="Requested to Join"
              setEvent={setEvent}
              event={event}
              count={event.requested.length}
              users={event.requested}
            />
          )}
          <CollapsibleList
            title={event?.eventType === "public" ? "Favourite" : "Maybe"}
            count={event?.favouritees?.length || 0}
            users={event?.favouritees || []}
            isSelectEnable={isSelectEnable}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
          />
        </>
      )}
    </div>
  );
};

export default EventAttendeesTab;
