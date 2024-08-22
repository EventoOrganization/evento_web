"use client";

import useOnScroll from "@/hooks/useOnScroll";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
export const Header = () => {
  const pathname = usePathname();
  const scrollY = useOnScroll();
  return (
    <header
      className={cn("p-6 z-10 fixed w-full text-white", {
        "p-2 bg-evento-gradient": scrollY > 0,
      })}
    >
      <div className="mx-auto max-w-screen-lg h-fit">
        <div className="flex flex-wrap items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="logo" width={45} height={45} />
            <h2 className="flex items-center text-xl font-semibold my-0">
              EVENTO
            </h2>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
