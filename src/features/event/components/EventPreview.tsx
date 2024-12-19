"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EventType } from "@/types/EventType";
import { renderDate } from "@/utils/dateUtils";
import { BookmarkCheck, Circle, CircleCheckBig } from "lucide-react";
import Image from "next/image";
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
  // Adjusted function for correct DateTimeFormatOptions types

  const handleCardClick = () => {
    setIsModalOpen(true);
    console.log("eventprev modal open", event);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Card
        className={cn(
          "cursor-pointer relative flex flex-col justify-between  hover:opacity-90 border-2 rounded-2xl",
          className,
        )}
        onClick={handleCardClick}
      >
        <CardHeader className="p-0 absolute right-2 top-2">
          <CardTitle className="z-10 w-10 h-10 self-end space-y-2 ">
            {event?.isGoing && (
              <CircleCheckBig
                strokeWidth={1.5}
                className={cn(
                  "text-white bg-evento-gradient rounded-full w-full h-full",
                )}
              />
            )}
            {event?.isFavourite && (
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
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="w-full h-full p-0 rounded-t-xl overflow-hidden aspect-square ">
          {event?.initialMedia && event?.initialMedia[0]?.url && (
            <Image
              src={event?.initialMedia[0].url}
              alt="Event Image"
              width={200}
              height={200}
              className="h-full w-full object-cover aspect-square md:max-w-[204px] md:max-h-[204px]"
              priority={title === "Upcoming Events" ? true : false}
              loading={title === "Upcoming Events" ? "eager" : "lazy"}
            />
          )}
        </CardContent>
        <CardFooter className="p-0 bg-background rounded-b-xl min-h-[104px] md:min-h-32">
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
