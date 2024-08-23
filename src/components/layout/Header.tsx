"use client";

import useOnScroll from "@/hooks/useOnScroll";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { eventoBtn } from "@/styles/eventoBtn";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
export const Header = () => {
  const pathname = usePathname();
  const scrollY = useOnScroll();
  const user = useAuthStore((state) => state.user);
  console.log("user", user);

  return (
    <header
      className={cn(
        "p-6 z-20 fixed w-full transition-all duration-300 ease-in-out text-white hidden md:flex",
        {
          "p-2 bg-evento-gradient": scrollY > 0,
          "bg-evento-gradient": pathname !== "/",
        },
      )}
    >
      <div className="mx-auto w-full max-w-screen-lg h-fit flex justify-between items-center">
        <div className="flex flex-wrap items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="logo" width={45} height={45} />
            <h2 className="flex items-center text-xl font-semibold my-0">
              EVENTO
            </h2>
          </Link>
        </div>
        <div className=" gap-4 font-semibold text-xs  flex">
          <Button
            className={cn(eventoBtn, "", {
              "bg-background text-[#7858C3]": scrollY > 0,
            })}
            variant={"outline"}
          >
            <Link href="/create-event">Create Event</Link>
          </Button>
          {user ? (
            <Button
              className={cn(
                "bg-muted rounded-full text-xs self-center px-8 border-none  text-[#7858C3]",
              )}
              variant={"outline"}
            >
              <Link href="/profile">{user?.name ? user.name : "Profile"}</Link>
            </Button>
          ) : (
            <Button
              className={cn(
                "bg-muted rounded-full text-xs self-center px-8 border-none  text-[#7858C3]",
              )}
              variant={"outline"}
            >
              <Link href="/signin">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
