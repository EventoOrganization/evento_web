import { Button } from "@/components/ui/button";
import { cn } from "@nextui-org/theme";
interface EditableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  field: string;
  handleUpdate: () => void;
  handleCancel: () => void;
  handleReset?: () => void;
  isUpdating: boolean;
  editMode: boolean;
  toggleEditMode: () => void;
  label?: string;
}

const EditableSelect = ({
  value,
  onChange,
  options,
  field,
  handleUpdate,
  handleCancel,
  handleReset,
  isUpdating,
  editMode,
  toggleEditMode,
  label,
}: EditableSelectProps) => {
  return (
    <div className={cn("flex flex-col gap-2")}>
      <div className="flex justify-between">
        <h3 className="text-eventoPurpleLight">{field}</h3>

        {editMode ? (
          <div className="grid grid-cols-2 gap-2">
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
            {handleReset && (
              <Button
                onClick={handleReset}
                variant="outline"
                className="text-red-600"
              >
                Reset
              </Button>
            )}
          </div>
        ) : (
          <Button onClick={toggleEditMode} variant={"outline"}>
            Edit {field}
          </Button>
        )}
      </div>
      {label && <label className="font-bold text-lg">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-select w-full text-sm px-3 py-2 rounded-md border"
        disabled={!editMode}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default EditableSelect;
