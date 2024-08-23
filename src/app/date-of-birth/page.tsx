"use client";
import BackButton from "@/components/ui/BackButton";
import CustomButton from "@/components/ui/CustomButton";
import { Button, Link } from "@nextui-org/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import React from "react";
import SelectorIcon from "@/components/icons/SelectorIcon";

export default function page() {
  return (
    <>
      <div className="bg-white">
        <div className="p-9 w-full max-w-lg mx-auto">
          <div className="mt-16">
            <BackButton />
          </div>
          <div className="text-3xl font-bold mt-8">Date of birth</div>
          <div className="text-xs text-slate-300 mt-2.5">
            With Evento you won't miss important birthdays!
          </div>
          <div className="mt-16">
            <div className="flex space-x-4">
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="w-32 bg-gray-100 text-gray-700 rounded-lg shadow-md text-base flex justify-between items-center px-1"
                    size="lg"
                  >
                    <span>Day</span>
                    <SelectorIcon />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu className="max-h-96 overflow-y-auto scrollbar-hide">
                  {[...Array(31)].map((_, i) => (
                    <DropdownItem key={i}>{i + 1}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>

              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="w-32 bg-gray-100 text-gray-700 rounded-lg shadow-md text-base flex justify-between items-center px-1"
                    size="lg"
                  >
                    <span>Month</span>
                    <SelectorIcon />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu className="max-h-96 overflow-y-auto scrollbar-hide">
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((month, i) => (
                    <DropdownItem key={i}>{month}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>

              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="w-32 bg-gray-100 text-gray-700 rounded-lg shadow-md text-base flex justify-between items-center px-1"
                    size="lg"
                  >
                    <span>Year</span>
                    <SelectorIcon />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu className="max-h-96 overflow-y-auto scrollbar-hide">
                  {[...Array(100)].map((_, i) => (
                    <DropdownItem key={i}>{2023 - i}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <div className="flex justify-center mt-16">
            <CustomButton size="lg" radius="full" gradient>
              Next
            </CustomButton>
          </div>
          <div className="flex justify-center mt-10">
            <Link href="#" className="text-slate-500">
              Skip to later
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
