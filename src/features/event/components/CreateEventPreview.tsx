"use client";

import MapPinIcon2 from "@/components/icons/MappPinIcon2";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/SessionProvider";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/store/useEventStore";
import Image from "next/image";
import CreateEventCarousel from "./CreateEventCarousel";
const CreateEventPreview = ({
  className,
  handleRemoveInterest,
}: {
  className?: string;
  handleRemoveInterest: (interestId: string) => void;
}) => {
  const eventStore = useEventStore();
  const { user } = useSession();
  // console.log(user);

  const renderDate = () => {
    const startDate = eventStore.date;
    const endDate = eventStore.endDate;
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return date.toLocaleDateString("en-US", options);
    };
    if (
      !endDate ||
      new Date(endDate).getTime() === new Date(startDate).getTime()
    ) {
      return `le ${formatDate(startDate)}`; // Single date
    } else {
      const startDay = new Date(startDate).getDate();
      const endDay = new Date(endDate).getDate();
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      const monthYear = startDateObj.toLocaleDateString("fr-FR", {
        month: "long",
        year: "numeric",
      });

      if (
        endDateObj.getHours() === 0 &&
        endDateObj.getMinutes() === 0 &&
        endDateObj.getSeconds() === 0
      ) {
        return `du ${startDay} au ${endDay - 1} ${monthYear}`;
      } else {
        return `du ${startDay} au ${endDay} ${monthYear}`;
      }
    }
  };
  // console.log(eventStore);

  return (
    <>
      <div
        className={cn(
          "bg-white border shadow rounded p-4 w-full flex flex-col h-fit gap-4 hover:shadow-xl hover:bg-slate-50 cursor-pointer relative",
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {user?.profileImage ? (
              <Image
                src={user.profileImage}
                alt="user image"
                width={500}
                height={500}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <Avatar>
                <AvatarImage
                  src={"https://github.com/shadcn.png"}
                  className="rounded-full w-6 h-6"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
            <h4 className="ml-2">
              {user && user.name ? user.name : eventStore.name || "Username"}
            </h4>
          </div>
          <span className="ml-4">
            {eventStore.date ? renderDate() : "Date"}
          </span>
        </div>
        <div>
          <CreateEventCarousel />
        </div>
        <div className="flex flex-col gap-2">
          <h3>{eventStore.title ? eventStore.title : "Event Title"}</h3>
          <ul className="flex gap-2 flex-wrap">
            {eventStore.interests &&
              eventStore.interests.map((interest: any, index: number) => (
                <li
                  key={index}
                  onClick={() => handleRemoveInterest(interest._id)}
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
          </div>
          {/* Placeholder for TruncatedText */}
          <div className="w-fullp-4 rounded">{eventStore.description}</div>
        </div>
      </div>
    </>
  );
};

export default CreateEventPreview;
