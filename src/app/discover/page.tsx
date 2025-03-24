import DiscoverPageContent from "@/features/discover/DiscoverPageContent";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Discover",
  description:
    "Find exclusive events near you, tailored to your interests, on Evento. Explore curated gatherings, discover unique experiences, and connect with like-minded people through this intuitive event discovery app",
};
const page = () => {
  return (
    <div className="max-w-7xl">
      <DiscoverPageContent />
    </div>
  );
};

export default page;
