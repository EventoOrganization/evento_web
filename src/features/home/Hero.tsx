import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <Section className="h-screen items-center gap-10 bg-purple-50 p-0 max-w-screen">
      {/* Texte de la section */}
      <div className="grid grid-cols-2">
        <div className="space-y-5 pl-4 md:px-6 flex flex-col justify-center">
          <h1 className="text-4xl sm:text-5xl lg:text-8xl font-bold text-eventoPurpleDark flex flex-wrap">
            Create,
            <br /> Discover,
            <br /> Connect
          </h1>
          <h2 className="text-xl  lg:text-2xl text-eventoPurpleDark font-extralight">
            All your events in one place with{" "}
            <strong className="text-eventoPurple font-bold">Evento</strong>
          </h2>
          <Button className="bg-evento-gradient text-white hover:opacity-80 md:text-2xl md:py-8 hidden md:flex">
            <Link href="/create-event">Create an event today!</Link>
          </Button>
        </div>

        {/* Image stylisée avec clip-path */}
        <div className="relative flex justify-center items-center md:px-6">
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
      <Button className="bg-evento-gradient text-white hover:opacity-80 md:text-2xl md:py-8 md:hidden ">
        <Link href="/create-event">Create an event today!</Link>
      </Button>
    </Section>
  );
};

export default Hero;
