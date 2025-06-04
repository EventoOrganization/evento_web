import { Trash } from "lucide-react";
import { useRef, useState } from "react";
import FileUploadButton from "@/components/FileUploadButton";

// Type simple, tu peux le typiser plus strict si tu veux.
type MediaFilesInputProps = {
  value?: File[];
  onChange?: (files: File[]) => void;
  className?: string;
};

const MediaFilesInput = ({
  value,
  onChange,
  className,
}: MediaFilesInputProps) => {
  // State interne, fallback sur value si controlled
  const [files, setFiles] = useState<File[]>(value ?? []);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Update parent à chaque changement
  const updateFiles = (next: File[]) => {
    setFiles(next);
    onChange?.(next);
    if (carouselIndex > 0 && carouselIndex >= next.length) {
      setCarouselIndex(next.length - 1);
    }
  };

  // Ajout
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const next = [...files, ...Array.from(e.target.files)];
    updateFiles(next);
    e.target.value = "";
  };

  // Suppression
  const handleRemoveFile = (idx: number) => {
    const next = files.filter((_, i) => i !== idx);
    updateFiles(next);
  };

  // Carousel
  const handleSelectMedia = (idx: number) => {
    setCarouselIndex(idx);
  };

  return (
    <div className={className}>
      {/* Bouton d'ajout */}
      <FileUploadButton onChange={handleFileChange} />
      <ul className="flex gap-2 overflow-x-scroll max-w-full ml-2 scroll-container p-2">
        {files.map((file, index) => {
          const url = URL.createObjectURL(file);
          const isImage = file.type.startsWith("image/");
          const isVideo = file.type.startsWith("video/");
          return (
            <li
              key={index}
              onClick={() => handleSelectMedia(index)}
              className="relative w-24 h-24 overflow-hidden aspect-square border rounded-md flex-shrink-0 ring-offset-background hover:ring-2 hover:ring-ring group"
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

export default MediaFilesInput;
