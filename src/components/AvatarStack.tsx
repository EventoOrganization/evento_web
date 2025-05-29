"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUsersStore } from "@/store/useUsersStore";
import { EventType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { useEffect, useState } from "react";
import SmartImage from "./SmartImage";
const AvatarStack = ({ event }: { event: EventType }) => {
  const [friends, setFriends] = useState<UserType[]>([]);
  const { users } = useUsersStore();
  useEffect(() => {
    const filteredFriends =
      event?.attendees
        ?.filter((attendee: UserType | null) => attendee && attendee._id)
        .filter((attendee: UserType) => {
          const user = Array.isArray(users)
            ? users.find((user) => user._id === attendee._id)
            : undefined;
          return user?.isIFollowingHim && user?.isFollowingMe;
        }) || [];

    setFriends(filteredFriends);
  }, [users, event?.attendees]);
  return (
    <div className="flex items-center">
      <div className="flex -space-x-3 overflow-hidden mr-2">
        {friends.slice(0, 3).map((friend, index) => (
          <div key={index} className="">
            {friend.profileImage ? (
              <SmartImage
                key={index}
                src={friend.profileImage || ""}
                alt={friend.username}
                width={32}
                height={32}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                forceImg
              />
            ) : (
              <Avatar
                key={index}
                className="h-8 w-8 rounded-full ring-2 ring-white"
              >
                <AvatarImage
                  className="h-8 w-8 rounded-full"
                  src="/evento-logo.png"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>
      <span className="text-sm">{friends.length > 0 && "friends going"}</span>
    </div>
  );
};

export default AvatarStack;
