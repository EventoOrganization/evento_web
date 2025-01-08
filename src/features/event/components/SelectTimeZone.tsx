"use client";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/store/useEventStore";
import { timeZonesMap } from "@/utils/timezones";
import { useEffect, useState } from "react";
import { handleFieldChange } from "../eventActions";

interface SelectTimeZoneProps {
  selectedTimeZone: string;
  setSelectedTimeZone: (value: string) => void;
  editMode?: boolean;
  className?: string;
}

const SelectTimeZone = ({
  selectedTimeZone,
  setSelectedTimeZone,
  editMode,
  className,
}: SelectTimeZoneProps) => {
  const [currentLabel, setCurrentLabel] = useState("Timezone");
  const eventoStore = useEventStore();
  useEffect(() => {
    // console.log("changed timezone", eventoStore.timeZone);
    setCurrentLabel(
      timeZonesMap.find((tz) => tz.offset === selectedTimeZone)?.label ||
        "Timezone",
    );
  }, [eventoStore.timeZone]);
  return (
    <>
      <Label htmlFor="timeZoneSelect" className="sr-only">
        Select Timezone
      </Label>
      <Select
        value={selectedTimeZone || ""}
        onValueChange={(value) => {
          setSelectedTimeZone(value);
          handleFieldChange("timeZone", value);
        }}
        disabled={!editMode}
      >
        <SelectTrigger
          className={cn("border p-2 rounded justify-start", className)}
        >
          <SelectValue className="">{currentLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent
          className={cn(
            "max-w-full",
            "w-[var(--radix-select-trigger-width)]",
            "md:w-[calc(100vw-2rem)]",
            "md:max-w-fit",
          )}
        >
          {timeZonesMap.map((tz) => (
            <SelectItem
              key={tz.offset}
              value={tz.offset}
              className=" truncate text-ellipsis overflow-hidden"
            >
              {tz.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default SelectTimeZone;
