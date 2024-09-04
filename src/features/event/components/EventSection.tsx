import Section from "@/components/layout/Section";
import { cn } from "@/lib/utils";
import EventPreview from "./EventPreview";
const EventSection = ({
  title,
  events,
  sectionStyle,
  noEventsMessage,
}: any) => {
  // Unifier la structure des événements pour qu'ils soient tous dans le même format
  // const processedEvents = events.map((event: any) =>
  //   event.eventId ? event.eventId : event,
  // );

  // console.log(title, processedEvents);

  return (
    <Section className={sectionStyle}>
      <h3 className="font-bold text-lg">
        {title} ({events?.length || 0})
      </h3>
      <div
        className={cn(
          "flex flex-col gap-4  md:overflow-x-auto w-full overflow-y-auto",
          {
            "md:grid md:grid-cols-2 lg:grid-cols-3":
              events && events.length > 0,
          },
        )}
      >
        {events && events.length > 0 ? (
          events.map((event: any, index: number) => (
            <EventPreview key={index} event={event} />
          ))
        ) : (
          <p>{noEventsMessage}</p>
        )}
      </div>
    </Section>
  );
};

export default EventSection;
