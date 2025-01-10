import EventoLoader from "@/components/EventoLoader";
import { Label } from "@/components/ui/label";
import UsersList from "@/components/UsersList";
import { UserType } from "@/types/UserType";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

type DiscoverUserListProps = {
  friends: UserType[];
  usersYouMayKnow: UserType[];
  usersWithSharedInterests: UserType[];
  generalSuggestions: UserType[];
  isUserFetching: boolean;
  searchText: boolean;
};

const DiscoverUserList = ({
  searchText,
  friends,
  usersYouMayKnow,
  usersWithSharedInterests,
  generalSuggestions,
  isUserFetching,
}: DiscoverUserListProps) => {
  const [SeeMoreCount, setSeeMoreCount] = useState<number>(10);

  const handleSeeMore = () => {
    setSeeMoreCount(SeeMoreCount + 10);
  };

  if (isUserFetching) {
    return (
      <div className="flex justify-center items-center h-96">
        <EventoLoader />
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-20">
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

export default DiscoverUserList;
