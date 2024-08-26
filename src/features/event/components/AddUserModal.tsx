import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import { useEffect, useState } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  lastName?: string;
  firstName?: string;
}

interface AddUserModalProps {
  title: string;
  selectedUsers: User[];
  onSave: (selectedUsers: string[]) => void;
  onAddUser: (user: User) => void;
  onRemoveUser: (user: User) => void;
}

const AddUserModal = ({
  title,
  selectedUsers,
  onSave,
  onAddUser,
  onRemoveUser,
}: AddUserModalProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const token = useAuthStore((state) => state.user?.token);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/userListWithFollowingStatus`,
          {
            credentials: "include",
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const sortedUsers = result.body.sort((a: any, b: any) => {
          if (
            a.status === "follow-each-other" &&
            b.status !== "follow-each-other"
          ) {
            return -1;
          }
          if (
            a.status !== "follow-each-other" &&
            b.status === "follow-each-other"
          ) {
            return 1;
          }
          return 0;
        });
        const extractedUsers = sortedUsers.map((item: any) => item.user);
        setUsers(extractedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Filter out selected users from the list of available users
  const availableUsers = users.filter(
    (user) =>
      !selectedUsers.some((selectedUser) => selectedUser._id === user._id),
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{title}</Button>
      </DialogTrigger>
      <DialogContent className=" bg-evento-gradient text-white w-[95%] rounded-lg border-none">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col-reverse justify-between gap-4 ">
          <div className="">
            <h3 className="mb-2">
              All Users {"( "} {availableUsers.length}
              {" )"}
            </h3>
            <ScrollArea className="h-48 border rounded">
              {Array.isArray(availableUsers) && availableUsers.length > 0 ? (
                availableUsers.map((user) => (
                  <div
                    key={user._id}
                    className="p-2 flex items-center cursor-pointer hover:bg-muted/20 space-x-4"
                    onClick={() => onAddUser(user)}
                  >
                    {user.profileImage &&
                    user.profileImage.startsWith(
                      "https://evento-media-bucket.s3.ap-southeast-2.amazonaws.com",
                    ) ? (
                      <Image
                        src={user.profileImage}
                        alt="user image"
                        width={50}
                        height={50}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <Avatar className="w-12 h-12 rounded-full">
                        <AvatarImage
                          className="w-12 h-12 rounded-full"
                          src="https://github.com/shadcn.png"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm md:text-base">
                        {user.name}
                      </span>
                      <span className="text-xs text-white">
                        {user.lastName} {user.firstName}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-2 text-muted">No users available</div>
              )}
            </ScrollArea>
          </div>
          <div className="">
            <h3 className="mb-2">
              Selected {"( "}
              {selectedUsers.length}
              {" )"}
            </h3>
            <ScrollArea className="h-48 border rounded">
              {selectedUsers.map((user) => (
                <div
                  key={user._id}
                  className="p-2 flex items-center cursor-pointer hover:bg-muted/20 space-x-4"
                  onClick={() => onRemoveUser(user)}
                >
                  {user.profileImage &&
                  user.profileImage.startsWith(
                    "https://evento-media-bucket.s3.ap-southeast-2.amazonaws.com",
                  ) ? (
                    <Image
                      src={user.profileImage}
                      alt="user image"
                      width={50}
                      height={50}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <Avatar className="w-12 h-12 rounded-full">
                      <AvatarImage
                        className="w-12 h-12 rounded-full"
                        src="https://github.com/shadcn.png"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm md:text-base">
                      {user.name}
                    </span>
                    <span className="text-xs text-white">
                      {user.lastName} {user.firstName}
                    </span>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            className="bg-evento-gradient-button border shadow"
            onClick={() => onSave(selectedUsers.map((user) => user._id))}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
