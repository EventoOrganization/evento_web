"use client";
import SmartImage from "@/components/SmartImage";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/(prod)/SessionProvider";
import Link from "next/link";
import { useState } from "react";
import AuthModal from "../../components/system/auth/AuthModal";
const Hero = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const { user, isAuthenticated } = useSession();
  return (
    <BackgroundGradientAnimation className=" ">
      <div className="absolute z-10 inset-0 flex flex-col items-center justify-center text-white font-bold px-4  text-3xl md:text-4xl lg:text-7xl">
        <div className="p-4 w-full flex justify-between absolute top-0 items-center">
          <SmartImage
            src="/icon.png"
            alt="logo"
            width={50}
            height={50}
            className="object-contain"
            forceImg
          />
          <div className="flex gap-4">
            <Button variant={"eventoSecondary"} asChild>
              <Link href="/profile">My Events</Link>
            </Button>
            {!isAuthenticated ? (
              <Button
                onClick={() => setIsAuthModalOpen(true)}
                variant={"eventoSecondary"}
              >
                Sign-up
              </Button>
            ) : (
              <Link
                href={"/profile"}
                className="text-sm flex items-center gap-2"
              >
                <SmartImage
                  src={`${user?.profileImage}`}
                  width={30}
                  height={30}
                  alt={`${user?.username} profile image`}
                  className="rounded-full object-cover h-6 w-6"
                  forceImg
                />
                {user?.username}
              </Link>
            )}
          </div>
        </div>
        <div className=" flex flex-col justify-center px-6 gap-6 mb-6 animate-slideInLeft">
          <h1 className="text-secondary">
            Host effortlessly,
            <br /> connect meaningfully
          </h1>
          <h2 className="text-xl  md:text-2xl  font-extralight">
            Create events easily, discover new experiences, and grow your
            community – all in one platform
          </h2>
        </div>
        <Button
          variant={"eventoSecondary"}
          className=" hover:opacity-80 md:text-2xl md:py-8 px-10  w-fit"
        >
          <Link href="/events/create">CREATE YOUR FIRST EVENT</Link>
        </Button>
        {isAuthModalOpen && (
          <AuthModal
            onAuthSuccess={() => setIsAuthModalOpen(false)}
            onClose={() => setIsAuthModalOpen(false)}
          />
        )}
      </div>
    </BackgroundGradientAnimation>
  );
};

export default Hero;
