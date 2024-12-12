import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  return (
    <Section className={sectionStyle}>
      <h4 className="font-medium">
        {title} ({events?.length || 0})
      </h4>
      <div
        className={cn(
          "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full gap-2",
        )}
      >
        {events && events.length > 0 ? (
          events.map((event: any, index: number) => (
            <EventPreview key={index} event={event} title={title} />
          ))
        ) : !pathname.startsWith("/profile/") ? (
          <Button
            className="w-fit bg-evento-gradient text-white"
            variant="outline"
            asChild
          >
            <Link
              href={title === "Events Hosting" ? "/create-event" : "/discover"}
            >
              {title === "Events Hosting"
                ? "Create your event !"
                : "Find events you’ll love !"}
            </Link>
          </Button>
        ) : (
          <p>{noEventsMessage}</p>
        )}
      </div>
    </Section>
  );
};

export default EventSection;
