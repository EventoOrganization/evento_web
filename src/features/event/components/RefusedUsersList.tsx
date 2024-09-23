import { cn } from "@/lib/utils";
import { UserType } from "@/types/UserType";
import { ChevronDownIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const RefusedUsersList = ({
  title,
  users,
}: {
  title: string;
  users: (UserType | null)[];
}) => {
  const [isOpen, setIsOpen] = useState(title === "Refused" ? true : false);

  return (
    <div className="mb-4 w-full ease-in-out">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center text-eventoPurpleLight font-bold p-2 rounded-md w-fit"
      >
        {title} ({users.filter((user) => user !== null).length})
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
        <div className="mt-2 space-y-4">
          {users
            .filter((user) => user !== null) // Filter out null users
            .map((user) => (
              <div key={user!._id} className="p-4 border rounded-md">
                <div className="flex items-center mb-4">
                  <Image
                    src={user!.profileImage || ""}
                    alt={user!.username}
                    width={30}
                    height={30}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <h3 className="font-bold">{user!.username}</h3>
                </div>

                <div className="mb-2">
                  <p className="font-medium">Reason for Refusal:</p>
                  <p className="ml-4 text-gray-700">
                    {user!.refusedReason || "No reason provided"}
                  </p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default RefusedUsersList;
