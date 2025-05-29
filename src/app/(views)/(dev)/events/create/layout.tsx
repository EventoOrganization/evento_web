import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Create Event",
  description:
    "Effortlessly create events tailored to your needs with Evento. Set details, invite guests, track RSVPs, and engage via integrated chat, ensuring seamless event hosting and stress-free management",
};
const layoutEventsCreate = ({ children }: { children: React.ReactNode }) => {
  return <div className="col-span-2">{children}</div>;
};

export default layoutEventsCreate;
