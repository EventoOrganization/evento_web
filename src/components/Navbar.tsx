"use client";
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
    <div className="w-full flex justify-center">
      <nav className="fixed bottom-6 bg-background z-20 rounded-lg flex justify-evenly w-full shadow max-w-80 md:max-w-2xl mx-auto py-2 md:py-4 h-fit items-center">
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

        <Link href="/tchat" className="relative group">
          <TchatIcon
            pathname={pathname === "/tchat"}
            className="md:w-8 md:h-8"
          />
          {/* <span className="absolute left-1/2 border shadow -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Messaging
          </span> */}
        </Link>
      </nav>
    </div>
  );
}
