import EzTag from "@ezstart/ez-tag";
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
  return (
    <EzTag
      as="div"
      className="fixed top-0 pb-16 h-screen w-full overflow-hidden"
    >
      {children}
    </EzTag>
  );
}
