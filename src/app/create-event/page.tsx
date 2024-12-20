import CreateEventContent from "@/features/create-event/CreateEventContent";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Create Event",
  description:
    "Effortlessly create events tailored to your needs with Evento. Set details, invite guests, track RSVPs, and engage via integrated chat, ensuring seamless event hosting and stress-free management",
};
const page = () => {
  return (
    <div className="max-w-7xl">
      <CreateEventContent />
    </div>
  );
};

export default page;
