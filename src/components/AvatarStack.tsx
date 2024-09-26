"use client";
import { useEventoStore } from "@/store/useEventoStore";
import { EventType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import Image from "next/image";
import { useEffect, useState } from "react";
const AvatarStack = ({ event }: { event: EventType }) => {
  const [friends, setFriends] = useState<UserType[]>([]);
  const { users } = useEventoStore((state) => ({
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
    <div className="flex items-center space-x-2">
      <div className="flex -space-x-3 overflow-hidden">
        {friends.map((friend, index) => (
          <Image
            key={index}
            src={friend.profileImage || "/default-avatar.jpg"}
            alt={friend.username}
            width={32}
            height={32}
            className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
          />
        ))}
      </div>
      <span className="text-sm">{friends.length} friends going</span>
    </div>
  );
};

export default AvatarStack;
