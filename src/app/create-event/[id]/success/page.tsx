"use client";
import CollapsibleList from "@/components/CollapsibleList";
import Section from "@/components/layout/Section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "@/contexts/SessionProvider";
import CSVImport from "@/features/event/components/CSVImport";
import EventAddTempGuest from "@/features/event/components/EventAddTempGuest";
import { useToast } from "@/hooks/use-toast";
import { useGlobalStore } from "@/store/useGlobalStore";
import { TempUserType, UserType } from "@/types/UserType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

type SelectedUser = UserType | TempUserType;

const EventSuccessPage = () => {
  const { id } = useParams();
  const eventId = Array.isArray(id) ? id[0] : id;
  const { userInfo, users } = useGlobalStore((state) => state);
  const [isGuestAllowed, setIsGuestAllowed] = useState<boolean | null>(null);
  const { user, token } = useSession();
  const { toast } = useToast();
  const [currentSelectedUsers, setCurrentSelectedUsers] = useState<
    SelectedUser[]
  >([]);
  const [filter, setFilter] = useState<string>("");
  const event = userInfo?.hostedEvents?.find((ev) => ev._id === id);
  const attendeeIds = event?.attendees
    ? event?.attendees?.map((a) => a?._id) || ""
    : [];
  const favouriteIds = event?.favouritees
    ? event.favouritees.map((f) => f?._id || "")
    : [];

  const excludedUserIds = [...attendeeIds, ...favouriteIds];

  // Handle change for allowing guests to bring friends
  const handleGuestsAllowFriendChange = async () => {
    try {
      const response = await fetchData(
        `/events/${eventId}/updateGuestsAllowFriend`,
        HttpMethod.PUT,
        { guestsAllowFriend: !isGuestAllowed },
        token,
      );
      if (response.ok) {
        setIsGuestAllowed(!isGuestAllowed);
        toast({
          description: `Guests ${!isGuestAllowed ? "allowed" : "denied"} successfully!`,
          className: "bg-evento-gradient text-white",
          duration: 3000,
        });
      } else {
        console.error("Error updating guestsAllowFriend:", response.error);
        toast({
          description: "Error updating guestsAllowFriend",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating guestsAllowFriend:", error);
      toast({
        description: "Error updating guestsAllowFriend",
        variant: "destructive",
        duration: 3000,
      });
    }
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
        email: user.email,
        username: user.username,
      }));

    const tempGuests = currentSelectedUsers
      .filter((user) => !user._id)
      .map((tempGuest) => ({
        email: tempGuest.email,
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
        description: "Error submitting guests, please contact the support",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const combinedGuests = [
    ...(event?.guests?.map((guest) => ({ ...guest, status: "guest" })) || []),
    ...(event?.tempGuests?.map((tempGuest) => ({
      ...tempGuest,
      status: "tempGuest",
    })) || []),
  ];

  const filteredUsers = users.filter(
    (user) =>
      !excludedUserIds.includes(user._id) &&
      !currentSelectedUsers.some((selected) => selected._id === user._id) &&
      !event?.guests?.some((guest) => guest._id === user._id) &&
      (user.username.toLowerCase().includes(filter) ||
        user.firstName?.toLowerCase().includes(filter) ||
        user.lastName?.toLowerCase().includes(filter)),
  );

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Section className="text-center h-full">
        <h1 className="text-3xl font-bold text-eventoPurpleLight h-full">
          Congratulations on creating your event!
        </h1>
        <p className="text-xl">Next step, invite your guests</p>
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section className="justify-start gap-2 items-start">
          <h2>Add your guests on Evento</h2>
          <Input
            type="text"
            placeholder="Search by username, first name, or last name"
            value={filter}
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
            className="mb-4"
          />
          <ScrollArea className="h-48 border rounded bg-white w-full">
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
              <div className="p-2 opacity-80">No users available</div>
            )}
          </ScrollArea>
          <h3 className="mt-4">Selected ({currentSelectedUsers.length})</h3>
          <ScrollArea className="h-48 border rounded bg-white w-full">
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

          <EventAddTempGuest onAddTempGuest={handleAddTempGuest} />
          <CSVImport onAddTempGuests={handleAddTempGuestsFromCSV} />
          <Button
            type="button"
            className="bg-evento-gradient border shadow mt-2 w-full"
            onClick={handleSubmitGuests} // Call the submission handler here
          >
            Save
          </Button>
        </Section>

        <Section className="justify-start">
          <div className="space-y-4 pb-20 w-full">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">{event?.title}</h1>
              <Link
                href={`/event/${event?._id}`}
                className="underline text-blue-500"
              >
                {" "}
                See your event!
              </Link>
            </div>
            {event.isHosted && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="guestsAllowFriend"
                  onChange={handleGuestsAllowFriendChange}
                  checked={isGuestAllowed ?? false}
                />
                <label htmlFor="guestsAllowFriend">
                  Allow guests to bring friends
                </label>
              </div>
            )}
            <CollapsibleList
              title="Going"
              count={event?.attendees?.length || 0}
              users={event?.attendees || []}
            />
            <CollapsibleList
              title="Saved"
              count={event?.favouritees?.length || 0}
              users={event?.favouritees || []}
            />
            {combinedGuests.length > 0 && (
              <CollapsibleList
                title="Guests"
                count={combinedGuests.length}
                users={combinedGuests}
              />
            )}
          </div>
        </Section>
      </div>
    </>
  );
};

export default EventSuccessPage;
