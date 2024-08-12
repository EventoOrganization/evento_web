import React from "react";
import { Navbar, NavbarContent, NavbarItem, Link } from "@nextui-org/react";
import HomeIcon from "../icons/HomeIcon";
import PlusIcon from "../icons/PlusIcon";
import UserIcon from "../icons/UserIcon";
import MessageIcon from "../icons/MessageIcon";
import CompassIcon from "../icons/CompassIcon";

export default function NavbarApp() {
  return (
    <Navbar className="rounded-full md:rounded-full">
      <NavbarContent
        className="flex gap-5 w-full"
        justify="center"
        text-align="center"
      >
        <NavbarItem>
          <Link color="foreground" href="#">
            <HomeIcon />
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page">
            <CompassIcon />
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            <PlusIcon />
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            <UserIcon />
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            <MessageIcon />
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
