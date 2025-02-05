import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/togglerbtn";
import { cn } from "@nextui-org/theme";
import { useEffect, useState } from "react";

interface EditableInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  field: string;
  handleUpdate: () => void;
  handleCancel: () => void;
  handleReset: () => void;
  isUpdating: boolean;
  editMode: boolean;
  toggleEditMode: () => void;
  label?: string;
}

const EditEventLimit = ({
  value,
  onChange,
  field,
  handleUpdate,
  handleCancel,
  handleReset,
  isUpdating,
  editMode,
  toggleEditMode,
  label,
}: EditableInputProps) => {
  const [isLimited, setIsLimited] = useState(!!value);
  const [inputValue, setInputValue] = useState<number | "">(
    value !== null ? value : "",
  );

  useEffect(() => {
    if (value !== null) {
      setIsLimited(true);
      setInputValue(value);
    }
  }, [value]);

  const handleToggle = () => {
    const newIsLimited = !isLimited;
    setIsLimited(newIsLimited);

    if (!newIsLimited) {
      onChange(null);
      setInputValue("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    if (/^\d*$/.test(input)) {
      const newValue = input === "" ? "" : Number(input);
      setInputValue(newValue);

      if (newValue !== "") {
        onChange(newValue);
      } else {
        onChange(null);
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
    <div className={cn("flex flex-col gap-2")}>
      <div className="flex justify-between items-center gap-2">
        <h3 className="text-eventoPurpleLight font-semibold">{field}</h3>
        {editMode ? (
          <div className="flex gap-2">
            <Button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="bg-evento-gradient text-white"
            >
              {isUpdating ? "Updating..." : "Update"}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="text-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="text-red-600"
            >
              Reset
            </Button>
          </div>
        ) : (
          <Button onClick={toggleEditMode} variant="outline">
            Edit {field}
          </Button>
        )}
      </div>

      {label && <label className="font-bold text-lg">{label}</label>}

      <div className="flex items-center gap-4">
        <Switch
          checked={isLimited}
          onClick={handleToggle}
          className="mt-1"
          disabled={!editMode}
        />

        <Input
          type="number"
          placeholder={
            isLimited
              ? "Enter the limite capacity"
              : "Toggle to enter a limit capacity"
          }
          value={isLimited ? inputValue : ""}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-full"
          min={1}
          disabled={!isLimited || !editMode}
        />
      </div>
    </div>
  );
};

export default EditEventLimit;
