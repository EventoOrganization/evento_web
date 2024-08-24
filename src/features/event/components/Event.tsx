import AvatarStack from "@/components/AvatarStack";
import GoingIcon from "@/components/icons/GoingIncon";
import ShareIcon from "@/components/icons/ShareIcon";
import TruncatedText from "@/components/TruncatedText";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Bookmark, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Event = ({ classname, event }: { classname?: string; event: any }) => {
  // Convertir la date ISO en objet Date
  const startDate = new Date(event.details.date);

  // Formater la date en chaîne de caractères lisible
  const formattedStartDate = startDate.toLocaleDateString("en-US", {
    weekday: "short", // Affiche le jour de la semaine (ex: Wed)
    year: "numeric", // Affiche l'année (ex: 2024)
    month: "short", // Affiche le mois (ex: Aug)
    day: "numeric", // Affiche le jour (ex: 21)
  });
  return (
    <div
      className={cn(
        "bg-muted border shadow rounded p-4 w-full flex flex-col gap-4",
        classname,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {event.user.profileImage ? (
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
                src="https://github.com/shadcn.png"
                className="rounded-full w-6 h-6"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          )}
          <h4 className="ml-2">{event.user.name}</h4>
        </div>
        <span className="ml-4">{formattedStartDate}</span>
      </div>
      <div className="bg-evento-gradient">
        <Image
          src={
            event.details.images[0] ||
            "https://evento-media-bucket.s3.ap-southeast-2.amazonaws.com/evento-bg.jpg"
          }
          alt="event image"
          width={50}
          height={50}
          layout="responsive"
          className={cn({ "opacity-20": !event.details.images[0] })}
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3>{event.title}</h3>
        <ul>
          {event.interest.map((interest: any) => (
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
            {event.details.location}
          </Button>
          <p>
            {event.details.startTime} - {event.details.endTime}
          </p>
        </div>
        <TruncatedText text={event.details.description} />
      </div>
      <div className="flex justify-between">
        <div>
          <AvatarStack eventId={event._id} />{" "}
        </div>
        <div className="flex gap-2">
          <GoingIcon />
          <Bookmark
            className="text-eventoPurple"
            onClick={() => alert("Enregistrera dans calendar, in progress...")}
          />
          <ShareIcon />
        </div>
      </div>

      <Link href="#">download to calendar</Link>
    </div>
  );
};

export default Event;
