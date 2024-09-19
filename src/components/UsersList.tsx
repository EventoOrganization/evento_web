// src\components\UsersList.tsx
"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@/contexts/SessionProvider";
import AuthModal from "@/features/auth/components/AuthModal";
import { useToast } from "@/hooks/use-toast";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
const UsersList = ({
  user,
  fetchUsers,
  removeUserLocally,
}: {
  user?: any;
  fetchUsers?: () => void;
  removeUserLocally?: (userId: string) => void;
}) => {
  const { id: eventId } = useParams();
  const { token } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isIFollowingHim, setIsIFollowingHim] = useState<boolean | null>(
    user?.isIFollowingHim,
  );
  const [isLoggedUser, setIsLoggedUser] = useState<boolean>(false);
  const isFollowingMe = user?.isFollowingMe;
  const session = useSession();
  useEffect(() => {
    if (session?.user && user) {
      if (session.user._id === user._id) {
        setIsLoggedUser(true);
      }
    }
  }, [session, user, isIFollowingHim, isFollowingMe]);

  const handleFollow = async () => {
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }
    setLoading(true);
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
        setIsIFollowingHim(!isIFollowingHim);
        toast({
          title: "Success",
          description: `You ${!isIFollowingHim ? "followed" : "unfollowed"} this user`,
          duration: 2000,
          className: "bg-evento-gradient text-white",
        });
        if (fetchUsers) fetchUsers();
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleUnGuest = async () => {
    if (!token) {
      setIsAuthModalOpen(true);
      return;
    }
    setLoading(true);
    const body = {
      userId: user?._id,
      eventId: eventId,
    };
    try {
      const response = await fetchData(
        `/events/unGuestUser`,
        HttpMethod.POST,
        body,
        token,
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: `User is no longer a guest.`,
          duration: 2000,
          className: "bg-evento-gradient text-white",
        });
        if (removeUserLocally) removeUserLocally(user._id);
        if (fetchUsers) fetchUsers();
      } else {
        console.error("Error:", response.error);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-between w-full items-center">
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
        <ul>
          <li className="font-bold">{user?.username}</li>
          <li className="text-sm">
            {user?.firstName} {user?.lastName}
          </li>
        </ul>
      </Link>
      <div className="flex gap-2">
        {!isLoggedUser && user.status !== "tempGuest" && (
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
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : isFollowingMe && !isIFollowingHim
                ? "Follow Back"
                : isFollowingMe && isIFollowingHim
                  ? "Friends"
                  : !isFollowingMe && isIFollowingHim
                    ? "Unfollow"
                    : "Follow"}
          </Button>
        )}{" "}
        {(user.status === "tempGuest" || user.status === "guest") && (
          <Button variant="outline" onClick={handleUnGuest} disabled={loading}>
            {loading ? "Processing..." : <XIcon />}
          </Button>
        )}
      </div>
      {isAuthModalOpen && (
        <AuthModal
          onAuthSuccess={() => {
            setIsAuthModalOpen(false);
            fetchUsers?.(); // Fetch the users again on successful authentication
          }}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </div>
  );
};

export default UsersList;
