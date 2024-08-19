// import Image from "next/image";
// import { Button } from "@nextui-org/react";
//import GetCurrentLocation from "@/components/map/GetCurrentLocation";
import Title from "@/components/ui/partials/title";
//import Address from "@/components/ui/partials/address";
import Search from "@/components/events/Search";
import NavbarApp from "@/components/ui/Navbar";
//import LocationPicker from "@/components/map/LocationPicker";
import { auth } from "@/auth";
import Filter from "@/components/events/Filter";
import Tabs from "@/components/events/Tabs";
import LocationSelector from "@/components/map/LocationSelector";
//import { Session } from "@/types/user";

export default async function Home() {
  const session = await auth();
  console.log("session...", session?.user?.data?.token);

  return (
    <>
      <div className="min-h-screen bg-slate-300">
        <div className="mx-auto bg-slate-100">
          <Title />
          <div className="ml-1 mr-1">
            <LocationSelector />
            <Search />
            <Filter />
          </div>
          <div className="m-1">
            <Tabs />
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50 mx-10 mb-2 rounded-full md:rounded-full">
        <NavbarApp />
      </div>
    </>
  );
}
