import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@nextui-org/theme";

interface EditableInputProps {
  value: string;
  onChange: (value: string) => void;
  field: string;
  handleUpdate: () => void;
  handleCancel: () => void;
  handleReset: () => void;
  isUpdating: boolean;
  editMode: boolean;
  toggleEditMode: () => void;
  label?: string;
}

const EditableInputText = ({
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
  return (
    <div className={cn("flex flex-col gap-2")}>
      <div className="flex justify-between">
        <h3 className="text-eventoPurpleLight">{field}</h3>
        {editMode ? (
          <div className="grid grid-cols-3 gap-2">
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
          <Button onClick={toggleEditMode} variant={"outline"}>
            Edit {field}
          </Button>
        )}
      </div>
      {label && <label className="font-bold text-lg">{label}</label>}
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
        disabled={!editMode}
      />
    </div>
  );
};

export default EditableInputText;
