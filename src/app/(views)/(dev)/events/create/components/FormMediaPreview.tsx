"use client";

import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";

type PresetMedia = {
  key: string;
  url: string;
};

type FormMediaPreviewProps = {
  files: File[];
  onFilesChange: (files: File[]) => void;
  presetMedia: PresetMedia[];
  onPresetMediaChange: (media: PresetMedia[]) => void;
  className?: string;
};

const FormMediaPreview = ({
  files,
  onFilesChange,
  presetMedia,
  onPresetMediaChange,
  className,
}: FormMediaPreviewProps) => {
  const handleRemoveFile = (idx: number) => {
    const next = files.filter((_, i) => i !== idx);
    onFilesChange(next);
  };

  const handleRemovePreset = (idx: number) => {
    const next = presetMedia.filter((_, i) => i !== idx);
    onPresetMediaChange(next);
  };

  return (
    <div className={cn("flex overflow-hidden", className)}>
      <ul className="flex gap-2 overflow-x-scroll max-w-full scroll-container p-1">
        {presetMedia.map((media, index) => (
          <li
            key={`preset-${media.key}`}
            className="relative w-24 h-24 overflow-hidden border rounded-md aspect-square flex-shrink-0 group"
          >
            <img
              src={media.url}
              alt={`Preset ${index}`}
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
            <Trash
              className="absolute top-2 right-2 w-8 h-8 cursor-pointer rounded bg-background p-2 border hover:bg-destructive hover:text-destructive-foreground opacity-70 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                handleRemovePreset(index);
              }}
            />
          </li>
        ))}

        {files.map((file, index) => {
          const url = URL.createObjectURL(file);
          const isImage = file.type.startsWith("image/");
          const isVideo = file.type.startsWith("video/");
          return (
            <li
              key={`file-${index}`}
              className="relative w-24 h-24 overflow-hidden border rounded-md aspect-square flex-shrink-0 group"
            >
              {isImage ? (
                <img
                  src={url}
                  alt={`File ${index}`}
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

export default FormMediaPreview;
