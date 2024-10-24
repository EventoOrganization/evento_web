"use client";
import CalendarIcon from "@/components/icons/CalendarIcon";
import MapPinIcon from "@/components/icons/MapPinIcon";
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
import { BookmarkCheck, Circle, CircleCheckBig } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import EventModal from "./EventModal";

const EventPreview = ({
  className,
  event,
}: {
  className?: string;
  event?: EventType;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Adjusted function for correct DateTimeFormatOptions types
  const formatDateResponsive = (dateString: string | undefined) => {
    if (!dateString) return "Invalid Date";
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    };
    return date.toLocaleDateString("en-UK", options);
  };

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
          "cursor-pointer relative flex flex-col justify-between aspect-square bg-evento-gradient hover:opacity-90",
          className,
        )}
        onClick={handleCardClick}
      >
        <CardHeader className="p-0">
          <CardTitle className="z-10 w-10 h-10 self-end space-y-2 absolute right-2 top-2">
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
        <CardContent>
          {event?.initialMedia && event?.initialMedia[0]?.url ? (
            <Image
              src={event?.initialMedia[0].url}
              alt="Event Image"
              width={245}
              height={245}
              className="w-full inset-0 h-full absolute object-cover aspect-square"
            />
          ) : (
            <span></span>
          )}
        </CardContent>
        <CardFooter className="p-0 text-sm bg-black/60 font-bold text-white z-10">
          <ul className="p-2 md:p-5 flex flex-col justify-center w-full h-full">
            <li className="flex gap-5 items-center ">
              <CalendarIcon strokeWidth={3} className="w-5" />
              {formatDateResponsive(event?.details?.date)}
            </li>
            <li className="flex gap-5 items-center">
              <MapPinIcon strokeWidth={1.5} className="min-w-5 w-5" />
              <p className="truncate">{event?.details?.location}</p>
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
