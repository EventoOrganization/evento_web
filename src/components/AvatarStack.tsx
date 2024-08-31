"use client";
import { useSession } from "@/contexts/SessionProvider";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
interface Friend {
  user: {
    profileImage: string;
    name: string;
  };
  status: string;
}
const AvatarStack = ({ eventId }: { eventId: string }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const { token } = useSession();
  const pathname = usePathname();
  useEffect(() => {
    if (pathname === "/create-event") return;
    const fetchFriends = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/followStatusForAttendedUsers`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ eventId }),
          },
        );
        const result = await response.json();
        // console.log("Result:", result);

        // Access the array within the 'body' key
        const friendList = result.body.filter(
          (friend: Friend) => friend.status === "follow-each-other",
        );
        // console.log("Friend list:", friendList);

        setFriends(friendList);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, [eventId, token]);

  return (
    <div className="flex -space-x-2 overflow-hidden">
      {friends.map((friend, index) => (
        <Image
          key={index}
          src={friend.user.profileImage || "/default-avatar.jpg"}
          alt={friend.user.name}
          width={32}
          height={32}
          className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
        />
      ))}
      <span className="ml-2 text-sm">{friends.length} friends going</span>
    </div>
  );
};

export default AvatarStack;
