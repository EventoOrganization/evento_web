import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Chats",
  description:
    "Stay connected with Evento’s integrated chat. Seamlessly coordinate event details, share updates, and engage attendees—all through a user-friendly event app designed for effortless communication.",
};
export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
