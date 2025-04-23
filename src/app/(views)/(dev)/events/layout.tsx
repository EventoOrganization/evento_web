// src/app/(views)/(dev)/events/layout.tsx
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Events discover",
  description:
    "Find exclusive events near you, tailored to your interests, on Evento. Explore curated gatherings, discover unique experiences, and connect with like-minded people through this intuitive event discovery app",
};
const layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default layout;
