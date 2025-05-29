import { Label } from "@/components/ui/label";
import UsersList from "@/components/UsersList";
import { filterUsers } from "@/features/discover/discoverActions";
import { cn } from "@/lib/utils";
import { useUsersStore } from "@/store/useUsersStore";
import { InterestType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  className?: string;
  searchText: string;
  selectedInterests: InterestType[];
};

const EventUsersLists = ({
  searchText,
  selectedInterests,
  className,
}: Props) => {
  const users = useUsersStore((state) => state.users);

  const [SeeMoreCount, setSeeMoreCount] = useState<number>(10);

  const {
    filteredUsers,
    friends,
    usersYouMayKnow,
    usersWithSharedInterests,
    generalSuggestions,
  } = filterUsers(users, selectedInterests, searchText);

  const handleSeeMore = () => {
    setSeeMoreCount(SeeMoreCount + 10);
  };

  return (
    <div className={cn("space-y-4 mb-20", className)}>
      {/* Friends */}
      {searchText && friends.length > 0 && (
        <div>
          <Label className="text-sm">Your friends</Label>
          <ul className="space-y-2">
            {friends.map((user: UserType) => (
              <li key={user._id} className="flex justify-between">
                <UsersList user={user} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Users You May Know */}
      {usersYouMayKnow.length > 0 && (
        <div>
          <Label className="text-sm">You may know them</Label>
          <ul className="space-y-2">
            {usersYouMayKnow.map((user: UserType) => (
              <li key={user._id} className="flex justify-between">
                <UsersList user={user} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Users with Shared Interests */}
      {usersWithSharedInterests.length > 0 && (
        <div>
          <Label className="text-sm">They share your interests</Label>
          <ul className="space-y-2">
            {usersWithSharedInterests.map((user: UserType) => (
              <li key={user._id} className="flex justify-between">
                <UsersList user={user} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* General Suggestions */}
      {generalSuggestions.length > 0 && (
        <div>
          <Label className="text-sm">Other users</Label>
          <ul className="space-y-2">
            {generalSuggestions.slice(0, SeeMoreCount).map((user: UserType) => (
              <li key={user._id} className="flex justify-between">
                <UsersList user={user} />
              </li>
            ))}
          </ul>
          {generalSuggestions.length > SeeMoreCount && (
            <p
              className="text-sm text-blue-400 underline cursor-pointer flex gap-2"
              onClick={handleSeeMore}
            >
              <ChevronDownIcon /> See more
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default EventUsersLists;
