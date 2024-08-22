"use client";

import useOnScroll from "@/hooks/useOnScroll";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
export const Header = () => {
  const pathname = usePathname();
  const scrollY = useOnScroll();
  return (
    <header
      className={cn(
        "p-6 z-10 fixed w-full transition-all duration-300 ease-in-out text-white",
        {
          "p-2 bg-evento-gradient": scrollY > 0,
          "bg-evento-gradient": pathname !== "/",
        },
      )}
    >
      <div className="mx-auto max-w-screen-lg h-fit flex justify-between items-center">
        <div className="flex flex-wrap items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="logo" width={45} height={45} />
            <h2 className="flex items-center text-xl font-semibold my-0">
              EVENTO
            </h2>
          </Link>
        </div>
        <div className="flex gap-4 font-semibold text-xs text-[#7858C3] ">
          <Button className="rounded-full h-8 px-6" variant={"outline"}>
            <Link href="/create-event">Create Event</Link>
          </Button>
          <Button className="rounded-full h-8 px-6" variant={"outline"}>
            <Link href="/signin">Sign in</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
