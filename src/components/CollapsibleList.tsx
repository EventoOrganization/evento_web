import { cn } from "@/lib/utils";
import { UserType } from "@/types/UserType";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import UsersList from "./UsersList";

const CollapsibleList = ({
  title,
  count,
  users,
}: {
  title: string;
  count: number;
  users: UserType[];
}) => {
  const [isOpen, setIsOpen] = useState(title === "Going" ? true : false);
  return (
    <div className="mb-4 w-full  ease-in-out">
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
      {isOpen && (
        <div className="mt-2 space-y-2">
          {users.map((user: UserType) => (
            <UsersList key={user._id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CollapsibleList;
