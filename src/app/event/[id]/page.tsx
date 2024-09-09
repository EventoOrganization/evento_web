"use client";
import MapPinIcon2 from "@/components/icons/MappPinIcon2";
import Section from "@/components/layout/Section";
import RenderMedia from "@/components/RenderMedia";
import { Button } from "@/components/ui/button";
import TabSelector from "@/features/discover/TabSelector";
import EventActionIcons from "@/features/event/components/EventActionIcons";
import EventTimeSlots from "@/features/event/components/EventTimeSlots";
import { EventType, InterestType, TimeSlotType } from "@/types/EventType";
import { fetchData } from "@/utils/fetchData";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
// type AttendeeType = {
//   user: {
//     _id: string;
//     firstName: string;
//     lastName: string;
//     name: string;
//     profileImage: string;
//   };
//   isGoing: boolean;
//   isFavourite: boolean;
//   isFollowing: boolean;
// };
const EventPage = () => {
  const { id } = useParams();
  const eventId = Array.isArray(id) ? id[0] : id;
  const [event, setEvent] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState("Description"); // état pour gérer les onglets

  useEffect(() => {
    if (eventId && !event) {
      fetchEventData(eventId);
    } else if (event) {
      console.log("event:", event);
    }
  }, [eventId, event]);

  const fetchEventData = async (eventId: string) => {
    try {
      const eventRes = await fetchData<EventType>(
        `/events/getEvent/${eventId}`,
      );
      setEvent(eventRes.data);
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };

  if (!event) {
    return <div>Loading...</div>;
  }
  const renderDate = () => {
    const startDate = event?.details?.date;
    const endDate = event?.details?.endDate;
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return date.toLocaleDateString("en-US", options);
    };
    if (
      !endDate ||
      new Date(endDate).getTime() === new Date(startDate).getTime()
    ) {
      return `le ${formatDate(startDate)}`;
    } else {
      const startDay = new Date(startDate).getDate();
      const endDay = new Date(endDate).getDate();
      const monthYear = new Date(startDate).toLocaleDateString("fr-FR", {
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
    <div className="md:flex grid grid-cols-1  w-screen h-screen">
      <RenderMedia event={event} />
      <Section className=" justify-start py-4 w-full">
        <div className="flex items-center w-full  justify-between mb-4">
          <div className="flex items-center  gap-2 ">
            {event?.user?.profileImage &&
            isValidUrl(event.user.profileImage) ? (
              <Image
                src={event?.user.profileImage}
                alt="user image"
                width={30}
                height={30}
                className="w-full h-full rounded-full"
              />
            ) : (
              <Avatar>
                <AvatarImage
                  src={"https://github.com/shadcn.png"}
                  className="rounded-full w-8 h-8 "
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
            <h4 className="ml-2">{(event && event?.details.name) || ""}</h4>
          </div>
          <span className="text-sm">{renderDate()}</span>
        </div>
        <TabSelector
          onChange={setSelectedTab}
          tabs={["Description", "Attendees"]}
          className=""
        />
        <Section className="justify-start items-start space-y-4 px-0 pb-20">
          {selectedTab === "Description" && (
            <>
              <h1 className="text-xl font-bold">{event?.title}</h1>
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
              <p>
                {event?.details.timeslots &&
                  event.details.timeslots
                    .map((slot: TimeSlotType) => slot.date)
                    .join(", ")}
              </p>
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
          )}
          <EventActionIcons />
        </Section>
        {selectedTab === "Attendees" && (
          <div>
            <p className="text-sm">Attendees</p>
          </div>
        )}
      </Section>
    </div>
  );
};

export default EventPage;
