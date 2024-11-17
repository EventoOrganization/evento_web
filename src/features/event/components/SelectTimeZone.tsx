"use client";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEventStore } from "@/store/useEventStore";
import { timeZonesMap } from "@/utils/timezones";
import { useEffect, useState } from "react";
import { handleFieldChange } from "../eventActions";

interface SelectTimeZoneProps {
  selectedTimeZone: string;
  setSelectedTimeZone: (value: string) => void;
  editMode?: boolean;
}

const SelectTimeZone = ({
  selectedTimeZone,
  setSelectedTimeZone,
  editMode,
}: SelectTimeZoneProps) => {
  const [currentLabel, setCurrentLabel] = useState("Timezone");
  const eventoStore = useEventStore();
  useEffect(() => {
    setCurrentLabel(
      eventoStore.timeZone ||
        timeZonesMap.find((tz) => tz.value === selectedTimeZone)?.label ||
        "Timezone",
    );
  }, []);
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
        <SelectTrigger className="border p-2 rounded">
          <SelectValue>{currentLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {timeZonesMap.map((tz) => (
            <SelectItem key={tz.value} value={tz.value}>
              {tz.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};

export default SelectTimeZone;
