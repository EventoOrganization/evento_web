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

  // Synchroniser l'état local avec la prop `value` lors de l'édition
  useEffect(() => {
    setIsLimited(!!value);
    setInputValue(value !== null ? value : "");
  }, [value]);

  const handleToggle = () => {
    const newIsLimited = !isLimited;
    setIsLimited(newIsLimited);

    if (!newIsLimited) {
      // Si désactivé, on met la valeur à `null`
      onChange(null);
      setInputValue("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === "" ? "" : Number(e.target.value);
    setInputValue(newValue);
    onChange(newValue === "" ? null : newValue);
  };

  return (
    <div className={cn("flex flex-col gap-2")}>
      <div className="flex justify-between items-center">
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
            isLimited ? "Enter the limit" : "Toggle to enter a limit"
          }
          value={isLimited ? inputValue : ""}
          onChange={handleInputChange}
          className="w-full"
          min={1}
          disabled={!isLimited || !editMode}
        />
      </div>
    </div>
  );
};

export default EditEventLimit;
