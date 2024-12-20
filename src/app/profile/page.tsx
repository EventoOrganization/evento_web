import ProfilePageContent from "@/features/profile/ProfilePageContent";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Profile",
  description:
    "Create a personalized Evento profile to discover tailored events, connect with like-minded attendees, and engage in meaningful social interactions. Build your event journey, stay updated on exclusive events, and start fostering lasting connections with our intuitive platform.",
};
const page = () => {
  return <ProfilePageContent />;
};

export default page;
