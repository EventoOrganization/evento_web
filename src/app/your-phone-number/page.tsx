"use client";
import BackButton from "@/components/ui/BackButton";
import CustomButton from "@/components/ui/CustomButton";
import {
  Input,
  Link,
  Autocomplete,
  AutocompleteItem,
  Avatar,
} from "@nextui-org/react";
import React from "react";

export default function page() {
  return (
    <>
      <div className="bg-white h-screen">
        <div className="p-9 w-full max-w-lg mx-auto">
          <div className="mt-16">
            <BackButton />
          </div>
          <div className="text-3xl font-bold mt-8">Your phone number</div>
          <div className="text-xs text-slate-300 mt-2.5">
            Your phone number will remain private, no one will see it
          </div>
          <div className="mt-16 items-center flex justify-center bg-default-100 rounded-lg">
            <Autocomplete className="w-60" defaultSelectedKey="USA" size="lg">
              <AutocompleteItem
                key="USA"
                startContent={
                  <Avatar
                    alt="USA"
                    className="w-6 h-6"
                    src="https://flagcdn.com/us.svg"
                  />
                }
              >
                USA
              </AutocompleteItem>
              <AutocompleteItem
                key="Viet Nam"
                startContent={
                  <Avatar
                    alt="Viet Nam"
                    className="w-6 h-6"
                    src="https://flagcdn.com/vn.svg"
                  />
                }
              >
                Viet Nam
              </AutocompleteItem>
            </Autocomplete>
            <Input placeholder="Phone Number" size="lg" name="PhoneNumber" />
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
