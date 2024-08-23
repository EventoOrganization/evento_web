import { Button } from "@nextui-org/react";
import React from "react";

export default function Tags() {
  return (
    <>
      <div>
        <p className="text-lg font-bold mb-5">Interests</p>
        <div className="flex flex-wrap gap-3 items-center">
          <Button radius="full" size="md">
            Weliness
          </Button>
          <Button radius="full" size="md">
            Fashion
          </Button>
          <Button radius="full" size="md">
            Festivals
          </Button>
          <Button radius="full" size="md">
            Technology
          </Button>
          <Button radius="full" size="md">
            Live Music
          </Button>
          <Button radius="full" size="md">
            Art
          </Button>
          <Button radius="full" size="md">
            Conferences
          </Button>
          <Button radius="full" size="md">
            Comedy
          </Button>
          <Button radius="full" size="md">
            Sports
          </Button>
          <Button radius="full" size="md">
            Running Club
          </Button>
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-50 mx-10 mb-2 rounded-full md:rounded-full">
          <div className="flex justify-center">
            <Button
              radius="full"
              className="bg-gradient-to-tr from-pink-500 to-blue-500 text-white shadow-lg px-10 text-sm"
              size="lg"
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
