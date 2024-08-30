"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface TabSelectorProps {
  onChange: (tab: string) => void;
}

const TabSelector = ({ onChange }: TabSelectorProps) => {
  const [activeTab, setActiveTab] = useState("All");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onChange(tab);
  };

  return (
    <div className="relative flex justify-around w-full pb-4 text-xl">
      {["All", "Near me", "Virtual"].map((tab) => (
        <div
          key={tab}
          className={cn(
            "cursor-pointer font-medium transition-all duration-300",
            {
              "text-eventoPurple": activeTab === tab,
              "text-gray-500": activeTab !== tab,
            },
          )}
          onClick={() => handleTabClick(tab)}
        >
          {tab}
        </div>
      ))}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-eventoPurple transition-all duration-300"
        style={{
          width: `${100 / 3}%`,
          transform: `translateX(${
            ["All", "Near me", "Virtual"].indexOf(activeTab) * 100
          }%)`,
        }}
      />
    </div>
  );
};

export default TabSelector;
