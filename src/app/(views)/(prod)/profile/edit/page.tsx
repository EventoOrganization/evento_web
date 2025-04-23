import ProfileEditContent from "@/features/profile/ProfileEditContent";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Edit Profile",
  description: "Edit your profile on Evento",
};
const page = () => {
  return <ProfileEditContent />;
};

export default page;
