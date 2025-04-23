import ProfileSettingsContent from "@/features/profile/ProfileSettingsContent";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings on Evento",
};
const page = () => {
  return <ProfileSettingsContent />;
};

export default page;
