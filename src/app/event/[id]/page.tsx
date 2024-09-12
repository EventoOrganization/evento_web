"use client";
import CollapsibleList from "@/components/CollapsibleList";
import MapPinIcon2 from "@/components/icons/MappPinIcon2";
import Section from "@/components/layout/Section";
import RenderMedia from "@/components/RenderMedia";
import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/SessionProvider";
import TabSelector from "@/features/discover/TabSelector";
import EventActionIcons from "@/features/event/components/EventActionIcons";
import EventGuestModal from "@/features/event/components/EventGuestModal";
import EventTimeSlots from "@/features/event/components/EventTimeSlots";
import PrivateEventActionIcons from "@/features/event/components/PrivateEventActionIcons";
import { EventType, InterestType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { fetchData, HttpMethod } from "@/utils/fetchData";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const EventPage = () => {
  const { id } = useParams();
  const eventId = Array.isArray(id) ? id[0] : id;
  const [event, setEvent] = useState<EventType | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedTab, setSelectedTab] = useState("Description");

  const { user, token } = useSession();
  useEffect(() => {
    if (eventId && !event) {
      fetchEventData(eventId);
    }
    if (user && token) {
      loadUsersPlus(user._id, token);
    } else {
      loadusers();
    }
  }, [eventId, event]);

  const fetchEventData = async (eventId: string) => {
    try {
      const userIdQuery = user && user._id ? `?userId=${user._id}` : "";
      const eventRes = await fetchData<EventType>(
        `/events/getEvent/${eventId}${userIdQuery}`,
      );
      setEvent(eventRes.data);
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };
  const loadusers = async () => {
    try {
      const usersRes = await fetchData<UserType[]>(
        `/users/userListWithFollowingStatus`,
      );
      setUsers(usersRes.data as UserType[]);
    } catch (error) {}
  };
  const loadUsersPlus = async (userId: string, token: string) => {
    try {
      const usersRes = await fetchData(
        `/users/followStatusForUsersYouFollow/${userId}`,
        HttpMethod.GET,
        null,
        token,
      );
      setUsers(usersRes.data as UserType[]);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  if (!event) {
    return <div>Loading...</div>;
  }
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

  return (
    <div className="md:grid-cols-2 grid grid-cols-1 w-screen h-screen">
      <div className="p-10">
        <div className="flex items-center w-full justify-between mb-4">
          <div className="flex items-center gap-2 ">
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
                  className="rounded-full w-10 h-10 "
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
            <h4 className="ml-2">
              {(event.details && event?.user?.username) || ""}
            </h4>
          </div>
          <span className="text-sm">{renderDate()}</span>
        </div>
        <RenderMedia event={event} />
      </div>
      <Section className=" justify-start p-10 w-full">
        <TabSelector
          onChange={setSelectedTab}
          tabs={["Description", "Attendees"]}
          className=""
        />
        {selectedTab === "Description" && (
          <div className="space-y-4 pb-20 w-full">
            <>
              <h1 className="text-xl font-bold">{event?.title}</h1>
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
              <p className="text-sm">{event?.details?.description}</p>
            </>

            {event.eventType === "public" && <EventActionIcons event={event} />}
            {event.eventType === "private" && (
              <PrivateEventActionIcons event={event} />
            )}
          </div>
        )}
        {selectedTab === "Attendees" && (
          <div className="space-y-4 pb-20 w-full">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">{event?.title}</h1>
              {event.guestsAllowFriend ||
                event.isAdmin ||
                (event.isHosted && (
                  <EventGuestModal allUsers={users} event={event} />
                ))}
            </div>
            {event.isHosted && (
              <div className="flex items-center gap-2">
                <input type="checkbox" id="guestsAllowFriend" />
                <label htmlFor="guestsAllowFriend">
                  Allow guests to bring friends
                </label>
              </div>
            )}
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
          </div>
        )}
      </Section>
    </div>
  );
};

export default EventPage;
