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
  // console.log("Events:", event);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };
  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const isValidUrl = (url: string) => {
    return url.startsWith("http://") || url.startsWith("https://");
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
        <CardHeader>
          <CardTitle className="z-10 w-10 h-10 self-end space-y-2">
            {event?.isGoing && (
              <CircleCheckBig
                strokeWidth={1.5}
                className={cn(
                  "text-white bg-eventoPurpleLight rounded-full w-full h-full",
                )}
              />
            )}{" "}
            {event?.isFavourite && (
              <div className=" w-10 h-10 relative">
                <Circle
                  strokeWidth={1.5}
                  className={cn(
                    "absolute inset-0  text-white bg-eventoPurpleLight rounded-full w-full h-full",
                  )}
                />
                <BookmarkCheck className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
              </div>
            )}
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          {event?.details?.images?.[0] &&
            isValidUrl(event.details.images[0]) && (
              <Image
                src={event.details.images[0]}
                alt="Event Image"
                width={245}
                height={245}
                className="w-full inset-0 h-full absolute object-cover"
              />
            )}
        </CardContent>
        <CardFooter className="p-0 h-32  bg-black/60 font-bold text-white z-10">
          <ul className=" p-5 flex flex-col justify-center w-full h-full">
            <li className="flex gap-5 items-center">
              <CalendarIcon strokeWidth={3} className="w-6" />
              {formatDate(event?.details?.date?.toString() || "")}
            </li>
            <li className="flex gap-5 items-center">
              <MapPinIcon strokeWidth={1.5} className="min-w-6 w-6" />
              {event?.details?.location}
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
