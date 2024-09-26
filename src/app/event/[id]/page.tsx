"use client";
import AvatarStack from "@/components/AvatarStack";
import CollapsibleList from "@/components/CollapsibleList";
import MapPinIcon2 from "@/components/icons/MappPinIcon2";
import Section from "@/components/layout/Section";
import RenderMedia from "@/components/RenderMedia";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import { useSession } from "@/contexts/SessionProvider";
import TabSelector from "@/features/discover/TabSelector";
import EventActionIcons from "@/features/event/components/EventActionIcons";
import EventEdit from "@/features/event/components/EventEdit";
import EventGuestModal from "@/features/event/components/EventGuestModal";
import EventTimeSlots from "@/features/event/components/EventTimeSlots";
import PastEventGallery from "@/features/event/components/PastEventGallery";
import PrivateEventActionIcons from "@/features/event/components/PrivateEventActionIcons";
import RefusedUsersList from "@/features/event/components/RefusedUsersList";
import RSVPSubmissionsList from "@/features/event/components/RSVPSubmissionsList";
import { useToast } from "@/hooks/use-toast";
import { EventType, InterestType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const EventPage = () => {
  const { id } = useParams();
  const eventId = Array.isArray(id) ? id[0] : id;
  const [event, setEvent] = useState<EventType | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedTab, setSelectedTab] = useState("Description");
  const [isGuestAllowed, setIsGuestAllowed] = useState<boolean | null>(null);
  const { user, token } = useSession();
  const { toast } = useToast();
  const currentDate = new Date();
  const eventEndDate = event?.details?.endDate
    ? new Date(event.details.endDate)
    : null;
  useEffect(() => {
    if (eventId) {
      fetchEventData(eventId);
    }
    if (user && token) {
      loadUsersPlus(user._id, token);
    } else {
      loadUsers();
    }
  }, [eventId, user, token]);

  const fetchEventData = async (eventId: string) => {
    try {
      const userIdQuery = user && user._id ? `?userId=${user._id}` : "";
      const eventRes = await fetchData<EventType>(
        `/events/getEvent/${eventId}${userIdQuery}`,
      );
      setEvent(eventRes.data);
      setIsGuestAllowed(eventRes.data?.guestsAllowFriend || null);
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };

  const loadUsers = async () => {
    try {
      const usersRes = await fetchData<UserType[]>(
        `/users/userListWithFollowingStatus`,
      );
      setUsers(usersRes.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const loadUsersPlus = async (userId: string, token: string) => {
    try {
      const usersRes = await fetchData<UserType[]>(
        `/users/followStatusForUsersYouFollow/${userId}`,
        HttpMethod.GET,
        null,
        token,
      );
      setUsers(usersRes.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

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
        default:
          console.warn("Unknown field", field);
      }

      setEvent(updatedEvent);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
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

  const renderDate = () => {
    const startDate = event?.details?.date;
    const endDate = event?.details?.endDate;
    if (
      !endDate ||
      new Date(endDate).getTime() === new Date(startDate || "").getTime()
    ) {
      return `On ${formatDate(startDate)}`;
    } else {
      const startDay = new Date(startDate || "").getDate();
      const endDay = new Date(endDate).getDate();
      const monthYear = new Date(startDate || "").toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      });
      return `From ${startDay} to ${endDay} ${monthYear}`;
    }
  };

  const combinedGuests = [
    ...(event?.guests?.map((guest) => ({ ...guest, status: "guest" })) || []),
    ...(event?.tempGuests?.map((tempGuest) => ({
      ...tempGuest,
      status: "tempGuest",
    })) || []),
  ];

  const uniqueGuests = new Set();
  const filteredGuests = combinedGuests.filter((guest) => {
    const identifier = guest._id || guest.email;
    if (uniqueGuests.has(identifier)) {
      return false;
    } else {
      uniqueGuests.add(identifier);
      return true;
    }
  });

  if (!event) {
    return (
      <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  console.log("users", event);
  return (
    <>
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
              <h4 className="ml-2">{event?.user?.username || ""}</h4>
            </Link>
            <span className="text-sm">{renderDate()}</span>
          </div>
          <RenderMedia event={event} />
        </div>
        <Section className="justify-start py-10 md:pr-0 w-full h-full">
          <TabSelector
            onChange={setSelectedTab}
            tabs={
              event.isAdmin || event.isHosted
                ? ["Description", "Attendees", "Settings"]
                : ["Description", "Attendees"]
            }
            className="mb-4"
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
                <p className="text-sm whitespace-pre-wrap break-words max-w-full">
                  {event?.details?.description}
                </p>
              </>
              <div className="flex justify-between items-center">
                {eventEndDate &&
                  eventEndDate > currentDate &&
                  (event.eventType === "public" ? (
                    <>
                      <AvatarStack event={event} />
                      <EventActionIcons event={event} />
                    </>
                  ) : (
                    <>
                      <AvatarStack event={event} />
                      <PrivateEventActionIcons event={event} />
                    </>
                  ))}
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
                title={`Going`}
                count={event?.attendees?.length || 0}
                users={event?.attendees || []}
              />
              <CollapsibleList
                title={`Saved`}
                count={event?.favouritees?.length || 0}
                users={event?.favouritees || []}
              />
              {event.eventType === "private" && (
                <CollapsibleList
                  title={`Refused`}
                  count={event?.refused?.length || 0}
                  users={event?.refused || []}
                />
              )}
              {combinedGuests.length > 0 && (
                <CollapsibleList
                  title={`Invited`}
                  count={filteredGuests.length}
                  users={filteredGuests}
                  event={event}
                />
              )}
              {event?.details?.createRSVP && (
                <RSVPSubmissionsList
                  title="RSVP Submissions"
                  attendees={event?.attendees || []}
                />
              )}
              <RefusedUsersList
                title="Refused Users"
                users={event?.refused || []}
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
