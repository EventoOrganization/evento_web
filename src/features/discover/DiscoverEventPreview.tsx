"use client";
import AvatarStack from "@/components/AvatarStack";
import MapPinIcon2 from "@/components/icons/MappPinIcon2";
import RenderMedia from "@/components/RenderMedia";
import TruncatedText from "@/components/TruncatedText";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import EventActionIcons from "@/features/event/components/EventActionIcons";
import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/store/useGlobalStore";
import { EventType } from "@/types/EventType";
import { Loader } from "lucide-react";
import Image from "next/image";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import PastEventGallery from "../event/components/PastEventGallery";

const DiscoverEventPreview = ({
  className,
  event,
}: {
  className?: string;
  event?: any;
}) => {
  const currentDate = new Date();
  const eventEndDate = event.details?.endDate
    ? new Date(event.details.endDate)
    : null;
  const events = useGlobalStore((state) => state.events);
  const currentEvent = events.find((e: EventType) => e._id === event._id);
  const renderDate = () => {
    if (!currentEvent || !event.details) return <Loader />;
    const startDate = event?.details?.date;
    const endDate = event?.details?.endDate;
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return date.toLocaleDateString("en-UK", options);
    };
    if (
      !endDate ||
      new Date(endDate).getTime() === new Date(startDate).getTime()
    ) {
      return `le ${formatDate(startDate)}`;
    } else {
      const startDay = new Date(startDate).getDate();
      const endDay = new Date(endDate).getDate();
      const monthYear = new Date(startDate).toLocaleDateString("en-UK", {
        month: "long",
        year: "numeric",
      });
      return `From ${startDay} to ${endDay} ${monthYear}`;
    }
  };
  console.log("coucou");
  return (
    <>
      <div
        className={cn(
          "bg-white border shadow rounded p-4 w-full grid grid-cols-1 lg:grid-cols-2  h-fit gap-4 hover:shadow-xl hover:bg-slate-50 cursor-pointer relative",
          className,
        )}
      >
        <div className=" ">
          <div className="flex items-center justify-between  mb-4">
            <div className="flex items-center gap-2">
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
              <h4 className="ml-2">{(event && event?.user.username) || ""}</h4>
            </div>
            <span className="text-sm text-right">{renderDate()}</span>
          </div>
          <div>
            <RenderMedia event={event} />
          </div>
        </div>
        <div>
          <div className="flex flex-col gap-2">
            <h3>{event && event?.title}</h3>
            <ul className="flex gap-2 flex-wrap">
              {event &&
                event?.interests?.map((interest: any) => (
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
                onClick={(e) => {
                  e.stopPropagation();
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
                <MapPinIcon2 fill="#7858C3" className="text-muted w-5 h-5" />
                <span className="truncate">
                  {event && event?.details?.location}
                </span>
              </Button>
              <p className="whitespace-nowrap">
                {event?.details?.startTime} - {event?.details?.endTime}
              </p>
            </div>
            <TruncatedText text={event?.details?.description} expand={true} />
          </div>
          <div className="flex justify-between items-center">
            {eventEndDate && eventEndDate > currentDate && (
              <>
                <AvatarStack event={event} />
                <EventActionIcons event={currentEvent || event} />
              </>
            )}
            {eventEndDate && eventEndDate < currentDate && (
              <PastEventGallery event={event} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DiscoverEventPreview;
