"use client";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AuthModal from "../auth/components/AuthModal";
const Hero = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  return (
    <BackgroundGradientAnimation className=" ">
      <div className="absolute z-50 inset-0 flex flex-col items-center justify-center text-white font-bold px-4  text-3xl md:text-4xl lg:text-7xl">
        <div className="p-4 w-full flex justify-between absolute top-0 items-center">
          <Image
            src="/icon.png"
            alt="logo"
            width={50}
            height={50}
            className="object-contain"
            priority
          />
          <div className="flex gap-4">
            <Button variant={"eventoSecondary"} asChild>
              <Link href="/profile">My event </Link>
            </Button>
            <Button
              onClick={() => setIsAuthModalOpen(true)}
              variant={"eventoSecondary"}
            >
              Signup
            </Button>
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
          <Link href="/create-event">CREATE YOUR FIRST EVENT</Link>
        </Button>
        {isAuthModalOpen && (
          <AuthModal onAuthSuccess={() => setIsAuthModalOpen(false)} />
        )}
      </div>
    </BackgroundGradientAnimation>
  );
};

export default Hero;
