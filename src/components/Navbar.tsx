"use client";
// import { useSocket } from "@/contexts/(dev)/SocketProvider";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CreateEventIcon from "./icons/CreateEventIcon";
import DiscoverIcon from "./icons/DiscoverIcon";
import HomeIcon2 from "./icons/HomeIcon2";
import ProfileIcon from "./ProfileIcon";
import TchatIcon from "./TchatIcon";

export default function NavbarApp() {
  const pathname = usePathname();
  // const { activeConversation } = useSocket();
  const [isVisible, setIsVisible] = useState(true);
  // useEffect(() => {
  //   setIsVisible(!activeConversation);
  // }, [activeConversation]);

  return (
    <nav
      key={pathname}
      className={cn(
        "fixed w-full bg-background z-20 h-24  flex border-2 sm:rounded-t-xl justify-evenly md:min-w-72 md:py-4 items-center left-1/2 bottom-0 -translate-x-1/2  max-w-md",
        "transition-all duration-500 ease-in-out",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      <Link href="/" className="relative group">
        <HomeIcon2 pathname={pathname === "/"} className="w-6 h-6" />
        <span className="hidden md:block absolute left-1/2 border shadow -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden text-ellipsis w-max">
          Back to home
        </span>
      </Link>

      <Link href="/discover" className="relative group">
        <DiscoverIcon pathname={pathname === "/discover"} className="w-6 h-6" />
        <p className="hidden md:block absolute left-1/2 border bg-white shadow -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden text-ellipsis w-max">
          Discover events
        </p>
      </Link>

      <Link href="/create-event" className="relative group">
        <CreateEventIcon
          pathname={pathname === "/create-event"}
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
      </Link>
    </nav>
  );
}
