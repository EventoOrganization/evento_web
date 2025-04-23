import ChatbotComponent from "@/components/ChatbotComponent";
import Footer from "@/components/layout/Footer";
import { cn } from "@nextui-org/theme";
import React from "react";

const CustomLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className={cn("pb-14 md:pb-28 min-h-screen")}>
      {children}
      <Footer />
      <ChatbotComponent />
    </main>
  );
};

export default CustomLayout;
