"use client";
import AttendeesList from "@/components/AttendeesList";
import AvatarStack from "@/components/AvatarStack";
import MapPinIcon2 from "@/components/icons/MappPinIcon2";
import Section from "@/components/layout/Section";
import TruncatedText from "@/components/TruncatedText";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/SessionProvider";
import EventActionIcons from "@/features/event/components/EventActionIcons";
import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
type AttendeeType = {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    name: string;
    profileImage: string;
  };
  isGoing: boolean;
  isFavourite: boolean;
  isFollowing: boolean;
};
const EventPage = () => {
  const { id } = useParams();
  const token = useSession();
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/evento/${eventId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setEvent(data.body);
      } else {
        console.error("Failed to fetch event data.");
      }
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  const isValidUrl = (url: string) => {
    return url.startsWith("http://") || url.startsWith("https://");
  };

  return (
    <Section className="px-10 py-6 h-fit bg-white border shadow rounded grid grid-cols-1 md:grid-cols-2 gap-10 ">
      <div className="h-full flex flex-col gap-4 relative">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8">
            {event?.user?.profileImage &&
            isValidUrl(event.user.profileImage) ? (
              <Image
                src={event?.user.profileImage}
                alt="user image"
                width={500}
                height={500}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <Avatar>
                <AvatarImage
                  src={"https://github.com/shadcn.png"}
                  className="rounded-full w-8 h-8"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
          </div>
          <h3>{event?.user?.name}</h3>
        </div>

        <div className="relative h-full flex">
          {event.details.images[0] && (
            <Image
              src={event.details.images[0]}
              alt="event image"
              fill
              className="h-full object-cover relative"
            />
          )}
        </div>
      </div>

      <div className="h-full flex flex-col gap-4 relative">
        <div className="flex justify-around">
          <button
            className={`${
              selectedTab === "Description"
                ? "font-bold text-eventoPurpleLight"
                : "text-black"
            }`}
            onClick={() => setSelectedTab("Description")}
          >
            Description
          </button>
          <button
            className={`${
              selectedTab === "Attendees"
                ? "font-bold text-eventoPurpleLight"
                : "text-black"
            }`}
            onClick={() => setSelectedTab("Attendees")}
          >
            Attendees
          </button>
        </div>
        <div className="h-full flex flex-col">
          {selectedTab === "Description" && (
            <div className="flex flex-col h-full gap-2">
              <h3>{event?.title}</h3>
              <ul className="flex gap-2 flex-wrap">
                {event?.interest?.map((interest: any) => (
                  <li
                    key={interest._id || interest.name}
                    className="bg-eventoPurpleLight/30 w-fit px-2 py-1 rounded-lg text-sm"
                  >
                    {interest.name}
                  </li>
                ))}
              </ul>

              <div className="flex justify-between items-center">
                <Button
                  variant={"ghost"}
                  className="flex gap-2 pl-0 max-w-xs truncate"
                  onClick={() => {
                    const address = event?.details?.location;
                    if (address) {
                      const encodedAddress = encodeURIComponent(address);
                      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
                      window.open(googleMapsUrl, "_blank");
                    } else {
                      alert("Address is not available.");
                    }
                  }}
                >
                  <MapPinIcon2 fill="#7858C3" className="text-muted w-5 h-5" />
                  <span className="truncate">{event?.details?.location}</span>
                </Button>
                <p className="whitespace-nowrap">
                  {event?.details?.startTime} - {event?.details?.endTime}
                </p>
              </div>
              <TruncatedText text={event?.details?.description} />
              <div className="flex justify-between items-center">
                <div>
                  <AvatarStack eventId={event?._id} />
                </div>
                <EventActionIcons event={event} />
              </div>
            </div>
          )}
          {selectedTab === "Attendees" && (
            <div className="flex flex-col h-full  gap-2">
              <h3>Attendees List</h3>

              {/* Going List */}
              <div>
                <h4 className="font-semibold text-lg text-eventoPurpleLight">
                  Going (
                  {
                    event?.attendees?.filter(
                      (attendee: AttendeeType) => attendee.isGoing,
                    ).length
                  }
                  )
                </h4>
                <ul className="mb-4">
                  {event?.attendees
                    ?.filter((attendee: AttendeeType) => attendee.isGoing)
                    .map((attendee: any) => (
                      <li
                        key={attendee.user._id}
                        className="flex items-center justify-between gap-2"
                      >
                        <AttendeesList user={attendee.user} />
                      </li>
                    ))}
                </ul>
              </div>

              {/* Saved (Favourite) List */}
              <div>
                <h4 className="font-semibold flex gap-2 text-lg text-eventoPurpleLight">
                  <ChevronRightIcon />
                  Saved (
                  {
                    event?.attendees?.filter(
                      (attendee: AttendeeType) => attendee.isFavourite,
                    ).length
                  }
                  )
                </h4>
                <ul>
                  {event?.attendees
                    ?.filter((attendee: AttendeeType) => attendee.isFavourite)
                    .map((attendee: any) => (
                      <li
                        key={attendee.user._id}
                        className="flex items-center justify-between gap-2"
                      >
                        <AttendeesList user={attendee.user} />
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

export default EventPage;
