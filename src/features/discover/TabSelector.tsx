"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface TabSelectorProps {
  onChange: (tab: string) => void;
  tabs?: string[];
  className?: string;
}

const TabSelector = ({ onChange, tabs, className }: TabSelectorProps) => {
  const [activeTab, setActiveTab] = useState("All");
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onChange(tab);
  };

  return (
    <div
      className={cn(
        "relative flex justify-around w-full pb-4 text-xl",
        className,
      )}
    >
      {tabs &&
        tabs.map((tab) => (
          <div
            key={tab}
            className={cn(
              "cursor-pointer font-medium transition-all duration-300",
              {
                "text-eventoPurpleLight font-bold": activeTab === tab,
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
          transform: `translateX(${tabs && tabs.indexOf(activeTab) * 100}%)`,
        }}
      />
    </div>
  );
};

export default TabSelector;
