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
                ? "Create your first event !"
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
