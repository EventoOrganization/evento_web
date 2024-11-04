"use client";
import AvatarStack from "@/components/AvatarStack";
import CollapsibleList from "@/components/CollapsibleList";
import MapPinIcon2 from "@/components/icons/MappPinIcon2";
import Section from "@/components/layout/Section";
import RenderMedia from "@/components/RenderMedia";
import RequestModal from "@/components/RequestModal";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import { useSession } from "@/contexts/SessionProvider";
import AuthModal from "@/features/auth/components/AuthModal";
import TabSelector from "@/features/discover/TabSelector";
import EventActionIcons from "@/features/event/components/EventActionIcons";
import EventEdit from "@/features/event/components/EventEdit";
import EventGuestModal from "@/features/event/components/EventGuestModal";
import EventTimeSlots from "@/features/event/components/EventTimeSlots";
import PastEventGallery from "@/features/event/components/PastEventGallery";
import RefusedUsersList from "@/features/event/components/RefusedUsersList";
import RSVPSubmissionsList from "@/features/event/components/RSVPSubmissionsList";
import { useToast } from "@/hooks/use-toast";
import { useGlobalStore } from "@/store/useGlobalStore";
import { EventType, InterestType } from "@/types/EventType";
import { renderDate } from "@/utils/dateUtils";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
export interface RSVPAndRefusedResponse {
  _id: string;
  rsvpSubmissions: Array<{
    userId: string;
    rsvpAnswers: Array<{ questionId: string; answer: string[]; _id: string }>;
  }>;
  refusedStatuses: Array<{
    userId: string;
    reason: string;
    _id: string;
  }>;
}

