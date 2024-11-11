"use client";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { timeZonesMap } from "@/utils/timezones";
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
  // Trouver le label correspondant à l'identifiant stocké
  const currentLabel =
    timeZonesMap.find((tz) => tz.value === selectedTimeZone)?.label ||
    "Choose your UTC";

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
