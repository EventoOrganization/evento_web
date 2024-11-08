import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface EditableURLInputProps {
  urlValue: string;
  titleValue: string;
  onUrlChange: (url: string) => void;
  onUrlTitleChange: (title: string) => void;
  handleUpdate: () => void;
  handleCancel: () => void;
  handleReset: () => void;
  isUpdating: boolean;
  editMode: boolean;
  toggleEditMode: () => void;
  field?: string;
}

const EditableURLInput = ({
  urlValue,
  titleValue,
  onUrlChange,
  onUrlTitleChange,
  handleUpdate,
  handleCancel,
  handleReset,
  isUpdating,
  editMode,
  toggleEditMode,
  field = "URL",
}: EditableURLInputProps) => {
  const [url, setUrl] = useState(urlValue);
  const [title, setTitle] = useState(titleValue);

  // Initialiser les valeurs lorsque l'édition est activée
  useEffect(() => {
    setUrl(urlValue);
    setTitle(titleValue);
  }, [urlValue, titleValue]);

  // Ajouter automatiquement https:// si nécessaire
  useEffect(() => {
    if (editMode && url && !/^(https?:\/\/)/i.test(url)) {
      setUrl(`https://${url}`);
    }
  }, [editMode, url]);

  const handleUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    onUrlChange(e.target.value);
  };

  const handleTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    onUrlTitleChange(e.target.value);
  };

  // Fonction appelée lors du clic sur le bouton Update
  const handleSaveChanges = () => {
    handleUpdate();
  };

  return (
    <div className={cn("flex flex-col gap-4")}>
      <div className="flex justify-between items-center">
        <h3 className="text-eventoPurpleLight">{field}</h3>
        {editMode ? (
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={handleSaveChanges}
              disabled={isUpdating}
              className="bg-evento-gradient text-white"
            >
              {isUpdating ? "Updating..." : "Update"}
            </Button>
            <Button onClick={handleCancel} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
          </div>
        ) : (
          <Button onClick={toggleEditMode} variant="outline">
            Edit {field}
          </Button>
        )}
      </div>

      {/* Input pour l'URL */}
      <Input
        type="url"
        value={url}
        onChange={handleUrlInputChange}
        className="w-full"
        placeholder="Enter URL"
        disabled={!editMode}
      />

      {/* Input pour le titre personnalisé */}
      {editMode && (
        <Input
          type="text"
          value={title}
          onChange={handleTitleInputChange}
          className="w-full mt-2"
          placeholder="Enter custom title (optional)"
        />
      )}

      {/* Affichage du lien ou du texte personnalisé */}
      {!editMode && (
        <p className="text-blue-500 underline truncate max-w-[200px] overflow-hidden whitespace-nowrap">
          {title || url}
        </p>
      )}
    </div>
  );
};

export default EditableURLInput;
