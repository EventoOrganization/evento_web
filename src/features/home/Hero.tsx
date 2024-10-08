import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
const Hero = () => {
  return (
    <>
      <div className="bg-evento-gradient h-screen w-full inset-0 object-cover object-center  absolute opacity-90"></div>
      <Image
        src={
          "https://evento-media-bucket.s3.ap-southeast-2.amazonaws.com/evento-bg.jpg"
        }
        alt="evento-background"
        width={250}
        height={50}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="h-screen w-screen inset-0 object-cover object-center  absolute opacity-20"
      />
      <Section className="h-screen gap-10 text-white">
        <div className="z-10 flex flex-col justify-center items-center mb-10">
          <Image
            src={"/logo.png"}
            alt="logo"
            width={138}
            height={45}
            style={{ maxWidth: "100%", height: "auto" }}
            priority
          />
          <h1 className=" text-4xl font-bold z-10">EVENTO</h1>
          <h2 className="">Find events for you</h2>
          <p className="text-justify mt-10">
            Create and share your events and see what&apos;s happening near you!
          </p>
        </div>

        <div className="z-10 flex gap-4 flex-col md:flex-row mb-10">
          <Button
            variant="outline"
            className={cn(
              "bg-white  text-xs self-center px-8 border-none  text-[#7858C3]",
            )}
          >
            <Link href="/create-event">Create your Event!</Link>
          </Button>
        </div>
      </Section>
    </>
  );
};

export default Hero;
