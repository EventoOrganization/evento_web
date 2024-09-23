// src/features/event/components/EditableMultiSelect.tsx
import { Button } from "@/components/ui/button";
import { cn } from "@nextui-org/theme";
import { useEffect, useState } from "react";

interface EditableMultiSelectProps {
  availableOptions: { _id: string; name: string }[];
  selectedOptions: { _id: string; name: string }[];
  onChange: (newSelected: { _id: string; name: string }[]) => void;
  handleUpdate: () => void;
  handleCancel: () => void;
  handleReset: () => void;
  isUpdating: boolean;
  editMode: boolean;
  toggleEditMode: () => void;
  label?: string;
}

const EditableMultiSelect = ({
  availableOptions,
  selectedOptions,
  onChange,
  handleUpdate,
  handleCancel,
  handleReset,
  isUpdating,
  editMode,
  toggleEditMode,
  label,
}: EditableMultiSelectProps) => {
  const [newSelectedOptions, setNewSelectedOptions] = useState([
    ...selectedOptions,
  ]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedOption = availableOptions.find(
      (opt) => opt._id === selectedId,
    );

    if (
      selectedOption &&
      !newSelectedOptions.some((opt) => opt._id === selectedOption._id)
    ) {
      const updatedOptions = [...newSelectedOptions, selectedOption];
      setNewSelectedOptions(updatedOptions);
      onChange(updatedOptions); // Trigger the parent component's onChange with the new state
    }
  };

  const removeSelectedOption = (optionId: string) => {
    const updatedOptions = newSelectedOptions.filter(
      (opt) => opt._id !== optionId,
    );
    setNewSelectedOptions(updatedOptions);
    onChange(updatedOptions); // Trigger the parent component's onChange with the new state
  };

  useEffect(() => {
    setNewSelectedOptions([...selectedOptions]); // Sync when selectedOptions changes
  }, [selectedOptions]);

  return (
    <div className={cn("flex flex-col gap-2")}>
      {" "}
      <div className="flex justify-between">
        <h3 className="text-eventoPurpleLight">{label}</h3>{" "}
        {editMode && (
          <div className="space-y-2 mt-2">
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => {
                  handleUpdate();
                }}
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
                onClick={() => {
                  setNewSelectedOptions(selectedOptions); // Reset to the original selected options
                  handleReset();
                }}
                variant="outline"
                className="text-red-600"
              >
                Reset
              </Button>
            </div>
          </div>
        )}
        {!editMode && (
          <Button onClick={toggleEditMode} variant={"outline"}>
            Edit Interests
          </Button>
        )}
      </div>
      <div className="flex gap-2 flex-wrap">
        {newSelectedOptions.map((option) => (
          <Button
            type="button"
            key={option._id}
            className="bg-evento-gradient text-white rounded px-3 py-1"
            onClick={() => editMode && removeSelectedOption(option._id)}
          >
            {option.name}
          </Button>
        ))}
      </div>
      {label && <label className="font-bold text-lg sr-only">{label}</label>}
      <select
        value=""
        onChange={handleSelectChange}
        className="form-select w-full text-sm px-3 py-2 rounded-md border"
        disabled={!editMode}
      >
        <option value="" disabled>
          Choose more interest...
        </option>
        {availableOptions
          .filter(
            (opt) => !newSelectedOptions.some((sel) => sel._id === opt._id),
          )
          .map((opt) => (
            <option key={opt._id} value={opt._id}>
              {opt.name}
            </option>
          ))}
      </select>
    </div>
  );
};

export default EditableMultiSelect;
