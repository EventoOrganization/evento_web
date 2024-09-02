import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import { useEffect, useState } from "react";
import GuestsAllowFriendCheckbox from "./GuestsAllowFriendCheckbox";

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
  allUsers: User[];
  selectedUsers: string[]; // Array of user IDs
  onSave: (selectedUsers: string[]) => void;
  storeField: "guests" | "coHosts"; // Specify which field to update in the store
}

const AddUserModal = ({
  allUsers,
  title,
  selectedUsers,
  onSave,
  storeField,
}: AddUserModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSelectedUsers, setCurrentSelectedUsers] = useState<User[]>([]);

  useEffect(() => {
    // console.log("Selected Users:", selectedUsers);
    // console.log("All Users:", allUsers);

    const initialSelectedUsers = allUsers.filter((user) =>
      selectedUsers.includes(user._id),
    );

    // console.log("Initial Selected Users:", initialSelectedUsers);

    setCurrentSelectedUsers(initialSelectedUsers);
  }, [selectedUsers, allUsers]);

  const availableUsers = allUsers.filter(
    (user) =>
      !currentSelectedUsers.some(
        (selectedUser) => selectedUser._id === user._id,
      ),
  );

  const addUser = (user: User) => {
    setCurrentSelectedUsers([...currentSelectedUsers, user]);
  };

  const removeUser = (user: User) => {
    setCurrentSelectedUsers(
      currentSelectedUsers.filter(
        (selectedUser) => selectedUser._id !== user._id,
      ),
    );
  };

  const handleSave = () => {
    onSave(currentSelectedUsers.map((user) => user._id));
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn({
            "bg-evento-gradient text-white": currentSelectedUsers.length > 0,
          })}
        >
          {title}
          {currentSelectedUsers.length > 0
            ? ` (${currentSelectedUsers.length})`
            : ""}
        </Button>
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
              {availableUsers.length > 0 ? (
                availableUsers.map((user) => (
                  <div
                    key={user._id}
                    className="p-2 flex items-center cursor-pointer hover:bg-muted/20 space-x-4"
                    onClick={() => addUser(user)}
                  >
                    {user.profileImage ? (
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
              {currentSelectedUsers.length}
              {" )"}
            </h3>
            <ScrollArea className="h-48 border rounded">
              {currentSelectedUsers.map((user) => (
                <div
                  key={user._id}
                  className="p-2 flex items-center cursor-pointer hover:bg-muted/20 space-x-4"
                  onClick={() => removeUser(user)}
                >
                  {user.profileImage ? (
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
        <div className="mt-4 flex items-center justify-between">
          {storeField === "guests" && <GuestsAllowFriendCheckbox />}
          <Button
            className="bg-evento-gradient-button border shadow mt-2"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
