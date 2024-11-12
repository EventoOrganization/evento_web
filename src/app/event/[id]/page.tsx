import EventIdTabs from "@/features/event/components/EventIdTabs";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Event",
  description: "Join this amazing event on Evento",
};
const EventPage = () => {
  return (
    <>
      <EventIdTabs />
    </>
  );
};

export default EventPage;
