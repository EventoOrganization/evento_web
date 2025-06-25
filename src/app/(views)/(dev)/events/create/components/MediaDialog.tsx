"use client";

import FileUploadButton from "@/components/FileUploadButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

type MediaDialogProps = {
  trigger: ReactNode;
  presetImages?: string[];
  onFileSelected: (file: File) => void;
  toUpload: (files: File[]) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const MediaDialog = ({
  trigger,
  presetImages = ["cover1.jpg", "cover2.jpg", "cover3.jpg"],
  onFileSelected,
  toUpload,
  open,
  onOpenChange,
}: MediaDialogProps) => {
  const handlePresetClick = async (img: string) => {
    const res = await fetch(`/presets/${img}`);
    const blob = await res.blob();
    const file = new File([blob], img, { type: blob.type });
    onFileSelected(file);
    onOpenChange(false);
  };

  const handleAddFileToFrom = (files: File[]) => {
    toUpload(files);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader className="flex-row items-center gap-4">
          <DialogTitle>Choose some photos</DialogTitle>
          <FileUploadButton
            onChange={(e) => {
              const uploaded = e.target.files
                ? (Array.from(e.target.files) as File[])
                : [];
              if (uploaded.length > 0) handleAddFileToFrom(uploaded);
            }}
          />
        </DialogHeader>

        <div className="mb-6">
          <p className="mb-2 text-sm text-muted-foreground">
            Select from our templates:
          </p>
          <div className="flex gap-2 flex-wrap">
            {presetImages.map((img, idx) => (
              <img
                key={idx}
                src={`/presets/${img}`}
                alt={img}
                onClick={() => handlePresetClick(img)}
                className="w-24 h-24 object-cover rounded border cursor-pointer hover:ring-2"
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaDialog;
