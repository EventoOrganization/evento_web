"use client";

import SmartImage from "@/components/SmartImage";
import TruncatedText from "@/components/TruncatedText";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import { cn } from "@/lib/utils";
import { useCreateEventStore } from "@/store/useCreateEventStore";
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
  const eventStore = useCreateEventStore();
  const { user } = useSession();
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

    const isSameDay = end.getTime() - start.getTime() < 24 * 60 * 60 * 1000;

    if (isSameDay) {
      return `${formatDate(startDate, true, true)}`;
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
          "bg-background md:border md:shadow rounded p-4 w-full grid grid-cols-1 h-fit gap-4 hover:shadow-xl hover:bg-slate-50 cursor-pointer relative",
          className,
          { "lg:grid-cols-2 items-start gap-10": inModal },
        )}
      >
        <div className="flex items-center justify-between ">
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2 items-center">
                {user && user?.profileImage ? (
                  <SmartImage
                    src={user?.profileImage || ""}
                    alt="user image"
                    width={30}
                    height={30}
                    className="w-8 h-8 rounded-full"
                    forceImg
                  />
                ) : (
                  <Avatar>
                    <AvatarImage
                      src={"/evento-logo.png"}
                      className="rounded-full w-8 h-8"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <h4 className="text-sm">
                    {(eventStore &&
                      eventStore?.username &&
                      eventStore?.username.charAt(0).toUpperCase() +
                        eventStore?.username.slice(1)) ||
                      "Username"}
                  </h4>
                  <span className="text-xs text-muted-foreground">Host</span>
                </div>
              </div>
            </div>
            <CreateEventCarousel />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3>{eventStore.title ? eventStore.title : "Event Title"}</h3>
          <ul className="flex gap-2 flex-wrap ">
            {eventStore.interests &&
              eventStore.interests.map((interest: any, index: number) => (
                <li
                  key={index}
                  onClick={() =>
                    handleRemoveInterest && handleRemoveInterest(interest._id)
                  }
                  className="border  w-fit px-2 py-1 rounded-lg text-sm"
                >
                  {interest.name}
                </li>
              ))}
          </ul>
          <div className="flex gap-2 items-center">
            <span className="whitespace-nowrap text-eventoPurpleDark font-bold">
              {eventStore.date ? renderDate() : "Date"}
            </span>
            <p className="text-sm text-muted-foreground">
              {eventStore.startTime ? eventStore.startTime : "08:00"}
              {`${eventStore.endTime ? "- " + eventStore.endTime : ""}`}
            </p>
          </div>
          {/* <MapPinIcon2 className="w-5 h-5" /> */}
          <span
            className="truncate text-muted-foreground text-sm"
            onClick={() =>
              alert("In real event it will open google map with this location")
            }
          >
            {eventStore.location}
          </span>

          {/* <p className="whitespace-nowrap">{renderAverageTimes()}</p> */}
          {/* <p className="whitespace-nowrap">{renderMinMaxTimes()}</p> */}

          {/* Placeholder for TruncatedText */}
          {eventStore.description && (
            <Label htmlFor="description">Description</Label>
          )}
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">
            {eventStore.description}
          </p>

          <TruncatedText
            isLink
            className="text-eventoPink"
            text={eventStore.UrlTitle || eventStore.UrlLink || ""}
          />
        </div>
      </div>
    </>
  );
};

export default CreateEventPreview;
