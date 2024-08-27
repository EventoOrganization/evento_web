import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import { useState } from "react";

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
  selectedUsers: User[];
  onSave: (selectedUsers: string[]) => void;
  onAddUser: (user: User) => void;
  onRemoveUser: (user: User) => void;
}

const AddUserModal = ({
  allUsers,
  title,
  selectedUsers,
  onSave,
  onAddUser,
  onRemoveUser,
}: AddUserModalProps) => {
  const users = allUsers;
  const [isOpen, setIsOpen] = useState(false);
  console.log(allUsers, selectedUsers);
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
