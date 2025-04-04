"use client";
import AvatarStack from "@/components/AvatarStack";
import MapPinIcon2 from "@/components/icons/MappPinIcon2";
import RenderMedia from "@/components/RenderMedia";
import SmartImage from "@/components/SmartImage";
import TruncatedText from "@/components/TruncatedText";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import EventActionIcons from "@/features/event/components/EventActionIcons";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/store/useEventsStore";
import { EventType } from "@/types/EventType";
import { renderDate } from "@/utils/dateUtils";
import Link from "next/link";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import EventLimit from "../event/EventLimit";

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
  const { events } = useEventStore();
  const currentEvent = events.find((e: EventType) => e._id === event._id);
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
                <SmartImage
                  src={event?.user.profileImage}
                  alt="user image"
                  width={30}
                  height={30}
                  className="w-10 h-10 rounded-full"
                  forceImg
                />
              ) : (
                <Avatar>
                  <AvatarImage
                    src={"/evento-logo.png"}
                    className="rounded-full w-10 h-10 "
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              )}
              <div className="flex flex-wrap overflow-hidden">
                <h4 className="truncate text-sm md:text-base">
                  {(event &&
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
            </div>
            <EventLimit event={event} />
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

            <div className="overflow-hidden">
              <Button
                variant={"ghost"}
                className="flex gap-2 pl-0 max-w-xs truncate "
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
              <div className="flex justify-between gap-2">
                <span className="text-sm text-right">{renderDate(event)}</span>
                <p className="whitespace-nowrap">
                  {event?.details?.startTime}{" "}
                  {event?.details?.endTime
                    ? ` - ${event?.details?.endTime}`
                    : ""}
                </p>
              </div>
            </div>
            <Link
              href={event?.details?.URLlink}
              target="_blank"
              className="text-blue-500 underline"
            >
              <TruncatedText
                text={event?.details?.URLtitle || event?.details?.URLlink || ""}
              />
            </Link>
            <TruncatedText text={event?.details?.description} expand={true} />
          </div>
          <div className="flex flex-col justify-between gap-2 md:grid md:grid-cols-2">
            {eventEndDate && eventEndDate > currentDate && (
              <>
                <AvatarStack event={event} />
                <EventActionIcons event={currentEvent || event} />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DiscoverEventPreview;
