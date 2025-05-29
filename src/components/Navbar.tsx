"use client";
import { UnreadBadge } from "@/app/(views)/(dev)/chats/components/UnreadBadge";
import { useSocket } from "@/app/(views)/(dev)/chats/contexts/SocketProvider";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import CreateEventIcon from "./icons/CreateEventIcon";
import DiscoverIcon from "./icons/DiscoverIcon";
import HomeIcon2 from "./icons/HomeIcon2";
import ProfileIcon from "./ProfileIcon";
import TchatIcon from "./TchatIcon";

export default function NavbarApp() {
  const { activeConversation } = useSocket();

  const pathname = usePathname();
  const isChatView = pathname.startsWith("/chat");
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isChatView && activeConversation && !isDesktop) return null;
  return (
    <nav
      key={pathname}
      className={cn(
        "fixed w-full bg-background z-20 h-24 justify-center gap-10 flex md:min-w-72 items-center left-1/2 bottom-0 -translate-x-1/2  ",
        "transition-all duration-500 ease-in-out",
        !isChatView ? " max-w-md sm:rounded-t-xl border-2" : "h-16 border-t",
      )}
    >
      <Link href="/" className="relative group">
        <HomeIcon2 pathname={pathname === "/"} className="w-6 h-6" />
        <span className="hidden md:block absolute left-1/2 border shadow -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden text-ellipsis w-max">
          Back to home
        </span>
      </Link>

      <Link href="/events" className="relative group">
        <DiscoverIcon pathname={pathname === "/events"} className="w-6 h-6" />
        <p className="hidden md:block absolute left-1/2 border bg-white shadow -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden text-ellipsis w-max">
          Discover events
        </p>
      </Link>

      <Link href="/events/create" className="relative group">
        <CreateEventIcon
          pathname={pathname === "/events/create"}
          className="w-6 h-6"
        />
        <span className="hidden md:block absolute left-1/2 border shadow -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden text-ellipsis w-max">
          Create an event
        </span>
      </Link>

      <Link href="/profile" className="relative group">
        <ProfileIcon pathname={pathname === "/profile"} className="w-6 h-6" />
        <span className="hidden md:block absolute left-1/2 border shadow -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden text-ellipsis w-max">
          Your profile
        </span>
      </Link>

      <Link href="/chats" className="relative group">
        <TchatIcon pathname={pathname === "/chats"} className="w-6 h-6" />
        <span className="hidden md:block absolute left-1/2 border shadow -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden text-ellipsis w-max">
          Chat
        </span>
        <UnreadBadge className="absolute -top-2 -right-2" />
      </Link>
    </nav>
  );
}
