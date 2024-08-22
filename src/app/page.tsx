import Image from "next/image";
// import { Button } from "@nextui-org/react";
//import GetCurrentLocation from "@/components/map/GetCurrentLocation";
//import Address from "@/components/ui/partials/address";
import ComingSoon from "@/components/ComingSoon";
import Section from "@/components/layout/Section";
//import LocationPicker from "@/components/map/LocationPicker";

export default function Home() {
  return (
    <>
      <Section className="h-screen bg-evento-gradient text-white">
        <div className="opacity-0 bg-evento-gradient">
          <Image src={"/logo.png"} alt="logo" width={138} height={45} />
          <h1 className="text-white text-4xl absolute bottom-24">EVENTO</h1>
        </div>
        <h1 className=" text-4xl font-bold z-10">EVENTO</h1>
        <h2>Find events for you</h2>
        <p>Create and share your events and see what's happening near you!</p>
        <Image
          src={"/hero-bg.jpg"}
          alt="logo"
          width={1980}
          height={1024}
          className="h-full object-cover object-center  absolute opacity-20"
        />
      </Section>
      <Section className="">
        <ComingSoon message="Section avec les event" />
      </Section>
    </>
  );
}
