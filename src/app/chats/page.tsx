import ChatPageContent from "@/features/chat/components/ChatPageContent";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Chats",
  description: "Chat with your friends on Evento",
};
const page = () => {
  return <ChatPageContent />;
};

export default page;
