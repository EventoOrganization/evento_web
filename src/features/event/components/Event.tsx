"use client";
import AvatarStack from "@/components/AvatarStack";
import MapPinIcon2 from "@/components/icons/MappPinIcon2";
import RenderMedia from "@/components/RenderMedia";
import TruncatedText from "@/components/TruncatedText";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { SquareArrowOutUpRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import EventActionIcons from "./EventActionIcons";

const Event = ({
  className,
  event,
  // isModal,
}: {
  className?: string;
  event?: any;
  // isModal?: boolean;
}) => {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const handleCloseModal = () => {
  //   setIsModalOpen(false);
  // };
  const [isHovered, setIsHovered] = useState(false);
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
      return `le ${formatDate(startDate)}`; // Single date
    } else {
      const startDay = new Date(startDate).getDate();
      const endDay = new Date(endDate).getDate();
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      const monthYear = startDateObj.toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      });

      // If the event ends at exactly midnight, don't include the end date
      if (
        endDateObj.getHours() === 0 &&
        endDateObj.getMinutes() === 0 &&
        endDateObj.getSeconds() === 0
      ) {
        return `du ${startDay} au ${endDay - 1} ${monthYear}`;
      } else {
        return `du ${startDay} au ${endDay} ${monthYear}`;
      }
    }
  };

  const isValidUrl = (url: string) => {
    return url.startsWith("http://") || url.startsWith("https://");
  };

  return (
    <>
      <div
        className={cn(
          "bg-white border shadow rounded p-4 w-full flex flex-col h-fit gap-4 hover:shadow-xl hover:bg-slate-50 cursor-pointer relative",
          className,
        )}
        // onClick={() => {
        //   if (!isModal) setIsModalOpen(true);
        // }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {event?.user?.profileImage &&
            isValidUrl(event.user.profileImage) ? (
              <Image
                src={event?.user.profileImage}
                alt="user image"
                width={500}
                height={500}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <Avatar>
                <AvatarImage
                  src={"https://github.com/shadcn.png"}
                  className="rounded-full w-6 h-6"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
            <h4 className="ml-2">{(event && event?.details.name) || ""}</h4>
          </div>
          <span className="ml-4">{renderDate()}</span>
        </div>
        <div
          className={cn("", {
            "bg-evento-gradient": event && event?.details?.images?.[0],
          })}
        >
          <div>
            <RenderMedia event={event} />
          </div>
          {/* <div className="relative w-full pb-[56.25%]">
          <Image
          src={
            event?.details?.images?.[0] && isValidUrl(event.details.images[0])
                ? event.details.images[0]
                : (createEvent?.imagePreviews &&
                createEvent.imagePreviews[0]) ||
                "https://evento-media-bucket.s3.ap-southeast-2.amazonaws.com/evento-bg.jpg"
                }
                alt="event image"
                fill
                objectFit="cover"
                className={cn({
                  "opacity-20":
                  !event &&
                  !(createEvent?.imagePreviews && createEvent.imagePreviews[0]),
                  })}
                  />
                  </div> */}
        </div>
        <div className="flex flex-col gap-2">
          <h3>{event && event?.title}</h3>
          <ul className="flex gap-2 flex-wrap">
            {event &&
              event?.interest?.map((interest: any) => (
                <li
                  key={interest._id}
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
          <TruncatedText text={event?.details?.description} />
        </div>
        <div className="flex justify-between items-center">
          <div>
            <AvatarStack eventId={event?._id} />
          </div>
          <EventActionIcons event={event} />
        </div>
        {isHovered && (
          <Link
            href={`/event/${event?._id}`}
            className="absolute top-0 right-0 bg-evento-gradient text-white border shadow-lg rounded p-2  z-10"
          >
            <SquareArrowOutUpRightIcon />
          </Link>
        )}
      </div>
      {/* <EventModal
        event={event}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      /> */}
    </>
  );
};

export default Event;
