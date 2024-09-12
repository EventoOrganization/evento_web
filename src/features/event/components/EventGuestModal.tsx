import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useSession } from "@/contexts/SessionProvider";
import { cn } from "@/lib/utils";
import { EventType } from "@/types/EventType";
import { TempUserType, UserType } from "@/types/UserType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CSVImport from "./CSVImport";
import EventAddTempGuest from "./EventAddTempGuest";
type SelectedUser = UserType | TempUserType;
const EventGuestModal = ({
  allUsers,
  onSave,
  event,
}: {
  allUsers: UserType[];
  onSave?: () => void;
  event?: EventType;
}) => {
  const { id: eventId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [currentSelectedUsers, setCurrentSelectedUsers] = useState<
    SelectedUser[]
  >([]);

  const { user } = useSession();
  const [filter, setFilter] = useState<string>("");
  const attendeeIds = event?.attendees?.map((a) => a._id) || [];
  const favouriteIds = event?.favouritees?.map((f) => f._id) || [];
  const excludedUserIds = [...attendeeIds, ...favouriteIds];
  useEffect(() => {
    if (user) {
      excludedUserIds.push(user._id);
    }
  }, [user, attendeeIds, favouriteIds]);
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value.toLowerCase());
  };

  const addUser = (user: TempUserType) => {
    setCurrentSelectedUsers((prevUsers) => [...prevUsers, user]);
  };
  const handleAddTempGuest = (tempGuest: UserType) => {
    setCurrentSelectedUsers([...currentSelectedUsers, tempGuest]);
  };
  const handleAddTempGuestsFromCSV = (tempGuests: TempUserType[]) => {
    setCurrentSelectedUsers((prevUsers) => [...prevUsers, ...tempGuests]);
  };
  const removeUser = (user: any) => {
    setCurrentSelectedUsers(
      currentSelectedUsers.filter(
        (selectedUser) =>
          selectedUser.username + selectedUser.email !==
          user.username + user.email,
      ),
    );
  };

  const handleSubmitGuests = async () => {
    const guests = currentSelectedUsers
      .filter((user) => !!user._id)
      .map((user) => user._id);

    const tempGuests = currentSelectedUsers
      .filter((user) => !user._id)
      .map((tempGuest) => ({
        email: tempGuest.email,
        username: tempGuest.username,
      }));
    const updateData = {
      guests,
      tempGuests,
      invitedBy: user?._id,
    };
    console.log("Data to be sent to the backend:", updateData);
    try {
      const response = await fetchData(
        `/events/addGuests/${eventId}`,
        HttpMethod.PATCH,
        updateData,
      );

      if (response.ok) {
        console.log("Guests and preference updated successfully!");
      } else {
        console.error("Error updating guests and preference", response.error);
      }
    } catch (error) {
      console.error("Error submitting guests:", error);
    }

    setIsOpen(false);
    if (onSave) onSave();
  };

  const filteredUsers = allUsers.filter(
    (user) =>
      !excludedUserIds.includes(user._id) &&
      !currentSelectedUsers.some((selected) => selected._id === user._id) &&
      (user.username.toLowerCase().includes(filter) ||
        user.firstName?.toLowerCase().includes(filter) ||
        user.lastName?.toLowerCase().includes(filter)),
  );
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          type="button"
          className={cn("bg-eventoBlue hover:bg-eventoBlue/80", {
            "bg-evento-gradient text-white": currentSelectedUsers.length > 0,
          })}
        >
          Add Guests
          {currentSelectedUsers.length > 0
            ? ` (${currentSelectedUsers.length})`
            : ""}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background w-[95%] rounded-lg border-none max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Guests</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col-reverse justify-between gap-4">
          <div>
            <h3 className="mb-2">
              All Users {"( "} {filteredUsers.length} {" )"}
            </h3>
            <ScrollArea className="h-48 border rounded">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user._id || user.username + user.email}
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
              Selected {"( "}
              {currentSelectedUsers.length} {" )"}
            </h3>
            <ScrollArea className="h-48 border rounded">
              {currentSelectedUsers.map((user) => (
                <div
                  key={user._id || user.username + user.email}
                  className="p-2 flex items-center justify-between cursor-pointer hover:bg-muted/20 space-x-4"
                >
                  <div className="flex items-center space-x-4">
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
                        {user.username}
                      </span>
                      <span className="text-xs">
                        {user.lastName} {user.firstName}
                      </span>
                    </div>
                  </div>

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
        <Input
          type="text"
          placeholder="Search by username, first name, or last name"
          value={filter}
          onChange={handleFilterChange}
          className="mb-4"
        />
        <EventAddTempGuest onAddTempGuest={handleAddTempGuest} />
        <CSVImport onAddTempGuests={handleAddTempGuestsFromCSV} />

        <div className="mt-4 flex items-center justify-between">
          <Button
            type="button"
            className="bg-evento-gradient-button border shadow mt-2"
            onClick={handleSubmitGuests} // Call the submission handler here
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventGuestModal;
