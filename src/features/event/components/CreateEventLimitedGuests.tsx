import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/togglerbtn";
import { useCreateEventStore } from "@/store/useCreateEventStore";
import React, { useEffect, useState } from "react";

const CreateEventLimitedGuests = () => {
  const { limitedGuests, setEventField } = useCreateEventStore();
  const [isLimited, setIsLimited] = useState(!!limitedGuests);
  const [inputValue, setInputValue] = useState<number | "">(
    limitedGuests !== null ? limitedGuests : "",
  );

  useEffect(() => {
    if (limitedGuests !== null) {
      setIsLimited(true);
      setInputValue(limitedGuests);
    }
  }, [limitedGuests]);

  const handleToggle = () => {
    const newIsLimited = !isLimited;
    setIsLimited(newIsLimited);

    if (!newIsLimited) {
      setEventField("limitedGuests", null);
      setInputValue("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    if (/^\d*$/.test(input)) {
      const newValue = input === "" ? "" : Number(input);
      setInputValue(newValue);

      if (newValue !== "") {
        setEventField("limitedGuests", newValue);
      } else {
        setEventField("limitedGuests", null);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const invalidChars = ["e", "E", "+", "-", ".", ","];

    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
    if (e.key === "0" && inputValue === "") {
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
          value={isLimited ? inputValue : ""}
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
