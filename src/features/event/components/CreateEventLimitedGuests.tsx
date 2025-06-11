import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/togglerbtn";
import React, { useState } from "react";

const CreateEventLimitedGuests = ({
  onChange,
}: {
  onChange: (limit: number | null) => void;
}) => {
  const [isLimited, setIsLimited] = useState(false);
  const [inputValue, setInputValue] = useState<number | null>(null);

  const handleToggle = () => {
    const newLimited = !isLimited;
    setIsLimited(newLimited);
    if (!newLimited) {
      setInputValue(null);
      onChange(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    if (/^\d*$/.test(input)) {
      const newValue = input === "" ? null : Number(input);
      setInputValue(newValue);
      onChange(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const invalidChars = ["e", "E", "+", "-", ".", ","];

    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
    if (e.key === "0" && inputValue === null) {
      e.preventDefault();
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Switch checked={isLimited} onClick={handleToggle} className="mt-1" />
        <Label>Maximum Capacity of Attendees</Label>
      </div>
      {isLimited && (
        <Input
          type="number"
          placeholder={
            isLimited
              ? "Enter the limit of attendees"
              : "Toggle to enter a limit capacity"
          }
          value={inputValue !== null ? inputValue : ""}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-full"
          min={1}
          disabled={!isLimited}
        />
      )}
    </div>
  );
};

export default CreateEventLimitedGuests;
