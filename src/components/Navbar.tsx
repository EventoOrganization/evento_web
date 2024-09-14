"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CreateEventIcon from "./icons/CreateEventIcon";
import DiscoverIcon from "./icons/DiscoverIcon";
import HomeIcon2 from "./icons/HomeIcon2";
import ProfileIcon from "./ProfileIcon";
import TchatIcon from "./TchatIcon";

export default function NavbarApp() {
  const pathname = usePathname();
  return (
    <nav
      className={cn(
        "fixed w-full md:w-1/4 min-w-60 bottom-0 bg-background z-20 h-11 md:h-20 flex border justify-evenly  py-2 md:py-4 items-center",
        {
          "left-1/2 bottom-6 -translate-x-1/2 rounded-lg shadow max-w-80 md:w-full md:max-w-2xl":
            pathname !== "/chats",
        },
      )}
    >
      <Link href="/" className="relative group">
        <HomeIcon2 pathname={pathname === "/"} className="md:w-8 md:h-8" />
        {/* <span className="absolute left-1/2 border shadow -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Back to home
          </span> */}
      </Link>

      <Link href="/discover" className="relative group">
        <DiscoverIcon
          pathname={pathname === "/discover"}
          // fill="pink"
          className="md:w-8 md:h-8 "
        />
        {/* <span className="absolute left-1/2 border shadow -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Discover more events
          </span> */}
      </Link>

      <Link href="/create-event" className="relative group">
        <CreateEventIcon
          pathname={pathname === "/create-event"}
          className="md:w-8 md:h-8"
        />
        {/* <span className="absolute left-1/2 border shadow -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Create an event
          </span> */}
      </Link>

      <Link href="/profile" className="relative group">
        <ProfileIcon
          pathname={pathname === "/profile"}
          className="md:w-8 md:h-8"
        />
        {/* <span className="absolute left-1/2 border shadow -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Your profile
          </span> */}
      </Link>

      <Link href="/chats" className="relative group">
        <TchatIcon pathname={pathname === "/chats"} className="md:w-8 md:h-8" />
        {/* <span className="absolute left-1/2 border shadow -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Messaging
          </span> */}
      </Link>
    </nav>
  );
}
