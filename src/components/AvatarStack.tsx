"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGlobalStore } from "@/store/useGlobalStore";
import { EventType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import Image from "next/image";
import { useEffect, useState } from "react";
const AvatarStack = ({ event }: { event: EventType }) => {
  const [friends, setFriends] = useState<UserType[]>([]);
  const { users } = useGlobalStore((state) => ({
    users: state.users as UserType[],
  }));

  useEffect(() => {
    const filteredFriends =
      event?.attendees
        ?.filter((attendee: UserType | null) => attendee && attendee._id) // Check for null and _id
        .filter((attendee: UserType) => {
          const user = users.find((user) => user._id === attendee._id);
          return user?.isIFollowingHim && user?.isFollowingMe;
        }) || [];

    setFriends(filteredFriends);
  }, []);
  return (
    <div className="flex items-center">
      <div className="flex -space-x-3 overflow-hidden">
        {friends.slice(0, 3).map((friend, index) => (
          <div key={index} className="mr-2">
            {friend.profileImage ? (
              <Image
                key={index}
                src={friend.profileImage || ""}
                alt={friend.username}
                width={32}
                height={32}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
              />
            ) : (
              <Avatar key={index} className="w-12 h-12 rounded-full">
                <AvatarImage
                  className="w-12 h-12 rounded-full"
                  src="https://github.com/shadcn.png"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>
      <span className="text-sm">{friends.length} friends going</span>
    </div>
  );
};

export default AvatarStack;
