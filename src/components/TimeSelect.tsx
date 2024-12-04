import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateTimeOptions } from "@/utils/dateUtils";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

const timeOptions = generateTimeOptions();

export const TimeSelect = ({
  value,
  onChange,
  filterOptions,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  filterOptions?: (time: string) => boolean;
  disabled?: boolean;
}) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (value === "") {
      setDisplayValue("End Time?");
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  const optionsToDisplay = filterOptions
    ? timeOptions.filter(filterOptions)
    : timeOptions;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className="border flex p-2 rounded justify-start"
        disabled={disabled}
      >
        {" "}
        <Clock className="mr-2 h-4 w-4" />
        {value === "" ? (
          <span className="text-gray-400">End Time?</span>
        ) : (
          <SelectValue>{displayValue}</SelectValue>
        )}
      </SelectTrigger>
      <SelectContent>
        {optionsToDisplay.map((time) => (
          <SelectItem key={time} value={time}>
            {time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
