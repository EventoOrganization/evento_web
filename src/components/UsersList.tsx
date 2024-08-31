// src\components\UsersList.tsx
"use client";
import { useSession } from "@/contexts/SessionProvider";
import AuthModal from "@/features/auth/components/AuthModal";
import { cn } from "@/lib/utils";
import { UserType } from "@/types/UserType";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";
const UserPrevirew = ({ user }: { user?: UserType }) => {
  const { token } = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(
    user?.status === "follow-each-other" || user?.status === "following",
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
        const data = await response.json();
        setIsFollowing(!isFollowing);
        console.log(data.message);
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
      <span className="flex items-center gap-4">
        {user?.profileImage ? (
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
      </span>
      <Button
        variant={"outline"}
        className={cn("bg-gray-200 text-black rounded-full px-5", {
          "bg-evento-gradient-button text-white": !isFollowing,
        })}
        onClick={handleFollow}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
      {isAuthModalOpen && (
        <AuthModal
          onAuthSuccess={() => setIsAuthModalOpen(false)}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </>
  );
};

export default UserPrevirew;
