import ProfilePageContent from "@/features/profile/ProfilePageContent";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Profile",
  description: "Discover and join amazing events on Evento",
};
const page = () => {
  return <ProfilePageContent />;
};

export default page;
