import ChatbotComponent from "@/components/ChatbotComponent";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import React from "react";
import NavbarApp from "../Navbar";

const CustomLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className={cn("pb-14 md:pb-28 min-h-screen")}>
      {children}
      <Footer />
      <ChatbotComponent />
      <NavbarApp />
    </main>
  );
};

export default CustomLayout;
