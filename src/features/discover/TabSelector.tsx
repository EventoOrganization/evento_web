"use client";
import { cn } from "@/lib/utils";
import { EditIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface TabSelectorProps {
  onChange: (tab: string) => void;
  tabs?: string[];
  className?: string;
}

const TabSelector = ({ onChange, tabs, className }: TabSelectorProps) => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(
    pathname.startsWith("/discover") ? "All events" : "Description",
  );

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onChange(tab);
  };

  return (
    <div
      className={cn(
        "relative flex justify-around w-full md:text-xl gap-2 md:gap-4",
        className,
      )}
    >
      {tabs &&
        tabs.map((tab) => (
          <div
            key={tab}
            className={cn(
              "cursor-pointer font-medium px-1 md:px-4 py-2 transition-all duration-300 ease-in-out rounded-lg text-center shadow border border-gray-300 flex justify-center items-center",
              {
                "text-white bg-evento-gradient font-bold": activeTab === tab,
                "text-gray-500 bg-gray-200 hover:bg-gray-300":
                  activeTab !== tab,
                "w-fit": tab === "Settings",
                "w-full": tab !== "Settings",
              },
            )}
            onClick={() => handleTabClick(tab)}
          >
            {tab === "Settings" ? <EditIcon /> : tab}
          </div>
        ))}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-eventoPurple transition-all duration-300"
        style={{
          width: `${100 / (tabs?.length || 1)}%`,
          transform: `translateX(${tabs && tabs.indexOf(activeTab) * 100}%)`,
        }}
      />
    </div>
  );
};

export default TabSelector;
