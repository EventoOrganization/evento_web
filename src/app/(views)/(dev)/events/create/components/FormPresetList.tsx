"use client";

import { cn } from "@/lib/utils";
import { PresetMedia } from "@/types/EventType";
import { Trash } from "lucide-react";

type FormPresetListProps = {
  value: PresetMedia[];
  onChange: (files: PresetMedia[]) => void;
  className?: string;
};

const FormPresetList = ({
  value,
  onChange,
  className,
}: FormPresetListProps) => {
  const handleRemove = (idx: number) => {
    const next = value.filter((_, i) => i !== idx);
    onChange(next);
  };

  return (
    <div className={cn("flex overflow-hidden min-w-24", className)}>
      <ul className="flex gap-2 overflow-x-scroll max-w-full scroll-container p-1">
        {value.map((media, index) => (
          <li
            key={media.key}
            className="relative w-24 h-24 overflow-hidden aspect-square border rounded-md flex-shrink-0 group"
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
                handleRemove(index);
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormPresetList;
