// import Image from "next/image";
// import { Button } from "@nextui-org/react";
//import GetCurrentLocation from "@/components/map/GetCurrentLocation";
import Title from "@/components/ui/partials/title";
//import Address from "@/components/ui/partials/address";
import NavbarApp from "@/components/ui/Navbar";
//import LocationPicker from "@/components/map/LocationPicker";
import { auth } from "@/auth";

import HomeContainer from "@/components/events/Container";
//import { Session } from "@/types/user";

export default async function Home() {
  //const session = await auth();

  return (
    <>
      <div className="min-h-screen bg-slate-300">
        <div className="mx-auto bg-slate-100">
          <Title />
          <HomeContainer />
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50 mx-10 mb-2 rounded-full md:rounded-full">
        <NavbarApp />
      </div>
    </>
  );
}
