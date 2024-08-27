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
import { useAuthStore } from "@/store/useAuthStore";
import { useEventStore } from "@/store/useEventStore";
import Image from "next/image";
const EventPreview = ({
  className,
  event,
}: {
  className?: string;
  event?: any;
}) => {
  const createEvent = useEventStore((state) => state);
  const user = useAuthStore((state) => state.user);
  // console.log(event);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };
  return (
    <Card className="relative flex flex-col justify-between aspect-square bg-evento-gradient">
      <CardHeader>
        <CardTitle></CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <Image
          src={event.details.images[0]}
          alt="Event Image"
          width={245}
          height={245}
          className="w-full inset-0 h-full absolute object-cover"
        />
      </CardContent>
      <CardFooter className="p-0 h-32  bg-black/60 font-bold text-white z-10">
        <ul className=" p-5 flex flex-col justify-center w-full h-full">
          <li className="flex gap-5 items-center">
            <CalendarIcon strokeWidth={3} className="w-6" />
            {formatDate(event.details.date)}
          </li>
          <li className="flex gap-5 items-center">
            <MapPinIcon strokeWidth={1.5} className="min-w-6 w-6" />
            {event.details.location}
          </li>
        </ul>
      </CardFooter>
    </Card>
  );
};

export default EventPreview;
