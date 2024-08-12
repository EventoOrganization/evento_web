// import Image from "next/image";
// import { Button } from "@nextui-org/react";
import Title from "@/components/ui/partials/title";
import Address from "@/components/ui/partials/address";
import Search from "@/components/ui/partials/search";
import Content from "@/components/ui/Content";
import NavbarApp from "@/components/ui/Navbar";

export default function Home() {
  return (
    <>
      <div className="min-h-screen bg-slate-300">
        <div className="mx-auto bg-slate-100">
          <Title />
          <div className="ml-1 mr-1">
            <Address />
            <Search />
          </div>
          <div className="m-1">
            <Content />
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50 mx-10 mb-2 rounded-full md:rounded-full">
        <NavbarApp />
      </div>
    </>
  );
}
