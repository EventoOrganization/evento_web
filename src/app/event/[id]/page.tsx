"use client";
import CollapsibleList from "@/components/CollapsibleList";
import MapPinIcon2 from "@/components/icons/MappPinIcon2";
import Section from "@/components/layout/Section";
import RenderMedia from "@/components/RenderMedia";
import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/SessionProvider";
import TabSelector from "@/features/discover/TabSelector";
import EventActionIcons from "@/features/event/components/EventActionIcons";
import EventTimeSlots from "@/features/event/components/EventTimeSlots";
import PrivateEventActionIcons from "@/features/event/components/PrivateEventActionIcons";
import { EventType, InterestType } from "@/types/EventType";
import { fetchData } from "@/utils/fetchData";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const EventPage = () => {
  const { id } = useParams();
  const eventId = Array.isArray(id) ? id[0] : id;
  const [event, setEvent] = useState<EventType | null>(null);
  const [selectedTab, setSelectedTab] = useState("Description");
  const { user } = useSession();
  useEffect(() => {
    if (eventId && !event) {
      fetchEventData(eventId);
    } else if (event) {
      console.log("event:", event);
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

  if (!event) {
    return <div>Loading...</div>;
  }
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return ""; // Return empty or a default string if date is undefined
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
  const isValidUrl = (url: string) => {
    return url.startsWith("http://") || url.startsWith("https://");
  };

  return (
    <div className="md:grid-cols-2 grid grid-cols-1 w-screen h-screen">
      <RenderMedia event={event} />
      <Section className=" justify-start lg:p-20 lg:pt-10 w-full">
        <div className="flex items-center w-full  justify-between mb-4">
          <div className="flex items-center  gap-2 ">
            {event?.user?.profileImage &&
            isValidUrl(event.user.profileImage) ? (
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
              {(event.details && event?.details.name) || ""}
            </h4>
          </div>
          <span className="text-sm">{renderDate()}</span>
        </div>
        <TabSelector
          onChange={setSelectedTab}
          tabs={["Description", "Attendees"]}
          className=""
        />
        {selectedTab === "Description" && (
          <div className="space-y-4 pb-20 w-full">
            <>
              <h1 className="text-xl font-bold">{event?.title}</h1>
              {event?.interest && (
                <ul className="flex gap-2 flex-wrap">
                  {event?.interest?.map((interest: InterestType) => (
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
                variant={"ghost"}
                className="flex gap-2 truncate max-w-full bg-eventoPurpleLight text-white hover:text-white hover:bg-eventoPurpleLight/80"
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
            <h1 className="text-xl font-bold">{event?.title}</h1>
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
