// src\components\UsersList.tsx
"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@/contexts/SessionProvider";
import AuthModal from "@/features/auth/components/AuthModal";
import { cn } from "@/lib/utils";
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
  const userInfo = user.user;
  const { token } = useSession();
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
          body: JSON.stringify({ followingId: userInfo?._id }),
        },
      );

      if (response.ok) {
        setIsFollowing((prevIsFollowing) => !prevIsFollowing);
        const data = await response.json();
        setIsFollowing(!isFollowing);
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
      <Link
        href={`/profile/${userInfo?._id}`}
        className="flex items-center gap-4"
      >
        {userInfo?.profileImage &&
        userInfo?.profileImage.startsWith("http") &&
        userInfo?.profileImage ? (
          <Image
            src={userInfo.profileImage}
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
        {userInfo?.firstName} {userInfo?.lastName}
      </Link>
      <Button
        variant={"outline"}
        className={cn("bg-gray-200 text-black rounded-lg px-5", {
          "bg-evento-gradient-button text-white": !isFollowing,
        })}
        onClick={handleFollow}
      >
        {isFollowing ? "Unfollow" : "Follow"}
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
