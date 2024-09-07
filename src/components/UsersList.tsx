// src\components\UsersList.tsx
"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@/contexts/SessionProvider";
import AuthModal from "@/features/auth/components/AuthModal";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
const UserPrevirew = ({
  user,
  fetchUsers,
}: {
  user?: any;
  fetchUsers?: () => void;
}) => {
  const { token } = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isIFollowingHim, setIsIFollowingHim] = useState<boolean | null>(
    user?.isIFollowingHim,
  );
  const isFollowingMe = user?.isFollowingMe;

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
        setIsIFollowingHim((prevIsFollowing) => !prevIsFollowing);
        const data = await response.json();
        setIsIFollowingHim(!isIFollowingHim);
        console.log(data.message, data);
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
          <Image
            src={user.profileImage}
            alt="user image"
            width={500}
            height={500}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="flex flex-col">
            <Avatar className="w-10 h-10 ">
              <AvatarImage
                src="https://github.com/shadcn.png"
                className="rounded-full"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        )}
        {user?.firstName} {user?.lastName}
      </Link>
      <Button
        variant={"ghost"}
        className={`
          px-5 py-2 rounded-lg font-semibold text-white transition-all hover:scale-105 duration-300 hover:text-white
          ${isIFollowingHim && !isFollowingMe ? "bg-gray-400 hover:bg-gray-500 " : ""}
          ${isFollowingMe && !isIFollowingHim ? "bg-eventoBlue hover:bg-eventoBlue/80 " : ""}
          ${isFollowingMe && isIFollowingHim ? " bg-evento-gradient " : ""}
          ${!isFollowingMe && !isIFollowingHim ? "bg-eventoPurpleLight hover:bg-gray-300 " : ""}
        `}
        onClick={handleFollow}
      >
        {isFollowingMe && !isIFollowingHim
          ? "Follow Back"
          : isFollowingMe && isIFollowingHim
            ? "Friends"
            : !isFollowingMe && isIFollowingHim
              ? "Unfollow"
              : "Follow"}
      </Button>
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

export default UserPrevirew;
