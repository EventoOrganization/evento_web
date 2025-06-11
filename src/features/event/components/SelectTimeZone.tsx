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
import { getTimezone, getUTCOffset, timeZonesMap } from "@/utils/timezones";
import { useState } from "react";

interface SelectTimeZoneProps {
  selectedTimeZoneOffset: string;
  setSelectedTimeZone: (value: string) => void;
  editMode?: boolean;
  className?: string;
}

const SelectTimeZone = ({
  selectedTimeZoneOffset,
  setSelectedTimeZone,
  editMode,
  className,
}: SelectTimeZoneProps) => {
  const [currentLabel, setCurrentLabel] = useState(
    getUTCOffset() + " " + getTimezone(),
  );
  return (
    <>
      <Label htmlFor="timeZoneSelect" className="sr-only">
        Select Timezone
      </Label>
      <Select
        value={selectedTimeZoneOffset || ""}
        onValueChange={(value) => {
          setSelectedTimeZone(value);
          const tz = timeZonesMap.find((tz) => tz.offset === value);
          if (tz) {
            setCurrentLabel(tz.offset + " " + tz.iana);
          } else {
            setCurrentLabel(value);
          }
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
              {tz.offset + " " + tz.iana}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default SelectTimeZone;