const EventPage = () => {
  const searchParams = useSearchParams();
  const { id } = useParams();
  const eventId = Array.isArray(id) ? id[0] : id;
  const [event, setEvent] = useState<EventType | null>(null);
  const [selectedTab, setSelectedTab] = useState("Description");
  const [filteredGuests, setFilteredGuests] = useState<any[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const email = searchParams.get("email");
  const [rsvpSubmissions, setRSVPSubmissions] = useState<
    RSVPAndRefusedResponse["rsvpSubmissions"]
  >([]);
  const [refusedStatuses, setRefusedStatuses] = useState<
    RSVPAndRefusedResponse["refusedStatuses"]
  >([]);
  const { events, users } = useGlobalStore((state) => state);
  const [isGuestAllowed, setIsGuestAllowed] = useState<boolean | null>(null);
  const { token, user } = useSession();
  const { toast } = useToast();
  const currentDate = new Date();
  const eventEndDate = event?.details?.endDate
    ? new Date(event.details.endDate)
    : null;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const fetchEventById = async () => {
      try {
        const response = await fetchData(
          `/events/getEvent/${eventId}`,
          HttpMethod.GET,
          null,
          token,
        );
        if (response.ok) {
          setEvent(response.data as EventType);
          if (event?.details?.guestsAllowFriend !== undefined) {
            setIsGuestAllowed(event.details.guestsAllowFriend);
          }
        } else {
          toast({
            description: "Event not found",
            variant: "destructive",
            duration: 3000,
          });
        }
      } catch (error) {
        toast({
          description: "Error fetching event",
          variant: "destructive",
          duration: 3000,
        });
      }
    };

    // Fonction pour récupérer les soumissions RSVP et les refus
    const fetchRSVPAndRefusedInfo = async () => {
      try {
        const response = await fetchData<RSVPAndRefusedResponse>(
          `/events/getRSVPAndReasons/${eventId}`,
          HttpMethod.GET,
          null,
          token,
        );
        if (response.ok) {
          const data = response.data as RSVPAndRefusedResponse; // Assurez-vous que c'est bien typé
          setRSVPSubmissions(data.rsvpSubmissions || []); // Vérifiez la nullité
          setRefusedStatuses(data.refusedStatuses || []);
        } else {
          toast({
            description: "RSVP or refused info not found",
            variant: "destructive",
            duration: 3000,
          });
        }
      } catch (error) {
        toast({
          description: "Error fetching RSVP and refused info",
          variant: "destructive",
          duration: 3000,
        });
      }
    };
    if (!isMounted) {
      return;
    }
    // Essayer de trouver l'événement dans le store
    const storedEvent = events.find((ev) => ev._id === eventId);
    console.log("storedEvent", storedEvent);
    if (!storedEvent) {
      console.log("Stored event not found => fetching event");

      fetchEventById(); // Fetch si l'événement n'est pas dans le store
    } else {
      setEvent(storedEvent);
      console.log("stored event", storedEvent);
      setIsGuestAllowed(storedEvent.guestsAllowFriend || null);
      console.log("isEventPrivate", storedEvent.eventType);
    }

    // Toujours récupérer les infos RSVP et refusées
    fetchRSVPAndRefusedInfo();
  }, [eventId, events, token, toast, isMounted]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleUpdateField = (field: string, value: any) => {
    if (event) {
      const updatedEvent = {
        ...event,
        details: { ...event.details, mode: event.details?.mode || "virtual" },
      };
      switch (field) {
        case "title":
          updatedEvent.title = value;
          break;
        case "locationData":
          updatedEvent.details.location = value.location;
          break;
        case "description":
          updatedEvent.details.description = value;
          break;
        case "interests":
          if (Array.isArray(value)) {
            updatedEvent.interests = value;
          }
          break;
        case "type":
          if (value === "public" || value === "private") {
            updatedEvent.eventType = value;
          }
          break;
        case "mode":
          if (["virtual", "in-person", "both"].includes(value)) {
            updatedEvent.details.mode = value;
          }
          break;
        case "url":
          updatedEvent.details.URLlink = value || "";
          break;
        case "createRSVP":
          updatedEvent.details.createRSVP = value;
          break;
        case "questions":
          updatedEvent.questions = value.map((question: any) => ({
            id: question.id || new Date().getTime().toString(),
            question: question.question || "",
            type: question.type || "text",
            options: question.options || [],
            required: question.required || false,
          }));
          break;
        case "date":
          // Mise à jour des dates et des créneaux horaires
          updatedEvent.details.date = value.startDate;
          updatedEvent.details.endDate = value.endDate;
          updatedEvent.details.startTime = value.startTime;
          updatedEvent.details.endTime = value.endTime;
          if (Array.isArray(value.timeSlots)) {
            updatedEvent.details.timeSlots = value.timeSlots.map(
              (slot: any) => ({
                date: slot.date || "",
                startTime: slot.startTime || "08:00",
                endTime: slot.endTime || "18:00",
              }),
            );
          }

        default:
          console.warn("Unknown field", field);
      }

      setEvent(updatedEvent);
    }
  };

  const handleGuestsAllowFriendChange = async () => {
    try {
      const response = await fetchData(
        `/events/${event?._id}/updateGuestsAllowFriend`,
        HttpMethod.PUT,
        { guestsAllowFriend: !isGuestAllowed },
        token,
      );
      if (response.ok) {
        setIsGuestAllowed(!isGuestAllowed);
        toast({
          description: `Guests ${!isGuestAllowed ? "allowed" : "denied"} updated successfully!`,
          className: "bg-evento-gradient text-white",
          duration: 3000,
        });
      } else {
        toast({
          description: "Error updating guestsAllowFriend",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        description: "Error updating guestsAllowFriend",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const enrichUsersWithStoreData = (
    usersList: Array<any>,
    users: Array<any>,
    extraData: Record<string, any> = {},
  ) => {
    return usersList.map((user: any) => {
      const userFromStore = users.find(
        (storeUser: any) => storeUser._id === user._id,
      );
      if (userFromStore) {
        return {
          ...user,
          isIFollowingHim: userFromStore.isIFollowingHim,
          isFollowingMe: userFromStore.isFollowingMe,
          matchingInterests: userFromStore.matchingInterests,
          ...extraData[user._id],
        };
      }
      return user;
    });
  };
  const enrichedGuests = enrichUsersWithStoreData(event?.guests || [], users);
  const combinedGuests = useMemo(
    () => [
      ...(enrichedGuests.map((guest) => ({ ...guest, status: "guest" })) || []),
      ...(event?.tempGuests?.map((tempGuest) => ({
        ...tempGuest,
        status: "tempGuest",
      })) || []),
    ],
    [enrichedGuests, event?.tempGuests],
  );
  const enrichedAttendees = enrichUsersWithStoreData(
    event?.attendees || [],
    users,
    rsvpSubmissions.reduce(
      (acc, submission) => {
        acc[submission.userId] = { rsvpAnswers: submission.rsvpAnswers }; // Utilisation de l'indexation sur acc
        return acc;
      },
      {} as Record<string, any>,
    ), // Ajout du type Record<string, any> ici
  );

  const enrichedRefused = enrichUsersWithStoreData(
    event?.refused || [],
    users,
    refusedStatuses.reduce(
      (acc, refused) => {
        acc[refused.userId] = { refusedReason: refused.reason }; // Utilisation de l'indexation sur acc
        return acc;
      },
      {} as Record<string, any>,
    ), // Ajout du type Record<string, any> ici
  );
  const enrichedFavourites = enrichUsersWithStoreData(
    event?.favouritees || [],
    users,
  );
  const handleRequestToJoin = async () => {
    try {
      const response = await fetchData(
        `/events/${eventId}/requestToJoin`,
        HttpMethod.POST,
        { userId: user?._id },
        token,
      );
      if (response.ok) {
        toast({
          description: "Your request to join has been sent!",
          className: "bg-evento-gradient text-white",
          duration: 3000,
        });
      } else {
        toast({
          description: response.error,
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        description: "Error sending join request.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    const enrichedAttendeesIds = new Set(
      enrichedAttendees.map((user: any) => user._id),
    );
    const enrichedRefusedIds = new Set(
      enrichedRefused.map((user: any) => user._id),
    );
    const enrichedFavouritesIds = new Set(
      enrichedFavourites.map((user: any) => user._id),
    );
    const uniqueGuests = new Set();

    const newFilteredGuests = combinedGuests.filter((guest) => {
      const identifier = guest._id || guest.email;

      // Exclure l'utilisateur s'il est dans attendees, refused ou favourites
      if (
        enrichedAttendeesIds.has(identifier) ||
        enrichedRefusedIds.has(identifier) ||
        enrichedFavouritesIds.has(identifier)
      ) {
        return false;
      }

      // Exclure les doublons
      if (uniqueGuests.has(identifier)) {
        return false;
      } else {
        uniqueGuests.add(identifier);
        return true; // Ajouter cet utilisateur aux invités filtrés
      }
    });

    // Comparer si la liste des invités filtrés a changé avant de mettre à jour l'état
    setFilteredGuests((prevGuests) => {
      if (JSON.stringify(prevGuests) !== JSON.stringify(newFilteredGuests)) {
        return newFilteredGuests;
      }
      return prevGuests;
    });
  }, [combinedGuests, enrichedAttendees, enrichedRefused, enrichedFavourites]);

  if (!event) {
    return (
      <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  console.log("tempGuests", event);
  const hasAccess =
    (event?.eventType === "private" &&
      (event?.guestsAllowFriend ||
        event?.user?._id === user?._id ||
        event?.coHosts?.some((coHost) => coHost._id === user?._id) ||
        event?.guests?.some((guest) => guest._id === user?._id))) ||
    (email &&
      event?.tempGuests?.some((tempGuest) => tempGuest.email === email));

  const handleAuthSuccess = () => {
    console.log("handleAuthSuccess");
  };
  return (
    <>
      {isAuthModalOpen && <AuthModal onAuthSuccess={handleAuthSuccess} />}
      <RequestModal
        isOpen={event?.eventType === "private" && !hasAccess}
        onRequestToJoin={handleRequestToJoin}
        onAuthModalOpen={() => setIsAuthModalOpen(true)}
        hasToken={!!token}
      />
      <div className="md:grid-cols-2 grid grid-cols-1 w-full h-screen ">
        <div className="md:p-10 md:pl-0 p-4 h-full ">
          <div className="flex items-center w-full justify-between mb-4">
            <Link
              className="flex items-center gap-2"
              href={`/profile/${event?.user?._id}`}
            >
              {event?.user?.profileImage ? (
                <Image
                  src={event?.user.profileImage}
                  alt="user image"
                  width={30}
                  height={30}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <Avatar>
                  <AvatarImage
                    src={"https://github.com/shadcn.png"}
                    className="rounded-full w-10 h-10"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              )}
              <h4 className="ml-2">
                {event?.user?.username.charAt(0).toUpperCase() +
                  event?.user?.username.slice(1) || ""}
              </h4>
            </Link>
            <span className="text-sm">{renderDate(event)}</span>
          </div>
          <RenderMedia event={event} />
        </div>
        <Section className="justify-start py-10  w-full h-full">
          <TabSelector
            onChange={setSelectedTab}
            tabs={
              event.isAdmin || event.isHosted
                ? ["Description", "Attendees", "Settings"]
                : ["Description", "Attendees"]
            }
            className="mb-10"
          />
          {selectedTab === "Description" && (
            <div className="space-y-4 pb-20 w-full">
              <>
                <h1 className="text-xl font-bold">{event?.title}</h1>
                <Link
                  href={event.details?.URLlink || ""}
                  className="text-blue-500 underline"
                  target="_blank"
                >
                  {event.details?.URLlink}
                </Link>
                {event?.interests && (
                  <ul className="flex gap-2 flex-wrap">
                    {event?.interests?.map((interest: InterestType) => (
                      <li
                        key={interest._id}
                        className="text-sm bg-evento-gradient rounded w-fit text-white px-3 py-2"
                      >
                        {interest.name}
                      </li>
                    ))}
                  </ul>
                )}

                <EventTimeSlots event={event} />

                {event?.details?.mode !== "virtual" && (
                  <Button
                    variant={"default"}
                    className="flex gap-2 truncate max-w-full bg-evento-gradient text-white"
                    onClick={() => {
                      const address = event && event?.details?.location;
                      if (address) {
                        const encodedAddress = encodeURIComponent(address);
                        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
                        window.open(googleMapsUrl, "_blank");
                      } else {
                        alert("Address is not available.");
                      }
                    }}
                  >
                    <MapPinIcon2 fill="#fff" className="text-muted w-5 h-5" />
                    <span className="truncate">
                      {event && event?.details?.location}
                    </span>
                  </Button>
                )}
                <p className="text-sm whitespace-pre-wrap break-words max-w-full">
                  {event?.details?.description}
                </p>
              </>
              <div className="flex justify-between items-center">
                {eventEndDate && eventEndDate > currentDate && (
                  <>
                    <AvatarStack event={event} />
                    <EventActionIcons event={event} />
                  </>
                )}
                {eventEndDate && eventEndDate < currentDate && (
                  <PastEventGallery event={event} />
                )}
              </div>
            </div>
          )}
          {selectedTab === "Attendees" && (
            <div className="space-y-4 pb-20 w-full h-full ">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">{event?.title}</h1>
              </div>
              <div className="flex items-center justify-between">
                {event.isHosted && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="guestsAllowFriend"
                      onChange={handleGuestsAllowFriendChange}
                      checked={isGuestAllowed ?? false}
                    />
                    <label htmlFor="guestsAllowFriend">
                      Allow guests to invite friends
                    </label>
                  </div>
                )}
                {(event.guestsAllowFriend ||
                  event.isAdmin ||
                  event.isHosted) && (
                  <EventGuestModal allUsers={users} event={event} />
                )}
              </div>
              <CollapsibleList
                title="Going"
                count={enrichedAttendees.length}
                users={enrichedAttendees}
              />
              <CollapsibleList
                title="Saved"
                count={enrichedFavourites.length}
                users={enrichedFavourites}
              />
              {event && event.eventType === "private" && (
                <>
                  <CollapsibleList
                    title="Requested to Join"
                    count={event?.requested?.length || 0}
                    users={event?.requested || []}
                    isRequestedTab={true}
                  />
                  <CollapsibleList
                    title="Refused"
                    count={enrichedRefused.length}
                    users={enrichedRefused}
                  />
                </>
              )}
              {combinedGuests.length > 0 && (
                <CollapsibleList
                  title={`Invited`}
                  count={filteredGuests.length}
                  users={filteredGuests}
                  event={event}
                />
              )}
              {event?.questions && event?.questions?.length > 0 && (
                <RSVPSubmissionsList
                  title="RSVP Responses"
                  rsvp={rsvpSubmissions}
                />
              )}
              <RefusedUsersList
                title="Refused Reasons"
                refused={refusedStatuses || []}
              />
            </div>
          )}
          {selectedTab === "Settings" && (
            <EventEdit
              event={event}
              allUsers={users}
              onUpdateField={handleUpdateField}
            />
          )}
        </Section>
      </div>
    </>
  );
};

export default EventPage;
