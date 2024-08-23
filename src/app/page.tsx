import ComingSoon from "@/components/ComingSoon";
import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Section className="h-screen bg-evento-gradient gap-10 text-white">
        <div className="z-10 flex flex-col justify-center items-center mb-10">
          <Image src={"/logo.png"} alt="logo" width={138} height={45} />
          <h1 className=" text-4xl font-bold z-10">EVENTO</h1>
          <h2 className="">Find events for you</h2>
          <p className="text-justify mt-10">
            Create and share your events and see what&apos;s happening near you!
          </p>
        </div>
        <Image
          src={"/hero-bg.jpg"}
          alt="logo"
          width={1980}
          height={1024}
          className="h-full object-cover object-center  absolute opacity-20"
        />
        <div className="z-10 flex gap-4 flex-col md:flex-row">
          <Button
            variant="outline"
            className={cn(
              "bg-white rounded-full text-xs self-center px-8 border-none  text-[#7858C3]",
            )}
          >
            <Link href="/create-event">Create Event</Link>
          </Button>
          <Button
            variant="outline"
            className={cn(
              "bg-muted rounded-full text-xs self-center px-8 border-none  text-[#7858C3]",
            )}
          >
            <Link href="#event">Discover events</Link>
          </Button>
        </div>
      </Section>
      <Section className="" id="event">
        <ComingSoon message="Section avec les event" />
      </Section>
    </>
  );
}
