// src/app/(views)/(dev)/events/layoutEvents.tsx
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Events discover",
  description:
    "Find exclusive events near you, tailored to your interests, on Evento. Explore curated gatherings, discover unique experiences, and connect with like-minded people through this intuitive event discovery app",
};
const layoutEvents = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:max-w-6xl mx-auto gap-2 md:gap-4 lg:gap-10 px-2 md:px-4 lg:px-10 ">
      {children}
    </div>
  );
};

export default layoutEvents;
