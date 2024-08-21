"use client";
import React, { FormEvent, useState } from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import Event from "@/components/events/Event";

interface TabbarProps {
  onTabChange: (eventType: string) => void;
  data: any;
}
export default function Tabbar({ onTabChange, data }: TabbarProps) {
  const [selectedTab, setSelectedTab] = useState("0");
  const handleTabChange = (event: FormEvent<HTMLDivElement>) => {
    const eventType = event.currentTarget.id;
    setSelectedTab(eventType);
    onTabChange(eventType);
  };
  const tabs = [
    {
      id: "0",
      label: "All",
      content: (
        <div className="flex flex-wrap gap-2 justify-center">
          <div className="flex-1/3">
            <Event data={data} />
          </div>
        </div>
      ),
    },
    {
      id: "1",
      label: "Near me",
      content: (
        <div className="flex flex-wrap gap-2 justify-center">
          <div className="flex-1/3">
            <Event data={data} />
          </div>
        </div>
      ),
    },
    {
      id: "2",
      label: "Virtual",
      content: (
        <div className="flex flex-wrap gap-2 justify-center">
          <div className="flex-1/3">
            <Event data={data} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex w-full flex-col mt-5">
      <Tabs
        id={selectedTab}
        onChange={handleTabChange}
        aria-label="Dynamic tabs"
        items={tabs}
        className="justify-center font-bold"
      >
        {(item) => (
          <Tab
            key={item.id}
            title={item.label}
            value={item.id}
            className="text-xl"
          >
            <Card className="shadow-none bg-transparent p-0 m-0">
              <CardBody>{item.content}</CardBody>
            </Card>
          </Tab>
        )}
      </Tabs>
    </div>
  );
}
