import Section from "@/components/layout/Section";
import EventPreview from "./EventPreview";
const EventSection = ({
  title,
  events,
  sectionStyle,
  noEventsMessage,
}: any) => (
  <Section className={sectionStyle}>
    <h3 className="font-bold text-lg">
      {title} ({events?.length || 0})
    </h3>
    <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-x-auto w-full overflow-y-auto">
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

export default EventSection;
