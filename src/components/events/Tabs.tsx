"use client";
import React, { FormEvent, useState } from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import Event from "@/components/events/Event";

interface TabbarProps {
  onTabChange: (eventType: string) => void;
  data: any;
}
export default function Tabbar({ onTabChange, data }: TabbarProps) {
  const [selectedTab, setSelectedTab] = useState("1");
  const handleTabChange = (event: FormEvent<HTMLDivElement>) => {
    //const tabValue = (event.target as HTMLInputElement).value;
    const tabValue = event;
    setSelectedTab(tabValue.toString());
    onTabChange(tabValue.toString());
  };
  const tabs = [
    {
      id: "1",
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
      id: "2",
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
      id: "3",
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
    <>
      <div className="flex w-full flex-col mt-5">
        <Tabs
          id="tabs"
          //onChange={handleTabChange}
          selectedKey={selectedTab}
          onSelectionChange={handleTabChange as any}
          aria-label="Dynamic tabs"
          items={tabs}
          className="justify-center font-bold"
        >
          {(item) => (
            <Tab
              id={item.id}
              key={item.id}
              title={item.label}
              value={item.id}
              className="text-xl"
            >
              {(data || []).map((row: any) => (
                <Event key={Math.random()} data={row} />
              ))}

              {/* <Card className="shadow-none bg-transparent p-0 m-0">
              <CardBody>{item.content}</CardBody>
            </Card> */}
            </Tab>
          )}
        </Tabs>
      </div>
    </>
  );
}
