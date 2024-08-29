import BackButton from "@/components/BackButton";
import Header from "@/components/layout/Header";
import Main from "@/components/layout/Main";
import NavbarApp from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "@/contexts/SessionProvider";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Evento",
  description: "Evento PWA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={cn(inter.className, "relative")}>
        <SessionProvider>
          <Toaster position="top-center" />
          <BackButton />
          <Header />
          <Main className="pb-28 md:pt-28">{children}</Main>
          <NavbarApp />
        </SessionProvider>
      </body>
    </html>
  );
}
