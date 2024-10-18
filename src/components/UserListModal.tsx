"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSession } from "@/contexts/SessionProvider";
import { useToast } from "@/hooks/use-toast";
import { useGlobalStore } from "@/store/useGlobalStore";
import { UserType } from "@/types/UserType";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
interface UserListModalProps {
  isOpen: boolean;
  closeModal: () => void;
  userIds: string[]; // Liste d'IDs d'utilisateurs (ex. followingUserIds ou followerUserIds)
  title: string; // Titre de la modale (ex. "Followers" ou "Following")
}

const UserListModal = ({
  isOpen,
  closeModal,
  userIds,
  title,
}: UserListModalProps) => {
  const { token, user: loggedUser } = useSession();
  const { toast } = useToast();
  const [loadingUsers, setLoadingUsers] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const { users } = useGlobalStore((state) => ({
    users: state.users,
  }));
  useEffect(() => {
    // Filtrer les utilisateurs selon leurs IDs
    const matchedUsers = users.filter((user) => userIds.includes(user._id));
    setFilteredUsers(matchedUsers);
  }, [userIds, users]);

  // Fonction pour filtrer selon le terme de recherche
  const searchFilteredUsers = filteredUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const handleFollow = async (userToUpdate: UserType) => {
    setLoadingUsers((prev) => ({ ...prev, [userToUpdate._id]: true }));
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/follow`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ followingId: userToUpdate._id }),
        },
      );

      if (response.ok) {
        const isCurrentlyFollowing = userToUpdate.isIFollowingHim;
        useGlobalStore.getState().updateUser({
          ...userToUpdate,
          isIFollowingHim: !isCurrentlyFollowing,
        });
        useGlobalStore
          .getState()
          .updateFollowingUserIds(
            userToUpdate._id,
            isCurrentlyFollowing ? "unfollow" : "follow",
          );
        toast({
          title: "Success",
          description: `You ${!isCurrentlyFollowing ? "followed" : "unfollowed"} this user`,
          duration: 2000,
          className: "bg-evento-gradient text-white",
        });
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoadingUsers((prev) => ({ ...prev, [userToUpdate._id]: false }));
    }
  };
  const userIncluded = filteredUsers.some(
    (user) => user._id === loggedUser?._id,
  );
  const displayText = userIncluded
    ? `${filteredUsers.length + 1}`
    : `${filteredUsers.length}`;
  return (
    <>
      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[425px] w-[90%] rounded">
          <DialogHeader>
            <DialogTitle>
              {title} ({displayText})
            </DialogTitle>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            {searchFilteredUsers.length > 0 ? (
              <ul className="space-y-4 h-80 overflow-y-auto">
                {searchFilteredUsers.map((user) => (
                  <li
                    key={user._id}
                    className="flex items-center gap-4 justify-between  px-2 py-1 rounded-lg"
                  >
                    <Link
                      href={`/profile/${user._id}`}
                      className="flex items-center gap-4"
                    >
                      {user?.profileImage ? (
                        <Image
                          src={user?.profileImage}
                          alt="user image"
                          width={500}
                          height={500}
                          className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                        />
                      ) : (
                        <div className="flex flex-col">
                          <Avatar className="w-8 h-8 md:w-10 md:h-10">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{user.username}</p>
                        <p className="text-sm text-gray-500">
                          {user.firstName} {user.lastName}
                        </p>
                      </div>
                    </Link>
                    <Button
                      variant={"ghost"}
                      className={`
                      px-5 py-2 rounded-lg font-semibold text-white transition-all hover:scale-105 duration-300 hover:text-white
                      ${user.isIFollowingHim && !user.isFollowingMe ? "bg-gray-400 hover:bg-gray-500 " : ""}
                      ${user.isFollowingMe && !user.isIFollowingHim ? "bg-green-600 hover:bg-green-600/80 " : ""}
                      ${user.isFollowingMe && user.isIFollowingHim ? " bg-evento-gradient " : ""}
                      ${!user.isFollowingMe && !user.isIFollowingHim ? "bg-eventoBlue hover:bg-eventoBlue/80 " : ""}
                      `}
                      onClick={() => handleFollow(user)}
                      disabled={loadingUsers[user._id] ?? false} // Désactiver le bouton uniquement pour cet utilisateur
                    >
                      {loadingUsers[user._id]
                        ? "Processing..."
                        : user.isFollowingMe && !user.isIFollowingHim
                          ? "Follow Back"
                          : user.isFollowingMe && user.isIFollowingHim
                            ? "Friends"
                            : !user.isFollowingMe && user.isIFollowingHim
                              ? "Unfollow"
                              : "Follow"}
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No users found.</p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={closeModal}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserListModal;
