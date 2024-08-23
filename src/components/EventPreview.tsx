import { Button } from "@/components/ui/button"; // Assurez-vous que vous utilisez le bouton de shadcn
import { useEventStore } from "@/store/useEventStore";
import { cn } from "@nextui-org/theme";
import Section from "./layout/Section";

const EventPreview = ({ classname }: { classname?: string }) => {
  const event = useEventStore((state) => state);
  return (
    <Section
      className={cn(
        " p-4 rounded-lg shadow-lg mx-auto border bg-muted",
        classname,
      )}
    >
      <div className="flex items-center mb-4">
        {/* <Image
          src="/path/to/logo.png" // Remplacez par le chemin réel du logo
          alt="Satsuma House"
          width={40}
          height={40}
          className="rounded-full"
        /> */}
        <h2 className="ml-3 font-bold text-lg">
          {event.title || "Event Title"}
        </h2>
      </div>
      {/* <Image
        src="/path/to/event-image.jpg" // Remplacez par le chemin réel de l&apos;image de l&apos;événement
        alt="Outdoor Cinema - How to lose a guy in 10 days"
        width={600}
        height={300}
        className="rounded-lg mb-4"
      /> */}
      <div className="flex flex-col">
        <p>Type: {event.eventType}</p>
        <p>Organizer: {event.name}</p>
        <p>Mode: {event.mode}</p>
        <p>Date: {event.date}</p>
        <p>Start Time: {event.startTime}</p>
        <p>End Time: {event.endTime}</p>
        <p>Description: {event.description}</p>
        <p>Include Chat: {event.includeChat ? "Yes" : "No"}</p>
        <p>Create RSVP: {event.createRSVP ? "Yes" : "No"}</p>
      </div>
      <h3 className="font-bold text-xl mb-2">
        Outdoor Cinema - How to lose a guy in 10 days
      </h3>
      <div className="flex space-x-2 mb-4">
        <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs">
          Movies
        </span>
        <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs">
          Food & Drinks
        </span>
      </div>
      <div className="text-sm mb-4">
        <p className="font-bold">Date & Time</p>
        <p>Wednesday 21st August 2024</p>
        <p>7.00 PM - 9.00 PM</p>
      </div>
      <div className="text-sm mb-4">
        <p className="font-bold">Location</p>
        <p>Satsuma House, Thao Dien</p>
        <Button className="mt-2 bg-blue-500 text-white">
          Google Directions
        </Button>
      </div>
      <p className="text-sm mb-4">
        Get ready for a fun and light-hearted evening with "How to Lose a Guy in
        10 Days" Join us as we turn Saigon’s rainy days into a night filled with
        laughter and romance at our outdoor movie event. Don’t miss this
        charming experience!
      </p>
      <p className="text-sm font-bold mb-4">Secure your tickets now:</p>
      <ul className="text-sm mb-4">
        <li>- 300,000 VND | Movie + 1 Drink</li>
        <li>- 500,000 VND | Movie + Burger & Fries + 1 Drink</li>
      </ul>
      <p className="text-sm mb-4">
        To reserve, just send us a message with your name, number of guests,
        ticket type, and a screenshot of your payment to the following bank
        details:
      </p>
      <p className="text-sm font-bold mb-4">We can&apos;t wait to see you!</p>
      <div className="flex justify-evenly mt-6">
        <Button className="bg-gray-300 text-gray-700 p-2 rounded-full">
          <i className="icon-name" /> {/* Remplacez par l&apos;icône réelle */}
        </Button>
        <Button className="bg-gray-300 text-gray-700 p-2 rounded-full">
          <i className="icon-name" /> {/* Remplacez par l&apos;icône réelle */}
        </Button>
        <Button className="bg-gray-300 text-gray-700 p-2 rounded-full">
          <i className="icon-name" /> {/* Remplacez par l&apos;icône réelle */}
        </Button>
      </div>
      <Button className="mt-6 w-full bg-purple-500 text-white">
        Download to calendar
      </Button>
    </Section>
  );
};

export default EventPreview;
