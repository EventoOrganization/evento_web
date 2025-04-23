// src\components\UsersList.tsx
"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import AuthModal from "@/features/auth/components/AuthModal";
import { cn } from "@/lib/utils";
import { UserType } from "@/types/UserType";
import Link from "next/link";
import { useState } from "react";
import SmartImage from "./SmartImage";
import { Button } from "./ui/button";
const AttendeesList = ({
  user,
  fetchUsers,
}: {
  user?: UserType;
  fetchUsers?: () => void;
}) => {
  const { token, user: loggedUser } = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean | null>(
    user?.status === "following" ? true : false,
  );
  const handleFollow = async () => {
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/follow`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ followingId: user?._id }),
        },
      );

      if (response.ok) {
        setIsFollowing((prevIsFollowing) => !prevIsFollowing);
        setIsFollowing(!isFollowing);
        // Refresh the user list after following/unfollowing
        if (fetchUsers) fetchUsers();
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <>
      <Link href={`/profile/${user?._id}`} className="flex items-center gap-4">
        {user?.profileImage &&
        user?.profileImage.startsWith("http") &&
        user?.profileImage ? (
          <SmartImage
            src={user.profileImage}
            alt="user image"
            width={500}
            height={500}
            className="w-10 h-10 rounded-full"
            forceImg
          />
        ) : (
          <div className="flex flex-col">
            <Avatar className="w-10 h-10 ">
              <AvatarImage src="/evento-logo.png" className="rounded-full" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        )}
        {user?.username}
        {user?.firstName} {user?.lastName}
      </Link>
      {user?.username !== loggedUser?.username && (
        <Button
          variant={"outline"}
          className={cn("bg-gray-200 text-black rounded-lg px-5", {
            "bg-evento-gradient-button text-white": !isFollowing,
          })}
          onClick={handleFollow}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
      )}

      {isAuthModalOpen && (
        <AuthModal
          onAuthSuccess={() => {
            setIsAuthModalOpen(false);
            fetchUsers?.(); // Fetch the users again on successful authentication
          }}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </>
  );
};

export default AttendeesList;
