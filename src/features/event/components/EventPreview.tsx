"use client";
import EventSettingButton from "@/components/EventSettingButton";
import SmartImage from "@/components/SmartImage";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/store/useEventsStore";
import { EventType } from "@/types/EventType";
import { renderDate } from "@/utils/dateUtils";
import { BookmarkCheck, Circle, CircleCheckBig } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import EventModal from "./EventModal";

const EventPreview = ({
  className,
  event,
  title,
}: {
  className?: string;
  event?: EventType;
  title?: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();
  const { eventsStatus } = useEventStore();
  const eventStatus = event && eventsStatus[event._id];
  const handleCardClick = () => {
    setIsModalOpen(true);
    // console.log("eventprev modal open", event);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Card
        className={cn(
          "cursor-pointer relative flex flex-col justify-between  hover:opacity-90 border-2 rounded-2xl max-h-[336px]",
          className,
        )}
        onClick={handleCardClick}
      >
        <CardHeader className="p-0 absolute right-0 top-0 w-full flex flex-row justify-between ">
          {pathname === "/profile" ? (
            <EventSettingButton className="m-2" event={event} />
          ) : (
            <div></div>
          )}
          <div className="z-10 mr-2 w-10 h-10">
            {eventStatus?.isGoing && (
              <CircleCheckBig
                strokeWidth={1.5}
                className={cn(
                  "text-white bg-evento-gradient rounded-full w-full h-full",
                )}
              />
            )}
            {eventStatus?.isFavourite && (
              <div className="w-10 h-10 relative">
                <Circle
                  strokeWidth={1.5}
                  className={cn(
                    "absolute inset-0  text-white bg-evento-gradient rounded-full w-full h-full",
                  )}
                />
                <BookmarkCheck className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="w-full h-full p-0 rounded-t-xl overflow-hidden aspect-square ">
          {event?.initialMedia && event?.initialMedia[0]?.url ? (
            <SmartImage
              src={event?.initialMedia[0].url}
              alt="Event Image"
              width={200}
              height={200}
              className="w-full object-cover aspect-square md:max-w-[204px] h-[204px]"
              loading={title === "Upcoming Events" ? "eager" : "lazy"}
              forceImg
            />
          ) : (
            <div className="w-full h-full bg-evento-gradient rounded">
              <SmartImage
                src="https://evento-media-bucket.s3.ap-southeast-2.amazonaws.com/evento-bg.jpg"
                alt="Evento standard background"
                height={500}
                width={500}
                className={cn("opacity-20 w-full h-full object-cover")}
                forceImg
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="p-0 bg-background rounded-b-xl h-[104px] md:min-h-32">
          <ul className="p-2 md:p-5 flex flex-col text-sm w-full h-full gap-2 ">
            <li className="line-clamp-2 font-bold">{event?.title}</li>
            <li className="line-clamp-1 text-xs">{renderDate(event)}</li>
            <li className="line-clamp-1 text-xs">
              <p className="whitespace-nowrap">
                {event?.details?.startTime}
                {event?.details?.endTime ? ` - ${event?.details?.endTime}` : ""}
              </p>
            </li>
          </ul>
        </CardFooter>
      </Card>
      <EventModal
        event={event}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default EventPreview;
