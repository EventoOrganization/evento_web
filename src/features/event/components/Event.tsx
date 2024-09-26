"use client";
import AvatarStack from "@/components/AvatarStack";
import MapPinIcon2 from "@/components/icons/MappPinIcon2";
import RenderMedia from "@/components/RenderMedia";
import TruncatedText from "@/components/TruncatedText";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import DiscoverRenderMedia from "@/features/discover/DiscoverRenderMedia";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import EventActionIcons from "./EventActionIcons";
import PrivateEventActionIcons from "./PrivateEventActionIcons";

const Event = ({ className, event }: { className?: string; event?: any }) => {
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
      return date.toLocaleDateString("fr-FR", options);
    };
    if (
      !endDate ||
      new Date(endDate).getTime() === new Date(startDate).getTime()
    ) {
      return `${formatDate(startDate)}`;
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

  return (
    <>
      <div
        className={cn(
          "bg-white border maw-w-md shadow rounded p-4 w-full grid grid-cols-1 lg:grid-cols-2  h-fit gap-4 hover:shadow-xl hover:bg-slate-50 cursor-pointer relative",
          className,
          { "lg:grid-cols-1": pathname === "/discover" },
        )}
      >
        <div className=" ">
          <div className="flex items-center justify-between gap-4 mb-4 ">
            <Link
              href={`/profile/${event?.user?._id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 "
            >
              {event?.user?.profileImage ? (
                <Image
                  src={event?.user.profileImage}
                  alt="user image"
                  width={30}
                  height={30}
                  className="w-10 h-10 min-w-10  rounded-full"
                />
              ) : (
                <Avatar>
                  <AvatarImage
                    src={"https://github.com/shadcn.png"}
                    className="rounded-full min-w-10 w-10 h-10 "
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              )}
              <h4 className="ml-2">{(event && event?.user.username) || ""}</h4>
              {event.coHosts.length === 1 &&
                event.coHosts.map((coHost: any) => (
                  <h4 key={coHost.user_Id._id}>
                    & {coHost?.user_id?.username}
                  </h4>
                ))}
              {event.coHosts.length > 1 && (
                <h4>& {event.coHosts?.length} more</h4>
              )}
            </Link>
            <span className="text-sm text-right">{renderDate()}</span>
          </div>
          <div>
            {pathname === "/discover" ? (
              <DiscoverRenderMedia event={event} />
            ) : (
              <RenderMedia event={event} />
            )}
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
            <TruncatedText text={event?.details?.description} />
          </div>
          <div className="flex justify-between items-center">
            <div>
              <AvatarStack event={event} />
            </div>
            {event.eventType === "public" && <EventActionIcons event={event} />}
            {event.eventType === "private" && (
              <PrivateEventActionIcons event={event} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Event;
