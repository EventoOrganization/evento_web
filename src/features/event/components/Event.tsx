import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import Link from "next/link";

const Event = ({
  classname,
  key,
  event,
}: {
  classname?: string;
  key: number;
  event: any;
}) => {
  console.log("event", event);
  console.log("key", key);

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
      <Image
        src={event.details.images[0] || ""}
        alt="event image"
        width={500}
        height={300}
        className="bg-red-500 ratio-16/9 h-auto w-full"
      />
      <h3>{event.title}</h3>
      <ul>
        {event.interest.map((interest: any) => (
          <li key={interest._id}>{interest.name}</li>
        ))}
      </ul>
      <h4>Date & time</h4>
      <p>{formattedStartDate}</p>

      <p>
        {event.details.startTime} - {event.details.endTime}
      </p>
      <h4>Location</h4>
      <p>{event.details.location}</p>
      <Button>Maps</Button>
      <p>{event.details.description}</p>
      <Button>Join</Button>
      <Button>refuse</Button>
      <Button>book</Button>
      <Link href="#">download to calendar</Link>
    </div>
  );
};

export default Event;
