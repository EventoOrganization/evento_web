"use client";
import AvatarStack from "@/components/AvatarStack";
import MapPinIcon2 from "@/components/icons/MappPinIcon2";
import RenderMedia from "@/components/RenderMedia";
import TruncatedText from "@/components/TruncatedText";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/SessionProvider";
import { cn } from "@/lib/utils";
import { Loader, SquareArrowOutUpRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import DeleteEventButton from "./DeleteEventButton";
import EventActionIcons from "./EventActionIcons";

const Event = ({ className, event }: { className?: string; event?: any }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useSession();
  const isHost = event?.user?._id === user?._id;
  const pathname = usePathname();
  const renderDate = () => {
    if (!event || !event.details) return <Loader />;
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
    <>
      <div
        className={cn(
          "bg-white border shadow rounded p-4 w-full flex flex-col h-fit gap-4 hover:shadow-xl hover:bg-slate-50 cursor-pointer relative",
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center justify-between ">
          <div className="flex items-center justify-center ">
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
                  className="rounded-full"
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
            // "bg-evento-gradient": event && event?.details?.images?.[0],
          })}
        >
          <div>
            <RenderMedia event={event} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3>{event && event?.title}</h3>
          <ul className="flex gap-2 flex-wrap">
            {event &&
              event?.interest?.map((interest: any) => (
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
        {isHost && pathname !== "/discover" && (
          <div className="flex justify-end mt-4">
            <DeleteEventButton eventId={event._id} isHost={isHost} />
          </div>
        )}
        {isHovered && (
          <Link
            href={`/event/${event?._id}`}
            className="absolute top-0 right-0 bg-evento-gradient text-white border shadow-lg rounded p-2  z-10"
          >
            <SquareArrowOutUpRightIcon />
          </Link>
        )}
      </div>
    </>
  );
};

export default Event;
