"use client";
import { useSocket } from "@/contexts/SocketProvider";
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
  const pathname = usePathname();
  const { activeConversation } = useSocket();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (activeConversation) {
      setIsVisible(false); // Masque la navbar quand il y a une conversation active
    } else {
      setIsVisible(true); // Affiche la navbar si aucune conversation n'est active
    }
  }, [activeConversation]);

  return (
    <nav
      className={cn(
        "fixed w-full bg-background z-20 h-11 md:h-20 flex border justify-evenly md:min-w-72 md:py-4 items-center left-1/2 bottom-6 -translate-x-1/2 rounded-lg shadow max-w-80 md:w-full md:max-w-2xl",
        "transition-all duration-500 ease-in-out", // Transition fluide sur la disparition/apparition
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none", // Opacité avec gestion des événements (clics)
      )}
    >
      <Link
        href="https://join-evento-waitlist.squarespace.com/"
        target="_blank"
        className="relative group"
      >
        <HomeIcon2 pathname={pathname === "/"} className="w-8 h-8" />
        <span className="hidden md:block absolute left-1/2 border shadow -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden text-ellipsis w-max">
          Back to home
        </span>
      </Link>

      <Link href="/discover" className="relative group">
        <DiscoverIcon pathname={pathname === "/discover"} className="w-8 h-8" />
        <p className="hidden md:block absolute left-1/2 border bg-white shadow -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden text-ellipsis w-max">
          Discover events
        </p>
      </Link>

      <Link href="/create-event" className="relative group">
        <CreateEventIcon
          pathname={pathname === "/create-event"}
          className="w-8 h-8"
        />
        <span className="hidden md:block absolute left-1/2 border shadow -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden text-ellipsis w-max">
          Create an event
        </span>
      </Link>

      <Link href="/profile" className="relative group">
        <ProfileIcon pathname={pathname === "/profile"} className="w-8 h-8" />
        <span className="hidden md:block absolute left-1/2 border shadow -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden text-ellipsis w-max">
          Your profile
        </span>
      </Link>

      <Link href="/chats" className="relative group">
        <TchatIcon pathname={pathname === "/chats"} className="w-8 h-8" />
        <span className="hidden md:block absolute left-1/2 border shadow -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap overflow-hidden text-ellipsis w-max">
          Chat
        </span>
      </Link>
    </nav>
  );
}
