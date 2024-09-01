"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/store/useEventStore";

const CreateEventPreview = ({ className }: { className?: string }) => {
  const eventStore = useEventStore();

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
  console.log(eventStore);

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
            {/* {eventStore.user?.profileImage ? (
              <Image
                src={eventStore.user.profileImage}
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
            )} */}
            <h4 className="ml-2">{eventStore.name || ""}</h4>
          </div>
          <span className="ml-4">{renderDate()}</span>
        </div>
        <div
        // className={cn("", { "bg-evento-gradient": eventStore.images?.[0] })}
        >
          <div>
            {/* Placeholder for RenderMedia */}
            <div className="bg-gray-200 w-full h-64 flex items-center justify-center">
              Media Placeholder
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3>{eventStore.title}</h3>
          <ul className="flex gap-2 flex-wrap">
            {/* {eventStore.interestId.map((interest: any, index: number) => (
              <li
                key={index}
                className="bg-eventoPurpleLight/30 w-fit px-2 py-1 rounded-lg text-sm"
              >
                {interest.name}
              </li>
            ))} */}
          </ul>
          <div className="flex justify-between items-center">
            <Button
              variant={"ghost"}
              className="flex gap-2 pl-0 max-w-xs truncate"
            >
              <span className="truncate">{eventStore.location}</span>
            </Button>
            <p className="whitespace-nowrap">
              {eventStore.startTime} - {eventStore.endTime}
            </p>
          </div>
          {/* Placeholder for TruncatedText */}
          <div className="bg-gray-200 w-full h-32 p-4 rounded">
            {eventStore.description}
          </div>
        </div>
        <div className="flex justify-between items-center">
          {/* Placeholder for AvatarStack */}
          <div className="bg-gray-200 w-20 h-20 rounded-full flex items-center justify-center">
            AvatarStack Placeholder
          </div>
          {/* Placeholder for EventActionIcons */}
          <div className="bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center">
            ActionIcons Placeholder
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateEventPreview;
