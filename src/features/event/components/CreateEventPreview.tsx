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
  inModal = false,
}: {
  inModal?: boolean;
  className?: string;
  handleRemoveInterest?: (interestId: string) => void;
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
      return `le ${formatDate(startDate)}`;
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
  // const renderAverageTimes = () => {
  //   if (eventStore.timeSlots.length === 0) return "No times available";

  //   let totalStartMinutes = 0,
  //     totalEndMinutes = 0;

  //   eventStore.timeSlots.forEach((slot) => {
  //     const startTime = parse(slot.startTime, "HH:mm", new Date());
  //     const endTime = parse(slot.endTime, "HH:mm", new Date());
  //     totalStartMinutes += differenceInMinutes(
  //       startTime,
  //       new Date(0, 0, 0, 0, 0),
  //     );
  //     totalEndMinutes += differenceInMinutes(endTime, new Date(0, 0, 0, 0, 0));
  //   });

  //   const averageStartMinutes = totalStartMinutes / eventStore.timeSlots.length;
  //   const averageEndMinutes = totalEndMinutes / eventStore.timeSlots.length;

  //   const averageStartTime = new Date(0, 0, 0, 0, averageStartMinutes);
  //   const averageEndTime = new Date(0, 0, 0, 0, averageEndMinutes);

  //   return `${format(averageStartTime, "HH:mm")} - ${format(averageEndTime, "HH:mm")}`;
  // };
  // const renderMinMaxTimes = () => {
  //   if (eventStore.timeSlots.length === 0) return "No times available";

  //   let minStartTime = "23:59";
  //   let maxEndTime = "00:00";

  //   eventStore.timeSlots.forEach((slot) => {
  //     if (slot.startTime < minStartTime) minStartTime = slot.startTime;
  //     if (slot.endTime > maxEndTime) maxEndTime = slot.endTime;
  //   });

  //   return `${minStartTime}min - ${maxEndTime}max`;
  // };
  return (
    <>
      <div
        className={cn(
          "bg-white border shadow rounded p-4 w-full grid grid-cols-1 h-fit gap-4 hover:shadow-xl hover:bg-slate-50 cursor-pointer relative",
          className,
          { "lg:grid-cols-2 items-start p-10 gap-10": inModal },
        )}
      >
        <div className="flex items-center justify-between ">
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2 items-center">
                {user?.profileImage ? (
                  <Image
                    src={user.profileImage}
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
                  {user && user.username
                    ? user.username
                    : eventStore.username || "Username"}
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
          <pre className="w-fullp-4 rounded">{eventStore.description}</pre>
          <p className="text-blue-500 underline">{eventStore.URL}</p>
        </div>
      </div>
    </>
  );
};

export default CreateEventPreview;
