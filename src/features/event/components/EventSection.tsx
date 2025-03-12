import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/SessionProvider";
import PendingEvents from "@/features/profile/PendingEvents";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/store/useEventsStore";
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
  const { user } = useSession();
  const { eventsStatus } = useEventStore();
  const canSeePrivateEvent = (event: any) => {
    if (event.eventType === "public") {
      return true;
    }

    if (!user?._id) {
      console.log(`❌ L'utilisateur n'est pas connecté → Événement MASQUÉ`);
      return false;
    }

    const isHost = event.user?._id === user._id;
    const isCoHost = event.coHosts?.some(
      (coHost: any) => coHost.userId?._id === user._id,
    );
    const isGuest = event.guests?.some((guest: any) => guest._id === user._id);
    const isGoing = eventsStatus?.[event._id]?.isGoing === true;

    if (isHost) {
      return true;
    }
    if (isCoHost) {
      return true;
    }
    if (isGuest) {
      return true;
    }
    if (isGoing) {
      return true;
    }
    return false;
  };

  // 🔍 Filtrer les événements affichés
  const visibleEvents = events ? events.filter(canSeePrivateEvent) : [];
  return (
    <Section className={sectionStyle}>
      <div className="flex items-center w-full justify-between mb-4">
        <h4 className="font-medium">
          {title} ({events?.length || 0})
        </h4>
        {title === "Upcoming Events" && !pathname.startsWith("/profile/") && (
          <PendingEvents />
        )}
      </div>
      <div className={cn("grid grid-cols-2 sm:grid-cols-3  w-full gap-2")}>
        {visibleEvents && visibleEvents.length > 0 ? (
          visibleEvents.map((event: any, index: number) => (
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
