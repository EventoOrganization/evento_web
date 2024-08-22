// import Image from "next/image";
// import { Button } from "@nextui-org/react";
//import GetCurrentLocation from "@/components/map/GetCurrentLocation";
//import Address from "@/components/ui/partials/address";
import NavbarApp from "@/components/ui/Navbar";
//import LocationPicker from "@/components/map/LocationPicker";

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-evento-gradient">
        <div className="mx-auto bg-slate-100">
          {/* <Title /> */}
          <div className="ml-1 mr-1">
            {/* <LocationSelector /> */}
            {/* <Address /> */}
            {/* <Search /> */}
          </div>
          <div className="m-1">{/* <Content /> */}</div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50 mx-10 mb-2 rounded-full md:rounded-full">
        <NavbarApp />
      </div>
    </>
  );
}
