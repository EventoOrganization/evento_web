import ChatPageContent from "@/features/chat/components/ChatPageContent";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Chats",
  description:
    "Stay connected with Evento’s integrated chat. Seamlessly coordinate event details, share updates, and engage attendees—all through a user-friendly event app designed for effortless communication.",
};
const page = () => {
  return <ChatPageContent />;
};

export default page;
