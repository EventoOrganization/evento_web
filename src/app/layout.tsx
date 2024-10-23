import Main from "@/components/layout/Main";
import NavbarApp from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import GlobalDataProvider from "@/contexts/GlobalDataProvider";
import PWAProvider from "@/contexts/PWAProvider";
import { SessionProvider } from "@/contexts/SessionProvider";
import { SocketProvider } from "@/contexts/SocketProvider";
import { cn } from "@/lib/utils";
import { getSessionSSR } from "@/utils/authUtilsSSR";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Evento App",
    template: "%s - Evento",
  },
  description:
    "Evento - Organize and discover events easily with our intuitive app.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = getSessionSSR();
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={cn(inter.className, "relative bg-muted")}>
        <SessionProvider
          initialUser={session?.user}
          initialToken={session?.token}
        >
          <PWAProvider>
            <SocketProvider>
              <GlobalDataProvider>
                <Toaster />
                {/* <Header /> */}
                <Main className={cn("pb-28 px-0 lg:px-10 max-w-7xl mx-auto")}>
                  {children}
                </Main>
                <NavbarApp />
              </GlobalDataProvider>
            </SocketProvider>
          </PWAProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
