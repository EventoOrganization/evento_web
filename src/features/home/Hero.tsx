"use client";
import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AuthModal from "../auth/components/AuthModal";

const Hero = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  return (
    <Section className="h-screen items-center p-0 max-w-screen bg-evento-gradient-button text-secondary relative">
      {/* Texte de la section */}
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
      <div className="flex ">
        <div className=" flex flex-col justify-center px-6 gap-6 mb-6">
          <h1 className="text-secondary">
            Host effortlessly,
            <br /> connect meaningfully
          </h1>
          <h2 className="text-xl  md:text-2xl  font-extralight">
            Create events easily, discover new experiences, and grow your
            community – all in one platform
          </h2>
          <Button
            variant={"eventoSecondary"}
            className=" md:text-2xl md:py-8 hidden md:flex"
          >
            <Link href="/create-event">CREATE YOUR FIRST EVENT </Link>
          </Button>
        </div>

        {/* Image stylisée avec clip-path */}
        <div className="relative md:flex justify-center items-center md:px-6 hidden ">
          <div
            className="overflow-hidden shadow-lg transition-transform duration-500 ease-in-out"
            style={{ clipPath: "polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)" }}
          >
            <Image
              src="https://evento-media-bucket.s3.ap-southeast-2.amazonaws.com/home_hero.jpg"
              alt="evento-background"
              width={500}
              height={700}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
      <Button
        variant={"eventoSecondary"}
        className=" hover:opacity-80 md:text-2xl md:py-8 md:hidden "
      >
        <Link href="/create-event">Create an event today!</Link>
      </Button>
      {isAuthModalOpen && (
        <AuthModal onAuthSuccess={() => setIsAuthModalOpen(false)} />
      )}
    </Section>
  );
};

export default Hero;
