"use client";
import CollapsibleList from "@/components/CollapsibleList";
import EventoLoader from "@/components/EventoLoader";
import Section from "@/components/layout/Section";
import ShareModal from "@/components/ShareModal";
import SmartImage from "@/components/SmartImage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/togglerbtn";
import { useSession } from "@/contexts/SessionProvider";
import CSVImport from "@/features/event/components/CSVImport";
import EventAddTempGuest from "@/features/event/components/EventAddTempGuest";
import RestrictedToggle from "@/features/event/components/RestrictedToggle";
import { useToast } from "@/hooks/use-toast";
import { useUsersStore } from "@/store/useUsersStore";
import { EventType } from "@/types/EventType";
import { TempUserType, UserType } from "@/types/UserType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { cn } from "@nextui-org/theme";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
type SelectedUser = UserType | TempUserType;

const EventSuccessPage = () => {
  // const { id } = useParams();
  // const eventId = Array.isArray(id) ? id[0] : id;
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");
  const { users } = useUsersStore();
  const [isGuestAllowed, setIsGuestAllowed] = useState<boolean | null>(null);
  const { user, token } = useSession();

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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        setEvent(response.data as EventType);
        setIsGuestAllowed(response.data?.guestsAllowFriend || false);
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
    setIsSubmitting(true);
    const newGuests = currentSelectedUsers.filter(
      (user): user is UserType => !!user._id,
    );
    const newTempGuests = currentSelectedUsers.filter(
      (user): user is TempUserType => !user._id,
    );
    console.log("newGuests", newGuests);
    console.log("newTempGuests", newTempGuests);
    const updateData = {
      guests: newGuests.map((user) => ({
        _id: user._id,
        email: user.email.toLowerCase(),
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
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
    } finally {
      setIsSubmitting(false);
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
      !event?.coHosts?.some((coHost) => coHost.userId?._id === user._id) &&
      user.username !== "anonymous" &&
      (user.username.toLowerCase().includes(filter) ||
        user.firstName?.toLowerCase().includes(filter) ||
        user.lastName?.toLowerCase().includes(filter)),
  );

  if (!event) {
    return (
      <Section className="h-screen">
        <EventoLoader />
      </Section>
    );
  }

  return (
    <>
      <Section className="px-4 xl:px-0 text-left h-full ">
        <h1 className="text-3xl font-bold w-full h-full">
          Congratulations
          <span className="md:hidden  ml-2">!</span>
          <span className="hidden md:inline ml-2">on creating your event!</span>
        </h1>
        <p className="text-xl w-full">Next step, invite your guests</p>
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section className="justify-start gap-2 pt-0 md:py-10 items-start pb-0">
          <div
            className={cn(
              "flex flex-col  justify-between gap-2 items-center w-full",
              {
                "flex-col": event?.eventType === "private",
                "md:flex-row": event?.eventType !== "private",
              },
            )}
          >
            <h4 className=" w-full block">
              Send your event link to your guests!
            </h4>

            <div
              className={cn("flex gap-2 justify-between w-full ", {
                "md:w-fit": event?.eventType !== "private",
              })}
            >
              {event?.eventType === "private" && (
                <RestrictedToggle event={event} />
              )}
              <ShareModal
                eventUrl={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/event/${event?._id}`}
              />
            </div>
          </div>
          <h4 className="pb-2 pt-4">Invite your guests on Evento</h4>{" "}
          <Input
            type="text"
            placeholder="Search by username, first name, or last name"
            value={filter}
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
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
                    <SmartImage
                      src={user.profileImage}
                      alt="user image"
                      width={50}
                      height={50}
                      className="w-12 h-12 rounded-full"
                      forceImg
                    />
                  ) : (
                    <Avatar className="w-12 h-12 rounded-full">
                      <AvatarImage
                        className="w-12 h-12 rounded-full"
                        src="/evento-logo.png"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm md:text-base">
                      {user.username}
                    </span>
                    <span className="text-xs">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-2 opacity-80">No users available</div>
            )}
          </ScrollArea>{" "}
          {event.isHosted && (
            <div className="flex items-center gap-2 pt-4">
              <Switch
                checked={isGuestAllowed ?? false}
                onCheckedChange={handleGuestsAllowFriendChange}
              />

              <label htmlFor="guestsAllowFriend">
                Allow guests to bring friends
              </label>
            </div>
          )}
          <EventAddTempGuest onAddTempGuest={handleAddTempGuest} />
          <CSVImport onAddTempGuests={handleAddTempGuestsFromCSV} />
        </Section>

        <Section className="justify-start pt-0">
          <div className="space-y-4 pb-20 w-full pt-4 md:pt-10  border-t-2 md:border-none">
            <h3 className="flex justify-between items-center font-bold rounded-md w-fit text-base">
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
                      <SmartImage
                        src={user.profileImage}
                        alt="user image"
                        width={50}
                        height={50}
                        className="w-12 h-12 rounded-full"
                        forceImg
                      />
                    ) : (
                      <Avatar className="w-12 h-12 rounded-full">
                        <AvatarImage
                          className="w-12 h-12 rounded-full"
                          src="/evento-logo.png"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm md:text-base">
                        {user.username}
                      </span>
                      <span className="text-xs">
                        {user.firstName} {user.lastName}
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
                disabled={isSubmitting}
                variant={"eventoPrimary"}
                className="mt-2 w-full"
                onClick={handleSubmitGuests}
              >
                {isSubmitting && <Loader2 className="mr-2 animate-spin" />} Send
                invitation
              </Button>
            )}
            <CollapsibleList
              title="Invited"
              count={combinedGuests.length}
              users={combinedGuests}
              event={event}
              setEvent={setEvent}
            />
            <Button variant={"eventoPrimary"} className="w-full">
              <Link
                href={`/event/${event._id}`}
                className=" w-full h-full flex justify-center items-center"
              >
                See your event
              </Link>
            </Button>
          </div>
        </Section>
      </div>
    </>
  );
};

export default EventSuccessPage;
