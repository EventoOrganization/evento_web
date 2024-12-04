"use client";
import AvatarStack from "@/components/AvatarStack";
import EventoLoader from "@/components/EventoLoader";
import MapPinIcon2 from "@/components/icons/MappPinIcon2";
import RenderMedia from "@/components/RenderMedia";
import TruncatedText from "@/components/TruncatedText";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import DiscoverRenderMedia from "@/features/discover/DiscoverRenderMedia";
import { cn } from "@/lib/utils";
import { renderDate } from "@/utils/dateUtils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import EventActionIcons from "./EventActionIcons";

const Event = ({
  className,
  event,
  index,
}: {
  className?: string;
  event?: any;
  index?: number;
}) => {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          " md:bg-white md:border maw-w-md md:shadow rounded md:p-4 w-full grid grid-cols-1 lg:grid-cols-2  h-fit gap-4 md:hover:shadow-xl md:hover:bg-slate-50 cursor-pointer relative",
          className,
          { "lg:grid-cols-1": pathname === "/discover" },
        )}
      >
        <div className=" ">
          <div className="grid grid-cols-4 items-center justify-between gap-4 mb-4 px-2 md:px-0">
            <Link
              href={`/profile/${event?.user?._id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 col-span-2"
            >
              {event?.user?.profileImage ? (
                <Image
                  src={event?.user.profileImage}
                  alt="user image"
                  width={30}
                  height={30}
                  className="w-10 h-10 min-w-10  rounded-full"
                  loading={index === 0 ? "eager" : "lazy"}
                  priority={index === 0}
                />
              ) : (
                <Avatar>
                  <AvatarImage
                    src={"/icon-384x384.png"}
                    className="rounded-full min-w-10 w-10 h-10 "
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              )}
              <div className="flex flex-wrap overflow-hidden">
                <h4 className="truncate text-sm md:text-base">
                  {(event &&
                    event?.user?.username &&
                    event?.user.username.charAt(0).toUpperCase() +
                      event?.user.username.slice(1)) ||
                    ""}
                </h4>
                {event.coHosts.length === 1 &&
                  event.coHosts.map((coHost: any) => (
                    <h4
                      className="truncate text-sm md:ml-1 md:text-base"
                      key={coHost._id}
                    >
                      &{" "}
                      {coHost?.userId?.username &&
                        coHost?.userId?.username.charAt(0).toUpperCase() +
                          coHost?.userId?.username.slice(1)}
                    </h4>
                  ))}
                {event.coHosts.length > 1 && (
                  <h4 className="truncate text-sm md:text-base md:ml-1">
                    & {event.coHosts?.length} more
                  </h4>
                )}
              </div>
            </Link>
            <span className="text-sm text-right col-span-2">
              {renderDate(event) || <EventoLoader />}
            </span>
          </div>
          <div>
            {pathname === "/discover" ? (
              <DiscoverRenderMedia event={event} />
            ) : (
              <RenderMedia event={event} index={index} />
            )}
          </div>
        </div>
        <div>
          <div className="flex flex-col gap-2 px-2 md:px-0">
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
                <MapPinIcon2
                  fill="#7858C3"
                  className="text-muted min-w-3 min-h-3 w-5 h-5"
                />
                <span className="truncate">
                  {event && event?.details?.location}
                </span>
              </Button>
              <p className="whitespace-nowrap">
                {event?.details?.startTime}
                {event?.details?.endTime ? ` - ${event?.details?.endTime}` : ""}
              </p>
            </div>
            <TruncatedText
              text={event?.details?.URLtitle || event?.details?.URLlink || ""}
              isLink
            />
            <TruncatedText
              className="px-0"
              text={event?.details?.description}
            />
          </div>
          <div className="flex justify-between items-center px-2 md:px-0">
            <div>
              <AvatarStack event={event} />
            </div>
            <EventActionIcons event={event} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Event;
