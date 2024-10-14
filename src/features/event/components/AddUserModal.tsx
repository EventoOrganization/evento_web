import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"; // Import Input component for filtering
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { UserType } from "@/types/UserType";
import Image from "next/image";
import { useEffect, useState } from "react";

interface AddUserModalProps {
  title: string;
  allUsers: UserType[];
  selectedUsers: { userId: string; status: string }[] | string;
  onSave: (selectedUsers: { userId: string; status: string }[]) => void;
}

const AddUserModal = ({
  allUsers,
  title,
  selectedUsers,
  onSave,
}: AddUserModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSelectedUsers, setCurrentSelectedUsers] = useState<
    { user: UserType; status: string }[]
  >([]);
  const [filter, setFilter] = useState<string>(""); // New state for filtering users

  useEffect(() => {
    if (Array.isArray(selectedUsers)) {
      const initialSelectedUsers = allUsers
        .filter((user) => selectedUsers.some((s) => s.userId === user._id))
        .map((user) => ({
          user,
          status:
            selectedUsers.find((s) => s.userId === user._id)?.status ||
            "read-only",
        }));
      setCurrentSelectedUsers(initialSelectedUsers);
    } else {
      setCurrentSelectedUsers([]);
    }
  }, [selectedUsers, allUsers]);

  // Function to handle changes in the input field and update the filter
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value.toLowerCase());
  };

  // Filter available users based on the filter input (username, firstName, or lastName)
  const availableUsers = allUsers
    .filter(
      (user) =>
        !currentSelectedUsers.some(
          (selectedUser) => selectedUser.user._id === user._id,
        ),
    )
    .filter(
      (user) =>
        user?.username.toLowerCase().includes(filter) ||
        user?.firstName?.toLowerCase().includes(filter) ||
        user?.lastName?.toLowerCase().includes(filter),
    );

  const addUser = (user: UserType) => {
    setCurrentSelectedUsers([
      ...currentSelectedUsers,
      { user, status: "read-only" },
    ]);
  };

  const isValidUrl = (url: string) => {
    return url.startsWith("http://") || url.startsWith("https://");
  };

  const removeUser = (user: UserType) => {
    setCurrentSelectedUsers(
      currentSelectedUsers.filter(
        (selectedUser) => selectedUser.user._id !== user._id,
      ),
    );
  };

  const handleStatusChange = (userId: string, newStatus: string) => {
    setCurrentSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.map((selectedUser) =>
        selectedUser.user._id === userId
          ? { ...selectedUser, status: newStatus }
          : selectedUser,
      ),
    );
  };

  const handleSave = () => {
    onSave(
      currentSelectedUsers.map(({ user, status }) => ({
        userId: user._id,
        status,
      })),
    );
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          type="button"
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
      <DialogContent className="bg-background w-[95%] rounded-lg border-none">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {/* Input for filtering users */}
        <Input
          type="text"
          placeholder="Search by username, first name, or last name"
          value={filter}
          onChange={handleFilterChange}
          className="mb-4"
        />

        <div className="flex flex-col-reverse justify-between gap-4">
          <div>
            <h3 className="mb-2">
              All Users {"("}
              {availableUsers.length}
              {")"}
            </h3>
            <ScrollArea className="h-48 border rounded">
              {availableUsers.length > 0 ? (
                availableUsers.map((user) => (
                  <div
                    key={user._id}
                    className="p-2 flex items-center cursor-pointer hover:bg-muted/20 space-x-4"
                    onClick={() => addUser(user)}
                  >
                    {user.profileImage && isValidUrl(user?.profileImage) ? (
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
                        {user.username}
                      </span>
                      <span className="text-xs">
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

          <div>
            <h3 className="mb-2">
              Selected {"("}
              {currentSelectedUsers.length}
              {")"}
            </h3>
            <ScrollArea className="h-48 border rounded">
              {currentSelectedUsers.map(({ user, status }) => (
                <div
                  key={user._id}
                  className="p-2 flex items-center justify-between cursor-pointer hover:bg-muted/20 space-x-4"
                >
                  <div className="flex items-center space-x-4">
                    {user.profileImage && isValidUrl(user?.profileImage) ? (
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
                        {user.username}
                      </span>
                      <span className="text-xs">
                        {user.lastName} {user.firstName}
                      </span>
                    </div>
                  </div>

                  {/* Dropdown for selecting the role */}
                  <select
                    value={status}
                    onChange={(e) =>
                      handleStatusChange(user._id, e.target.value)
                    }
                    className="border rounded p-1"
                  >
                    <option value="read-only">Read-only</option>
                    <option value="admin">Admin</option>
                  </select>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeUser(user)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <Button
            type="button"
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
