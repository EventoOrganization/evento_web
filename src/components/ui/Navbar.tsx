"use client";
import { cn } from "@nextui-org/theme";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CompassIcon from "../icons/CompassIcon";
import HomeIcon from "../icons/HomeIcon";
import MessageIcon from "../icons/MessageIcon";
import PlusIcon from "../icons/PlusIcon";
import UserIcon from "../icons/UserIcon";

export default function NavbarApp() {
  const pathname = usePathname();
  return (
    <div className="w-full flex justify-center md:hidden z-20">
      <nav className="fixed bottom-10 bg-background rounded-lg flex justify-evenly w-full shadow max-w-80 mx-auto h-12 items-center">
        <Link href="/">
          <HomeIcon
            className={cn(
              "hover:text-eventoBlue hover:opacity-80",
              pathname === "/"
                ? "text-eventoBlue"
                : "text-muted-foreground opacity-40",
            )}
          />
        </Link>
        <Link href="/explore">
          <CompassIcon
            className={cn(
              "hover:text-eventoBlue hover:opacity-80",
              pathname === "/explore"
                ? "text-eventoBlue"
                : "text-muted-foreground opacity-40",
            )}
          />
        </Link>
        <Link href="/create-event">
          <PlusIcon
            className={cn(
              "hover:text-eventoBlue hover:opacity-80",
              pathname === "/create-event"
                ? "text-eventoBlue"
                : "text-muted-foreground opacity-40",
            )}
          />
        </Link>
        <Link href="/profile">
          <UserIcon
            className={cn(
              "hover:text-eventoBlue hover:opacity-80",
              pathname === "/profile"
                ? "text-eventoBlue"
                : "text-muted-foreground opacity-40",
            )}
          />
        </Link>
        <Link href="/messages">
          <MessageIcon
            className={cn(
              pathname === "/message"
                ? "text-eventoBlue"
                : "text-muted-foreground opacity-40",
              "hover:text-eventoBlue hover:opacity-80",
            )}
          />
        </Link>
      </nav>
    </div>
  );
}
