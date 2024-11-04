import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface EditableURLInputProps {
  value: string;
  onChange: (value: string) => void;
  handleUpdate: () => void;
  handleCancel: () => void;
  handleReset: () => void;
  isUpdating: boolean;
  editMode: boolean;
  toggleEditMode: () => void;
  field?: string;
}

const EditableURLInput = ({
  value,
  onChange,
  handleUpdate,
  handleCancel,
  handleReset,
  isUpdating,
  editMode,
  toggleEditMode,
  field = "URL",
}: EditableURLInputProps) => {
  const [url, setUrl] = useState(value);

  // Ajoute automatiquement https:// si manquant
  useEffect(() => {
    if (editMode && url && !/^(https?:\/\/)/i.test(url)) {
      setUrl(`https://${url}`);
    }
  }, [editMode, url]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    onChange(e.target.value);
  };

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
          <Button onClick={toggleEditMode} variant="outline">
            Edit {field}
          </Button>
        )}
      </div>
      <Input
        type="url"
        value={url}
        onChange={handleInputChange}
        className="w-full"
        placeholder="Enter URL"
        disabled={!editMode}
      />
    </div>
  );
};

export default EditableURLInput;
