"use client";
// import Hero from "@/features/home/Hero";
// import HowItWorks from "@/features/home/HowItWorks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default async function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("https://join-evento-waitlist.squarespace.com");
  }, []);

  return (
    <>
      {/* <Hero />
      <HowItWorks /> */}
    </>
  );
}
