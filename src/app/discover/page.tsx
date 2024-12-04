import DiscoverPageContent from "@/features/discover/DiscoverPageContent";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Discover",
  description: "Find and join amazing events on Evento",
};
const page = () => {
  return (
    <div className="max-w-7xl">
      <DiscoverPageContent />;
    </div>
  );
};

export default page;
