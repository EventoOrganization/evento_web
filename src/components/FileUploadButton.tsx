import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useRef } from "react";

const FileUploadButton = ({
  onChange,
  className,
}: {
  onChange: (e: any) => void;
  className?: string;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onClick={handleButtonClick}
      className={cn(
        "cursor-pointer relative flex items-center justify-center mt-2 min-w-24 h-24 rounded-md  border-2 border-dashed border-gray-300 hover:border-eventoPurpleLight",
        className,
      )}
    >
      {/* Input caché */}
      <input
        type="file"
        accept="image/*"
        onChange={onChange}
        ref={fileInputRef}
        className="hidden"
      />
      {/* Bouton stylisé */}
      <span className="flex items-center justify-center w-12 h-12 rounded-md bg-eventoPurpleDark text-white ">
        <Plus className="w-6 h-6" />
      </span>
    </div>
  );
};

export default FileUploadButton;
