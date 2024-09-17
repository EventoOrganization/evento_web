import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import EventPreview from "./EventPreview";
const EventSection = ({
  title,
  events,
  sectionStyle,
  noEventsMessage,
}: {
  title: string;
  events?: any[];
  sectionStyle?: string;
  noEventsMessage?: string;
}) => {
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
          <Button className="w-fit" variant="outline" asChild>
            <Link href="/create-event">
              Create your first event!{" "}
              <span className="sr-only">{noEventsMessage}</span>
            </Link>
          </Button>
        )}
      </div>
    </Section>
  );
};

export default EventSection;
