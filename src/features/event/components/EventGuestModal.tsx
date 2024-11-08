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
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/store/useGlobalStore";
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
  onSave,
  event,
}: {
  onSave?: () => void;
  event?: EventType;
}) => {
  const { id: eventId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  4;
  const { users: allUsers } = useGlobalStore((state) => ({
    users: state.users as UserType[],
  }));
  const [currentSelectedUsers, setCurrentSelectedUsers] = useState<
    SelectedUser[]
  >([]);
  const { toast } = useToast();
  const { user, token } = useSession();
  const [filter, setFilter] = useState<string>("");

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
      .map((user) => ({
        id: user._id,
        email: user.email.toLowerCase(),
        username: user.username,
      }));

    const tempGuests = currentSelectedUsers
      .filter((user) => !user._id)
      .map((tempGuest) => ({
        email: tempGuest.email.toLowerCase(),
        username: tempGuest.username,
      }));
    const updateData = {
      guests,
      tempGuests,
      user,
    };
    try {
      const response = await fetchData(
        `/events/addGuests/${eventId}`,
        HttpMethod.PATCH,
        updateData,
        token,
      );

      if (response.ok) {
        toast({
          description: "Guests and preference updated successfully!",
          className: "bg-evento-gradient text-white",
          duration: 3000,
        });
        setCurrentSelectedUsers([]);
      } else {
        console.error("Error updating guests and preference", response.error);
        toast({
          description: "Error updating guests and preference",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error submitting guests:", error);
      toast({
        description: "Error submitting guests please contact the support",
        variant: "destructive",
        duration: 3000,
      });
    }

    setIsOpen(false);
    if (onSave) onSave();
  };

  const [excludedUserIds, setExcludedUserIds] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    if (event) {
      const attendeeIds = event?.attendees
        ? event.attendees.map((a) => a._id)
        : [];
      const favouriteIds = event?.favouritees
        ? event.favouritees.map((f) => f._id)
        : [];
      const refusedIds = event?.refused ? event.refused.map((r) => r._id) : [];
      const requestedIds = event?.requested
        ? event.requested.map((r) => r._id)
        : [];
      const coHostIds = event?.coHosts ? event.coHosts.map((c) => c._id) : [];
      const guestIds = event?.guests ? event.guests.map((g) => g._id) : [];

      const allExcludedIds = new Set([
        ...attendeeIds,
        ...favouriteIds,
        ...refusedIds,
        ...requestedIds,
        ...coHostIds,
        ...guestIds,
      ]);

      if (user) {
        allExcludedIds.add(user._id);
      }

      setExcludedUserIds(allExcludedIds);

      // console.log("attendeeIds", attendeeIds);
      // console.log("favouriteIds", favouriteIds);
      // console.log("refusedIds", refusedIds);
      // console.log("requestedIds", requestedIds);
      // console.log("coHostIds", coHostIds);
      // console.log("guestIds", guestIds);
      // console.log("allExcludedIds", Array.from(allExcludedIds));
    }
  }, [event, user]);

  const filteredUsers = (allUsers ?? []).filter(
    (user) =>
      !excludedUserIds.has(user._id) &&
      !currentSelectedUsers.some((selected) => selected._id === user._id) &&
      !event?.guests?.some((guest) => guest._id === user._id) &&
      user.username &&
      user.username.toLowerCase() !== "anonymous" &&
      ((user.username && user.username.toLowerCase().includes(filter)) ||
        (user.firstName && user.firstName.toLowerCase().includes(filter)) ||
        (user.lastName && user.lastName.toLowerCase().includes(filter))),
  );

  // console.log("filteredUsers", filteredUsers);

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
              All Users {"("}
              {filteredUsers.length}
              {")"}
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
              Selected {"("}
              {currentSelectedUsers.length}
              {")"}
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
