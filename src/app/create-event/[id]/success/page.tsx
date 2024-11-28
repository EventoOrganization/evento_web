"use client";
import CollapsibleList from "@/components/CollapsibleList";
import Section from "@/components/layout/Section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/togglerbtn";
import { useSession } from "@/contexts/SessionProvider";
import CSVImport from "@/features/event/components/CSVImport";
import EventAddTempGuest from "@/features/event/components/EventAddTempGuest";
import { useToast } from "@/hooks/use-toast";
import { useGlobalStore } from "@/store/useGlobalStore";
import { EventType } from "@/types/EventType";
import { TempUserType, UserType } from "@/types/UserType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { InfoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
type SelectedUser = UserType | TempUserType;

const EventSuccessPage = () => {
  const { id } = useParams();
  const eventId = Array.isArray(id) ? id[0] : id;
  const { users } = useGlobalStore((state) => state);
  const [isGuestAllowed, setIsGuestAllowed] = useState<boolean | null>(null);
  const { user, token } = useSession();
  const [showTooltip, setShowTooltip] = useState(false);

  const { toast } = useToast();
  const [currentSelectedUsers, setCurrentSelectedUsers] = useState<
    SelectedUser[]
  >([]);
  const [filter, setFilter] = useState<string>("");
  const [event, setEvent] = useState<EventType | null>(null);
  const attendeeIds = event?.attendees
    ? event?.attendees?.map((a) => a?._id) || ""
    : [];
  const favouriteIds = event?.favouritees
    ? event.favouritees.map((f) => f?._id || "")
    : [];
  const excludedUserIds = [...attendeeIds, ...favouriteIds];
  const [isRestricted, setIsRestricted] = useState(false);
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const userQuery = user ? `?userId=${user._id}` : "";
        const response = await fetchData<EventType>(
          `/events/getEvent/${eventId}${userQuery}`,
          HttpMethod.GET,
          null,
          token,
        );
        if (response.ok) {
          setEvent(response.data as EventType);
          setIsGuestAllowed(response.data?.guestsAllowFriend || false);
          setIsRestricted(response.data?.restricted || false);
        } else {
          toast({ description: "Event not found", variant: "destructive" });
        }
      } catch {
        toast({ description: "Error fetching event", variant: "destructive" });
      }
    };
    fetchEventData();
  }, [eventId, token, toast]);
  // Fonction pour activer ou désactiver l'option "Permettre aux invités d'amener des amis"
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
  const handleRestricted = async () => {
    try {
      const response = await fetchData(
        `/events/updateEvent/${eventId}`,
        HttpMethod.PATCH,
        { field: "restricted", value: !isRestricted },
        token,
      );
      if (response.ok) {
        setIsRestricted(!isRestricted);
        toast({
          description: `Event ${!isRestricted ? "unrestricted" : "restricted"} successfully!`,
          className: "bg-evento-gradient text-white",
          duration: 3000,
        });
      }
      if (response.error) {
        console.error("Error updating event:", response.error);
        toast({
          description: response.error,
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        description: "Error updating event",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  // Ajout des invités à la liste des utilisateurs sélectionnés
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
    const newGuests = currentSelectedUsers.filter(
      (user): user is UserType => !!user._id,
    );
    const newTempGuests = currentSelectedUsers.filter(
      (user): user is TempUserType => !user._id,
    );

    const updateData = {
      guests: newGuests.map((user) => ({
        _id: user._id,
        email: user.email.toLowerCase(),
        username: user.username,
        profileImage: user.profileImage,
      })),
      tempGuests: newTempGuests.map((tempGuest) => ({
        email: tempGuest.email.toLowerCase(),
        username: tempGuest.username,
      })),
      user,
    };

    try {
      // Appel à l'API pour ajouter les invités
      const response = await fetchData<EventType>(
        `/events/addGuests/${eventId}`,
        HttpMethod.PATCH,
        updateData,
        token,
      );
      if (response.ok) {
        const updatedEvent = response.data?.event;
        setEvent({
          ...event!,
          guests: updatedEvent?.guests,
          tempGuests: updatedEvent?.tempGuests,
        });
        toast({
          description: "Guests updated successfully!",
          className: "bg-evento-gradient text-white",
          duration: 3000,
        });

        setCurrentSelectedUsers([]);
      } else {
        console.error("Error updating guests", response.error);
        toast({
          description: "Error updating guests",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error submitting guests:", error);
      toast({
        description: "Error submitting guests",
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
      !event?.coHosts?.some((coHost) => coHost.userId === user._id) &&
      user.username !== "anonymous" &&
      (user.username.toLowerCase().includes(filter) ||
        user.firstName?.toLowerCase().includes(filter) ||
        user.lastName?.toLowerCase().includes(filter)),
  );
  const handleSend = async () => {
    const env = process.env.VERCEL_ENV;
    const baseUrl =
      env === "production"
        ? "https://www.evento-app.io" // URL de production
        : env === "preview"
          ? `https://${process.env.VERCEL_URL}` // URL du déploiement actuel
          : "http://localhost:3000"; // URL pour le développement local

    const eventUrl = `${baseUrl}/event/${event?._id}`;

    const shareApiSupported = true; // to check if the share api is supported

    if (shareApiSupported && navigator.share) {
      try {
        await navigator.share({
          title: "Check out this event",
          text: "Check out this event I found!",
          url: eventUrl,
        });
        console.log("Successful share");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else if (navigator.clipboard) {
      // Utiliser le presse-papier si le partage n'est pas supporté
      try {
        await navigator.clipboard.writeText(eventUrl);
        toast({
          title: "Link copied to clipboard!",
          description: "The event link has been copied. You can share it now.",
          className: "bg-evento-gradient text-white",
          duration: 3000,
        });
      } catch (error) {
        console.error("Failed to copy link:", error);
        toast({
          title: "Failed to copy",
          description: "Unable to copy the link to the clipboard.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } else {
      console.log("Clipboard API is not supported in this browser.");
      toast({
        title: "Sharing not supported",
        description: "Your browser does not support sharing or copying links.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  if (!event) {
    return <div>Loading...</div>;
  }

  console.log("event", event);
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
          <div className="flex items-center justify-between w-full">
            <h1 className="text-xl font-bold">{event?.title}</h1>
            <Link
              href={`/event/${event?._id}`}
              className="underline text-blue-500"
            >
              See your event!
            </Link>
          </div>
          <div className="flex gap-2 justify-between  w-full">
            {event?.eventType === "private" && (
              <>
                <button
                  onClick={handleSend}
                  className="text-blue-500 underline"
                >
                  Share link
                </button>
                <div className="flex gap-2 items-center">
                  <InfoIcon
                    className="w-4 text-gray-500 cursor-pointer"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  />
                  {showTooltip && (
                    <span className="absolute bg-gray-800 text-white text-xs rounded py-1 px-2 -mt-10 ml-4 z-10">
                      When <b>Restricted</b> is enabled, users accessing the
                      event through the link will need to send a request to the
                      host to join, unless they are explicitly invited.
                    </span>
                  )}
                  <p className="text-sm text-muted-foreground">Restricted</p>
                  <Switch
                    checked={isRestricted}
                    onCheckedChange={handleRestricted}
                  />
                </div>
              </>
            )}
          </div>
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
                        src="/icon-384x384.png"
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
          <EventAddTempGuest onAddTempGuest={handleAddTempGuest} />
          <CSVImport onAddTempGuests={handleAddTempGuestsFromCSV} />
        </Section>

        <Section className="justify-start">
          <div className="space-y-4 pb-20 w-full">
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
            <h3 className="flex justify-between items-center text-eventoPurpleLight font-bold p-2 rounded-md w-fit text-base">
              Selected ({currentSelectedUsers.length})
            </h3>
            <ScrollArea className="h-fit border rounded bg-white w-full">
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
                          src="/icon-384x384.png"
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
            {currentSelectedUsers.length > 0 && (
              <Button
                type="button"
                className="bg-evento-gradient border shadow mt-2 w-full"
                onClick={handleSubmitGuests}
              >
                Send invitation
              </Button>
            )}
            <CollapsibleList
              title="Invited"
              count={combinedGuests.length}
              users={combinedGuests}
              event={event}
              setEvent={setEvent}
            />
          </div>
        </Section>
      </div>
    </>
  );
};

export default EventSuccessPage;
