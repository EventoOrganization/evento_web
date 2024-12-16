"use client";
import AddressModal from "@/components/AddressModal";
import AddToCalendar from "@/components/AddToCalendar";
import AvatarStack from "@/components/AvatarStack";
import EventoLoader from "@/components/EventoLoader";
import RenderMedia from "@/components/RenderMedia";
import TruncatedText from "@/components/TruncatedText";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
          " md:bg-white md:border maw-w-md md:shadow rounded py-4 md:p-4 w-full grid grid-cols-1 lg:grid-cols-2  h-fit gap-4 md:hover:shadow-xl md:hover:bg-slate-50 cursor-pointer relative",
          className,
          { "lg:grid-cols-1": pathname === "/discover" },
        )}
      >
        <div className=" ">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 px-2 md:px-0">
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
                  className="w-8 h-8 min-w-8  rounded-full"
                  loading={index === 0 ? "eager" : "lazy"}
                  priority={index === 0}
                />
              ) : (
                <Avatar>
                  <AvatarImage
                    src={"/icon-384x384.png"}
                    className="rounded-full min-w-8 w-8 h-8 "
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
          <div className="flex flex-col gap-2 px-4 md:px-0">
            <h3>{event && event?.title}</h3>
            <ul className="flex gap-2 flex-wrap">
              {event &&
                event?.interests?.map((interest: any) => (
                  <li
                    key={interest._id || interest.name}
                    className={`px-2 py-1 rounded-md border text-xs w-fit flex items-center justify-center bg-muted text-black`}
                  >
                    {interest.name}
                  </li>
                ))}
            </ul>
            <div className="flex flex-wrap text-sm justify-between text-muted-foreground">
              <p className="whitespace-nowrap text-eventoPurpleDark font-bold">
                {renderDate(event) || <EventoLoader />}
              </p>
              <p className="whitespace-nowrap">
                {event?.details?.startTime}
                {event?.details?.endTime ? ` - ${event?.details?.endTime}` : ""}
              </p>
            </div>
            <div className="flex justify-between items-center text-sm">
              <AddressModal address={event?.details?.location} />
            </div>
            <TruncatedText
              text={event?.details?.URLtitle || ""}
              url={event?.details?.URLlink || ""}
              isLink
              className="text-eventoPurpleLight"
            />
            <TruncatedText
              className="px-0"
              text={event?.details?.description}
            />
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            {event.isGoing && <AddToCalendar event={event} />}
          </div>
          <div className=" flex flex-col md:grid md:grid-cols-2 w-full justify-between md:items-center gap-2 px-4 md:px-0">
            <AvatarStack event={event} />
            <EventActionIcons event={event} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Event;
