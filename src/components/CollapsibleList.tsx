import { cn } from "@/lib/utils";
import { EventType } from "@/types/EventType";
import { TempUserType, UserType } from "@/types/UserType";
import { ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import UsersList from "./UsersList";
const CollapsibleList = ({
  title,
  count,
  users,
  event,
  isAdmin = false,
  setEvent,
  selectedIds,
  isSelectEnable,
  setSelectedIds,
}: {
  title: string;
  count: number;
  users: (UserType | TempUserType)[];
  event?: EventType;
  isAdmin?: boolean;
  setEvent?: (event: EventType) => void;
  isSelectEnable?: boolean;
  selectedIds?: string[];
  setSelectedIds?: (ids: string[]) => void;
}) => {
  const [isOpen, setIsOpen] = useState(
    title === "Going" || title === "Invited" ? true : false,
  );
  useEffect(() => {
    if (isSelectEnable) setIsOpen(true);
  }, [isSelectEnable]);
  const removeUserLocally = (userId: string) => {
    if (!setEvent || !event) return;
    const updateAttendees =
      event?.attendees?.filter((attendee) => attendee._id !== userId) || [];
    const updatedGuests =
      event?.guests?.filter((guest) => guest._id !== userId) || [];
    const updatedTempGuests =
      event?.tempGuests?.filter((tempGuest) => tempGuest._id !== userId) || [];
    console.log("updateAttendees", updateAttendees);
    setEvent({
      ...event,
      attendees: updateAttendees,
      guests: updatedGuests,
      tempGuests: updatedTempGuests,
    });
  };

  return (
    <div className="mb-4 w-full  ease-in-out">
      <div className="flex justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex justify-between items-center  font-bold rounded-md  w-fit"
        >
          <span>
            <ChevronRightIcon
              className={cn(
                "transition-transform duration-300",
                isOpen ? "rotate-90" : "rotate-0",
              )}
            />
          </span>
          {title} ({count})
        </button>
      </div>
      {isOpen && (
        <div className="mt-2 space-y-2">
          {users
            .filter((user) => user && user._id)
            .map((user) => (
              <UsersList
                isAdmin={isAdmin}
                key={user._id}
                user={user}
                removeUserLocally={removeUserLocally}
                event={event}
                title={title}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                isSelectEnable={isSelectEnable}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default CollapsibleList;
