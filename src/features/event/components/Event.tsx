"use client";
import TruncatedText from "@/components/TruncatedText";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useEventStore } from "@/store/useEventStore";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { MapPin } from "lucide-react";
import Image from "next/image";
const Event = ({ className, event }: { className?: string; event?: any }) => {
  const createEvent = useEventStore((state) => state);
  const user = useAuthStore((state) => state.user);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };
  const renderDate = () => {
    const startDate = event ? event?.details?.date : createEvent?.date;
    const endDate = event ? event?.details?.endDate : createEvent?.endDate;

    if (startDate === endDate || !endDate) {
      return `le ${formatDate(startDate)}`; // Single date
    } else {
      const startDay = new Date(startDate).getDate();
      const endDay = new Date(endDate).getDate();
      const startDateObj = new Date(startDate);

      const monthYear = startDateObj.toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      });

      return `du ${startDay} au ${endDay} ${monthYear}`; // e.g., "du 10 au 12 septembre 2024"
    }
  };
  const isValidUrl = (url: string) => {
    return url.startsWith("http://") || url.startsWith("https://");
  };
  return (
    <div
      className={cn(
        "bg-muted border shadow rounded p-4 w-full flex flex-col h-fit gap-4",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {event?.user?.profileImage && isValidUrl(event.user.profileImage) ? (
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
                src={user?.profileImage || "https://github.com/shadcn.png"}
                className="rounded-full w-6 h-6"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          )}
          <h4 className="ml-2">
            {user?.name ? createEvent?.name : event?.user.name}
          </h4>
        </div>
        <span className="ml-4">{renderDate()}</span>
      </div>
      <div
        className={cn("", {
          "bg-evento-gradient":
            !event &&
            !(createEvent?.imagePreviews && createEvent.imagePreviews[0]),
        })}
      >
        <div className="relative w-full pb-[56.25%]">
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
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h3>{event ? event?.title : createEvent?.title}</h3>
        <ul className="flex gap-2 flex-wrap">
          {event
            ? event?.interest?.map((interest: any) => (
                <li
                  key={interest._id}
                  className="bg-eventoPurple/30 w-fit px-2 py-1 rounded-lg"
                >
                  {interest.name}
                </li>
              ))
            : createEvent?.interests?.map(
                (interest: { value: string; label: string }) => (
                  <li
                    key={interest.value}
                    className="bg-eventoPurple/30 w-fit px-2 py-1 rounded-lg"
                  >
                    {interest.label}
                  </li>
                ),
              )}
        </ul>

        <div className="flex justify-between items-center">
          <Button
            variant={"ghost"}
            className="flex gap-2 pl-0 max-w-xs truncate"
            onClick={() => {
              const address = event
                ? event?.details?.location
                : createEvent?.location;
              if (address) {
                const encodedAddress = encodeURIComponent(address);
                const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
                window.open(googleMapsUrl, "_blank");
              } else {
                alert("Address is not available.");
              }
            }}
          >
            <MapPin fill="#7858C3" className="text-muted" />
            <span className="truncate">
              {event ? event?.details?.location : createEvent?.location}
            </span>
          </Button>
          <p className="whitespace-nowrap">
            {event?.details?.startTime || createEvent?.startTime} -{" "}
            {event?.details?.endTime || createEvent?.endTime}
          </p>
        </div>
        <TruncatedText
          text={event?.details?.description || createEvent?.description}
        />
      </div>
      {/* <div className="flex justify-between items-center">
        <div>
          <AvatarStack eventId={event?._id} />{" "}
        </div>
        <EventActionIcons event={event} />
      </div> */}
    </div>
  );
};

export default Event;
