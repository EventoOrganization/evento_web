import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";

type FormBlobListProps = {
  value: File[];
  onChange: (files: File[]) => void;
  className?: string;
};

const FormBlobList = ({ value, onChange, className }: FormBlobListProps) => {
  const updateFiles = (next: File[]) => {
    onChange(next);
  };

  const handleRemoveFile = (idx: number) => {
    const next = value.filter((_, i) => i !== idx);
    updateFiles(next);
  };

  return (
    <div className={cn("flex overflow-hidden", className)}>
      <ul className="flex gap-2  overflow-x-scroll max-w-full scroll-container p-1">
        {value.map((file, index) => {
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
    </div>
  );
};

export default FormBlobList;
