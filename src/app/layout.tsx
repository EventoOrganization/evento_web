import Main from "@/components/layout/Main";
import NavbarApp from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import GlobalDataProvider from "@/contexts/GlobalDataProvider";
import { PwaProvider } from "@/contexts/PwaProvider";
import { SessionProvider } from "@/contexts/SessionProvider";
import { SocketProvider } from "@/contexts/SocketProvider";
import { cn } from "@/lib/utils";
import { getSessionSSR } from "@/utils/authUtilsSSR";
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
  const session = getSessionSSR();
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={cn(inter.className, "relative bg-muted")}>
        <SessionProvider
          initialUser={session?.user}
          initialToken={session?.token}
        >
          <PwaProvider>
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
          </PwaProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
