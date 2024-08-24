import AvatarStack from "@/components/AvatarStack";
import TruncatedText from "@/components/TruncatedText";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useEventStore } from "@/store/useEventStore";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { MapPin } from "lucide-react";
import Image from "next/image";
import EventActionIcons from "./EventActionIcons";

const Event = ({ className, event }: { className?: string; event?: any }) => {
  const createEvent = useEventStore((state) => state);
  const user = useAuthStore((state) => state.user);
  const startDate = new Date(event?.details.date);
  const formattedStartDate = startDate.toLocaleDateString("en-US", {
    weekday: "short", // Affiche le jour de la semaine (ex: Wed)
    year: "numeric", // Affiche l'année (ex: 2024)
    month: "short", // Affiche le mois (ex: Aug)
    day: "numeric", // Affiche le jour (ex: 21)
  });

  return (
    <div
      className={cn(
        "bg-muted border shadow rounded p-4 w-full flex flex-col h-fit gap-4 md:min-w-96",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {event?.user.profileImage ? (
            <Image
              src={event.user.profileImage}
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
          <h4 className="ml-2">{event ? event?.user.name : user?.name}</h4>
        </div>
        <span className="ml-4">
          {event ? formattedStartDate : createEvent?.date}
        </span>
      </div>
      <div className="bg-evento-gradient">
        <Image
          src={
            event?.details.images[0] ||
            "https://evento-media-bucket.s3.ap-southeast-2.amazonaws.com/evento-bg.jpg"
          }
          alt="event image"
          width={50}
          height={50}
          layout="responsive"
          className={cn({ "opacity-20": !event?.details.images[0] })}
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3>{event ? event?.title : createEvent?.title}</h3>
        <ul className="flex gap-2 flex-wrap">
          {event?.interest.map((interest: any) => (
            <li
              key={interest._id}
              className="bg-eventoPurple/30 w-fit px-2 py-1 rounded-lg"
            >
              {interest.name}
            </li>
          ))}
        </ul>
        <div className="flex justify-between">
          <Button
            variant={"ghost"}
            className="flex gap-2 pl-0"
            onClick={() => {
              alert("Ouvrira google map, in progress...");
            }}
          >
            <MapPin fill="#7858C3" className="text-muted" />
            {event?.details.location}
          </Button>
          <p>
            {event?.details.startTime} - {event?.details.endTime}
          </p>
        </div>
        <TruncatedText text={event?.details.description} />
      </div>
      <div className="flex justify-between items-center">
        <div>
          <AvatarStack eventId={event?._id} />{" "}
        </div>
        <EventActionIcons event={event} />
      </div>
    </div>
  );
};

export default Event;
