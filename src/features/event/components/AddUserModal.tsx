import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { UserType } from "@/types/UserType";
import { sortUsersByPriority } from "@/utils/sortUsersByPriority";
import { Plus, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface AddUserModalProps {
  title: string;
  allUsers: UserType[] | [];
  selectedUsers: any[];
  onSave: (selectedUsers: any[]) => void;
}

const AddUserModal = ({
  allUsers,
  title,
  selectedUsers,
  onSave,
}: AddUserModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSelectedUsers, setCurrentSelectedUsers] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    setCurrentSelectedUsers(selectedUsers);
  }, [selectedUsers]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value.toLowerCase());
  };

  const availableUsers = sortUsersByPriority(
    allUsers
      .filter(
        (user) =>
          !currentSelectedUsers.some(
            (selected) => selected.userId._id === user._id,
          ),
      )
      .filter(
        (user) =>
          user?.username.toLowerCase().includes(filter) ||
          user?.firstName?.toLowerCase().includes(filter) ||
          user?.lastName?.toLowerCase().includes(filter),
      ),
  );

  const addUser = (user: UserType) => {
    setCurrentSelectedUsers([
      ...currentSelectedUsers,
      { userId: user, status: "read-only" },
    ]);
  };

  const removeUser = (userId: string) => {
    console.log("Removing user with ID:", userId);

    setCurrentSelectedUsers((prevSelectedUsers) => {
      const updatedUsers = prevSelectedUsers.filter((selected) => {
        const selectedUserId =
          typeof selected.userId === "string"
            ? selected.userId
            : selected.userId._id;
        return selectedUserId !== userId;
      });
      console.log("Updated selected users:", updatedUsers);
      return updatedUsers;
    });
  };

  const handleStatusChange = (userId: string, newStatus: string) => {
    setCurrentSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.map((selected) =>
        selected.userId._id === userId
          ? { ...selected, status: newStatus }
          : selected,
      ),
    );
  };

  const handleSave = () => {
    onSave(currentSelectedUsers);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={cn("bg-gray-200 px-3")}>
          <Plus className="w-4 h-4" strokeWidth={2.5} />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background w-[95%] rounded-lg border-none">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Input
          type="text"
          placeholder="Search users"
          value={filter}
          onChange={handleFilterChange}
          className="mb-4"
        />

        <div className="flex flex-col gap-4">
          {/* Liste des utilisateurs disponibles */}
          <div>
            <h4 className="mb-2">Select Co-Host </h4>
            <ScrollArea className="h-48 border rounded">
              {availableUsers.length > 0 ? (
                availableUsers.map((user) => (
                  <div
                    key={user._id}
                    className="p-2 flex items-center cursor-pointer hover:bg-muted/20"
                    onClick={() => addUser(user)}
                  >
                    <Image
                      src={user.profileImage || "/icon-384x384.png"}
                      alt={user.username}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="ml-4">
                      <p>{user.username}</p>
                      <p className="text-xs">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-2 text-muted">No users found</p>
              )}
            </ScrollArea>
          </div>

          {/* Liste des utilisateurs sélectionnés */}
          <div>
            <h4 className="mb-2">Selected ({currentSelectedUsers.length})</h4>
            <ScrollArea className="h-48 border rounded">
              {currentSelectedUsers.map(({ userId, status }) => (
                <div
                  key={userId._id}
                  className="p-2 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <Image
                      src={userId.profileImage || "/icon-384x384.png"}
                      alt={userId.username}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="truncate whitespace-nowrap ">
                        {userId.username}
                      </p>
                      <p className="text-xs hidden md:block">
                        {" "}
                        {userId.firstName} {userId.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={status}
                      onChange={(e) =>
                        handleStatusChange(userId._id, e.target.value)
                      }
                      className="border rounded p-1"
                    >
                      <option value="read-only">Read-only</option>
                      <option value="admin">Admin</option>
                    </select>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeUser(userId._id)}
                    >
                      <Trash className="w-4 h-4" strokeWidth={2.5} />
                      <span className="hidden md:inline">Remove</span>
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
        <Button className="bg-evento-gradient mt-4" onClick={handleSave}>
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
