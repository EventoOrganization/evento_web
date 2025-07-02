"use client";

import FileUploadButton from "@/components/FileUploadButton";
import SmartImage from "@/components/SmartImage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PresetMedia } from "@/types/EventType";
import { ReactNode, useState } from "react";

type AddMediaDialogProps = {
  trigger: ReactNode;
  presetImages?: {
    key: string;
    url: string;
  }[];
  selectedPredefinedMedia?: PresetMedia[];
  setSelectedPredefinedMedia?: React.Dispatch<
    React.SetStateAction<PresetMedia[]>
  >;
  onFileSelected: (file: File) => void;
  toUpload: (files: File[]) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const AddMediaDialog = ({
  trigger,
  presetImages,
  selectedPredefinedMedia,
  setSelectedPredefinedMedia,
  onFileSelected,
  toUpload,
  open,
  onOpenChange,
}: AddMediaDialogProps) => {
  const [pendingSelectedPredefinedMedia, setPendingSelectedPredefinedMedia] =
    useState<{ url: string; key: string }[]>(selectedPredefinedMedia || []);
  const handlePresetClick = async (img: { url: string; key: string }) => {
    if (
      img.key ===
      pendingSelectedPredefinedMedia?.find((m) => m.key === img.key)?.key
    ) {
      console.log("removing", img);
      setPendingSelectedPredefinedMedia?.((prev) =>
        prev.filter((m) => m.key !== img.key),
      );
      return;
    }
    console.log("adding", img);
    setPendingSelectedPredefinedMedia?.((prev) => [...prev, img]);
  };

  const handleAddPresetToFrom = () => {
    setSelectedPredefinedMedia?.(pendingSelectedPredefinedMedia);
    onOpenChange(false);
  };
  const handleAddFileToFrom = (files: File[]) => {
    toUpload(files);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-w-[95%] lg:max-w-4xl rounded">
        <DialogHeader className="flex-row items-center gap-4 space-y-0">
          <DialogTitle className="text-left">
            Select from our templates
            <p className="text-sm text-muted-foreground">
              or upload your own media:
            </p>
          </DialogTitle>
          <FileUploadButton
            onChange={(e) => {
              const uploaded = e.target.files
                ? (Array.from(e.target.files) as File[])
                : [];
              if (uploaded.length > 0) handleAddFileToFrom(uploaded);
            }}
          />
        </DialogHeader>

        <div className="grid grid-cols-2 md:flex gap-2 md:gap-4 flex-wrap max-h-96 overflow-y-auto p-2 md:p-4 bg-muted rounded-lg">
          {presetImages &&
            presetImages.map((img, idx) => (
              <SmartImage
                key={idx}
                src={img.url}
                alt={img.key}
                onClick={() => handlePresetClick(img)}
                className={`w-40 h-40 object-cover rounded border cursor-pointer hover:ring-2 ${img.key === pendingSelectedPredefinedMedia?.find((m) => m.key === img.key)?.key ? "ring-2 ring-eventoPurpleDark" : "ring-eventoBlue"}`}
              />
            ))}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant={"ghost"} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant={"eventoPrimary"} onClick={handleAddPresetToFrom}>
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMediaDialog;
