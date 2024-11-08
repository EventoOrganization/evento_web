"use client";

import MapPinIcon2 from "@/components/icons/MappPinIcon2";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useEventStore } from "@/store/useEventStore";
import { useGlobalStore } from "@/store/useGlobalStore";
import Image from "next/image";
import CreateEventCarousel from "./CreateEventCarousel";
const CreateEventPreview = ({
  className,
  handleRemoveInterest,
  inModal = false,
}: {
  inModal?: boolean;
  className?: string;
  handleRemoveInterest?: (interestId: string) => void;
}) => {
  const eventStore = useEventStore();
  const { user } = useAuthStore();
  const { userInfo } = useGlobalStore();

  const renderDate = () => {
    const startDate = eventStore.date || new Date().toISOString();
    const endDate = eventStore.endDate || startDate;
    const formatDate = (
      dateString: string,
      includeYear = false,
      fullMonth = false,
    ) => {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        month: fullMonth ? "long" : "short",
        day: "numeric",
        ...(includeYear && { year: "numeric" }),
      };
      return date.toLocaleDateString("en-UK", options);
    };

    const formatMonthYear = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-UK", {
        month: "long",
        year: "numeric",
      });
    };

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start.getTime() === end.getTime()) {
      return `The ${formatDate(startDate, true, true)}`; // ex: The 2 November 2024
    }

    if (
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear()
    ) {
      return `From ${start.getDate()} to ${end.getDate()} ${formatMonthYear(startDate)}`;
    }

    if (start.getFullYear() === end.getFullYear()) {
      return `From ${formatDate(startDate)} to ${formatDate(endDate, true)}`;
    }

    return `From ${formatDate(startDate, true)} to ${formatDate(endDate, true)}`;
  };

  return (
    <>
      <div
        className={cn(
          "bg-white border shadow rounded p-4 w-full grid grid-cols-1 h-fit gap-4 hover:shadow-xl hover:bg-slate-50 cursor-pointer relative",
          className,
          { "lg:grid-cols-2 items-start gap-10": inModal },
        )}
      >
        <div className="flex items-center justify-between ">
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2 items-center">
                {user?.profileImage ? (
                  <Image
                    src={user?.profileImage || ""}
                    alt="user image"
                    width={30}
                    height={30}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <Avatar>
                    <AvatarImage
                      src={"https://github.com/shadcn.png"}
                      className="rounded-full w-8 h-8"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                )}
                <h4 className="ml-2">
                  {(user &&
                    userInfo &&
                    userInfo?.username.charAt(0).toUpperCase() +
                      userInfo?.username.slice(1)) ||
                    "Username"}
                </h4>
              </div>
              <span className="text-sm">
                {eventStore.date ? renderDate() : "Date"}
              </span>
            </div>
            <CreateEventCarousel />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3>{eventStore.title ? eventStore.title : "Event Title"}</h3>
          <ul className="flex gap-2 flex-wrap">
            {eventStore.interests &&
              eventStore.interests.map((interest: any, index: number) => (
                <li
                  key={index}
                  onClick={() =>
                    handleRemoveInterest && handleRemoveInterest(interest._id)
                  }
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
              onClick={() =>
                alert(
                  "In real event it will open google map with this location",
                )
              }
            >
              <MapPinIcon2 className="w-5 h-5" />
              <span className="truncate">{eventStore.location}</span>
            </Button>
            <p className="whitespace-nowrap">
              {eventStore.startTime ? eventStore.startTime : "08:00"} -{" "}
              {eventStore.endTime ? eventStore.endTime : "18:00"}
            </p>
            {/* <p className="whitespace-nowrap">{renderAverageTimes()}</p> */}
            {/* <p className="whitespace-nowrap">{renderMinMaxTimes()}</p> */}
          </div>
          {/* Placeholder for TruncatedText */}
          <p className="whitespace-pre-wrap">{eventStore.description}</p>
          <p className="text-blue-500 underline">
            {eventStore.UrlTitle || eventStore.UrlLink}
          </p>
        </div>
      </div>
    </>
  );
};

export default CreateEventPreview;
