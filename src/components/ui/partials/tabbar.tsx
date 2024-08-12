"use client";
import React from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import Cardlist from "@/components/ui/partials/card";

export default function Tabbar() {
  const tabs = [
    {
      id: "All",
      label: "All",
      content: (
        <div className="flex flex-wrap gap-2 justify-center">
          <div className="flex-1/3">
            <Cardlist />
          </div>
          <div className="flex-1/3">
            <Cardlist />
          </div>
          <div className="flex-1/3">
            <Cardlist />
          </div>
          <div className="flex-1/3">
            <Cardlist />
          </div>
        </div>
      ),
    },
    {
      id: "Near me",
      label: "Near me",
      content: (
        <div className="flex flex-wrap gap-2 justify-center">
          <div className="flex-1/3">
            <Cardlist />
          </div>
        </div>
      ),
    },
    {
      id: "Virtual",
      label: "Virtual",
      content: (
        <div className="flex flex-wrap gap-2 justify-center">
          <div className="flex-1/3">
            <Cardlist />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex w-full flex-col mt-5">
      <Tabs
        aria-label="Dynamic tabs"
        items={tabs}
        className="justify-center font-bold"
      >
        {(item) => (
          <Tab key={item.id} title={item.label} className="text-xl">
            <Card className="shadow-none bg-transparent p-0 m-0">
              <CardBody>{item.content}</CardBody>
            </Card>
          </Tab>
        )}
      </Tabs>
    </div>
  );
}
