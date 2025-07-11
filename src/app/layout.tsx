import { SocketProvider } from "@/app/(views)/(dev)/chats/contexts/SocketProvider";
import CustomLayout from "@/components/layout/CustomLayout";
import AppInitializer from "@/components/system/AppInitializer";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "@/contexts/(prod)/SessionProvider";
import GoogleAnalytics from "@/features/googleAnalitics/GoogleAnalytics";
import { cn } from "@/lib/utils";
import { getSessionSSR } from "@/utils/authUtilsSSR";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script"; // ← import Script
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Evento",
    template: "%s - Evento",
  },
  description:
    "Evento is your go-to platform to create, discover events and connect with others. Whether you’re hosting intimate gatherings or exploring unique experiences, Evento simplifies RSVPs, chats, and event planning. With our user-friendly app, you have everything you need to organize memorable events and build lasting connections.",
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    url: "https://evento-app.io",
    title: "Evento",
    description: "Discover and plan events effortlessly with Evento.",
    siteName: "Evento",
    images: [
      {
        url: "https://evento-media-bucket.s3.ap-southeast-2.amazonaws.com/og-image.jpg",
        width: 1200,
        height: 675,
        alt: "Evento App - Discover Events",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@eventoapp",
    creator: "@eventoapp",
    title: "Evento",
    description: "Discover and plan events effortlessly with Evento.",
    images: [
      "https://evento-media-bucket.s3.ap-southeast-2.amazonaws.com/og-image.jpg",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = getSessionSSR();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://evento-app.io" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />

        {/* Google Tag Manager via next/script */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PDC6QLQN');
          `}
        </Script>
      </head>

      <body className={cn(inter.className, "relative bg-muted")}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PDC6QLQN"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <GoogleAnalytics />
        <SessionProvider
          sessionUser={session?.user || null}
          sessionToken={session?.token || null}
        >
          <SocketProvider>
            <AppInitializer />
            <Toaster />
            <TooltipProvider delayDuration={100}>
              <CustomLayout>{children}</CustomLayout>
            </TooltipProvider>
          </SocketProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
