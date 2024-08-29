"use server";
import Hero from "@/features/home/Hero";
import HowItWorks from "@/features/home/HowItWorks";
export default async function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
    </>
  );
}
