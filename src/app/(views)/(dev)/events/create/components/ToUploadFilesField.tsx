import CropImageDialog from "@/components/CropImageDialog";
import FileUploadButton from "@/components/FileUploadButton";
import { SUPPORTED_IMAGE_SIZES } from "@/constantes/supportedImageSize";
import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";
import { useState } from "react";

type MediaFile = {
  file: File;
  previewUrl: string;
};

type ToUploadFilesFieldProps = {
  value?: File[];
  onChange?: (files: File[]) => void;
  className?: string;
};

const ToUploadFilesField = ({
  value,
  onChange,
  className,
}: ToUploadFilesFieldProps) => {
  const [files, setFiles] = useState<File[]>(value ?? []);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");

  const updateFiles = (next: File[]) => {
    setFiles(next);
    onChange?.(next);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    const url = URL.createObjectURL(file);

    setImageSrc(url);
    setCropDialogOpen(true);
    setCurrentFile(file);

    e.target.value = "";
  };

  const handleCropComplete = (croppedFile: File) => {
    updateFiles([...files, croppedFile]);
  };

  const handleRemoveFile = (idx: number) => {
    const next = files.filter((_, i) => i !== idx);
    updateFiles(next);
  };

  return (
    <div className={cn("flex", className)}>
      <FileUploadButton onChange={handleFileChange} />
      <ul className="flex gap-2 overflow-x-scroll max-w-full scroll-container p-1">
        {files.map((file, index: number) => {
          const url = URL.createObjectURL(file);
          const isImage = file.type.startsWith("image/");
          const isVideo = file.type.startsWith("video/");
          return (
            <li
              key={index}
              className="relative w-24 h-24 overflow-hidden aspect-square border rounded-md flex-shrink-0 group"
            >
              {isImage ? (
                <img
                  src={url}
                  alt={`Media ${index}`}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              ) : isVideo ? (
                <video
                  src={url}
                  controls
                  className="object-cover w-full h-full"
                />
              ) : null}
              <Trash
                className="absolute top-2 right-2 w-8 h-8 cursor-pointer rounded bg-background p-2 border hover:bg-destructive hover:text-destructive-foreground opacity-70 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(index);
                }}
              />
            </li>
          );
        })}
      </ul>

      <CropImageDialog
        open={cropDialogOpen}
        imageSrc={imageSrc}
        aspectOptions={SUPPORTED_IMAGE_SIZES}
        onCropComplete={handleCropComplete}
        originalFileName={currentFile?.name}
        onClose={() => setCropDialogOpen(false)}
      />
    </div>
  );
};

export default ToUploadFilesField;
