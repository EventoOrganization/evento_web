import Header from "@/components/layout/Header";
import Main from "@/components/layout/Main";
import NavbarApp from "@/components/ui/Navbar";
import { Toaster } from "@/components/ui/sonner";
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
      <body className={inter.className}>
        <Toaster position="top-center" />
        <Header />
        <Main className="">{children}</Main>
        <NavbarApp />
      </body>
    </html>
  );
}
