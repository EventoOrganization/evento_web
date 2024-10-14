"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface TabSelectorProps {
  onChange: (tab: string) => void;
  tabs?: string[];
  className?: string;
}

const TabSelector = ({ onChange, tabs, className }: TabSelectorProps) => {
  const [activeTab, setActiveTab] = useState("All events");
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onChange(tab);
  };

  return (
    <div
      className={cn(
        "relative flex justify-around w-full text-xl gap-4",
        className,
      )}
    >
      {tabs &&
        tabs.map((tab) => (
          <div
            key={tab}
            className={cn(
              "cursor-pointer font-medium px-4 py-2 transition-all duration-300 ease-in-out rounded-lg w-full text-center shadow",
              {
                "text-white bg-evento-gradient font-bold shadow-lg":
                  activeTab === tab,
                "text-gray-500 bg-gray-200 hover:bg-gray-300":
                  activeTab !== tab,
              },
            )}
            onClick={() => handleTabClick(tab)}
            style={{
              transition: "transform 0.3s ease",
              transform: activeTab === tab ? "scale(1.05)" : "scale(1)",
            }}
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
