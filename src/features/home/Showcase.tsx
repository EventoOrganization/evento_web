import Section from "@/components/layout/Section";
import { Event } from "@/types/EventType";
import { cn } from "@nextui-org/theme";
import EventPreview from "../event/components/EventPreview";

const Showcase = ({ events }: { events: Event[] }) => {
  console.log(events);
  return (
    <Section>
      <h2>All Events</h2>
      <ul
        className={cn(
          "flex flex-col gap-4  md:overflow-x-auto w-full overflow-y-auto",
          {
            "md:grid md:grid-cols-2 lg:grid-cols-3":
              events && events.length > 0,
          },
        )}
      >
        {events &&
          events.map((event) => <EventPreview key={event._id} event={event} />)}
      </ul>
    </Section>
  );
};

export default Showcase;
