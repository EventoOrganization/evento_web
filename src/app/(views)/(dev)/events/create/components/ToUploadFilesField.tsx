import FileUploadButton from "@/components/FileUploadButton";
import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";
import { useState } from "react";

// Type simple, tu peux le typiser plus strict si tu veux.
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
  const [carouselIndex, setCarouselIndex] = useState(0);

  const updateFiles = (next: File[]) => {
    setFiles(next);
    onChange?.(next);
    if (carouselIndex > 0 && carouselIndex >= next.length) {
      setCarouselIndex(next.length - 1);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const next = [...files, ...Array.from(e.target.files)];
    updateFiles(next);
    e.target.value = "";
  };

  const handleRemoveFile = (idx: number) => {
    const next = files.filter((_, i) => i !== idx);
    updateFiles(next);
  };

  const handleSelectMedia = (idx: number) => {
    setCarouselIndex(idx);
  };

  return (
    <div className={cn("flex", className)}>
      <FileUploadButton onChange={handleFileChange} />
      <ul className="flex gap-2 overflow-x-scroll max-w-full scroll-container p-1">
        {files.map((file, index) => {
          const url = URL.createObjectURL(file);
          const isImage = file.type.startsWith("image/");
          const isVideo = file.type.startsWith("video/");
          return (
            <li
              key={index}
              onClick={() => handleSelectMedia(index)}
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
    </div>
  );
};

export default ToUploadFilesField;
