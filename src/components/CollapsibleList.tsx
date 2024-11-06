import RSVPSubmissionsList from "@/features/event/components/RSVPSubmissionsList";
import { cn } from "@/lib/utils";
import { EventType } from "@/types/EventType";
import { TempUserType, UserType } from "@/types/UserType";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import UsersList from "./UsersList";
type SelectedUser = UserType | TempUserType;
const CollapsibleList = ({
  title,
  count,
  users,
  event,
  isRequestedTab = false,
  isAdmin = false,
}: {
  title: string;
  count: number;
  users: (UserType | TempUserType)[];
  event?: EventType;
  isRequestedTab?: boolean;
  isAdmin?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(title === "Going" ? true : false);
  const [usersList, setUsersList] = useState<SelectedUser[]>(users);
  const removeUserLocally = (userId: string) => {
    setUsersList((prevUsers) =>
      prevUsers.filter((user) => user._id !== userId),
    );
  };
  useEffect(() => {
    setUsersList(users);
  }, [users]);
  return (
    <div className="mb-4 w-full  ease-in-out">
      <div className="flex justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex justify-between items-center text-eventoPurpleLight font-bold p-2 rounded-md  w-fit"
        >
          {title} ( {count} )
          <span>
            <ChevronDownIcon
              className={cn(
                "transition-transform duration-300",
                isOpen ? "rotate-180" : "rotate-0",
              )}
            />
          </span>
        </button>
        {title === "Going" && isAdmin && (
          <RSVPSubmissionsList rsvp={usersList} />
        )}
      </div>
      {isOpen && (
        <div className="mt-2 space-y-2">
          {usersList
            .filter((user) => user && user._id)
            .map((user) => (
              <UsersList
                isAdmin={isAdmin}
                key={user._id}
                user={user}
                removeUserLocally={removeUserLocally}
                event={event}
                isRequestedTab={isRequestedTab}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default CollapsibleList;
