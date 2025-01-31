import { cn } from "@/lib/utils";
import { EventType } from "@/types/EventType";
import { TempUserType, UserType } from "@/types/UserType";
import { ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import ExportCSVButton from "./ExportCSVButton";
import UsersList from "./UsersList";
const CollapsibleList = ({
  title,
  count,
  users,
  event,
  isAdmin = false,
  setEvent,
}: {
  title: string;
  count: number;
  users: (UserType | TempUserType)[];
  event?: EventType;
  isAdmin?: boolean;
  setEvent?: (event: EventType) => void;
}) => {
  const [isOpen, setIsOpen] = useState(
    title === "Going" || title === "Invited" ? true : false,
  );
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
        {title === "Going" && event && isAdmin && (
          <ExportCSVButton event={event} />
        )}
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
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default CollapsibleList;
