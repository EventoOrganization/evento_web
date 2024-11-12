import CreateEventContent from "@/features/create-event/CreateEventContent";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Create Event",
  description: "Create an event on Evento",
};
const page = () => {
  return <CreateEventContent />;
};

export default page;
