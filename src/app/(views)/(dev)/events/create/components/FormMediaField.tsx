"use client";

import CropImageDialog from "@/components/CropImageDialog";
import { Label } from "@/components/ui/label";
import { SUPPORTED_IMAGE_SIZES } from "@/constantes/supportedImageSize";
import { useState } from "react";
import AddMedia from "./AddMedia";
import FormBlobList from "./FormBlobList";
import MediaDialog from "./MediaDialog";

type Props = {
  onChange?: (files: File[]) => void;
};

const FormMediaField = ({ onChange }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [pendingCropFiles, setPendingCropFiles] = useState<File[]>([]);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");

  const handleCloseCropDialog = () => {
    if (pendingCropFiles.length === 0) {
      setCropDialogOpen(false);
      setDialogOpen(false);
    }
  };

  const handleMediaChange = (files: File[]) => {
    setSelectedMedia(files);
    onChange?.(files);
    setDialogOpen(false);
  };

  const updateFiles = (next: File[]) => {
    setFiles(next);
    onChange?.(next);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];
    if (!newFiles.length) return;

    setPendingCropFiles(newFiles);
    loadNextCrop(newFiles[0]);

    e.target.value = "";
  };

  const loadNextCrop = (file: File) => {
    const url = URL.createObjectURL(file);
    setCurrentFile(file);
    setImageSrc(url);
    setCropDialogOpen(true);
  };

  const handleCropComplete = (croppedFile: File) => {
    const nextFiles = [...pendingCropFiles];
    nextFiles.shift();

    const updated = [...files, croppedFile];
    setFiles(updated);
    onChange?.(updated);

    if (nextFiles.length > 0) {
      setPendingCropFiles(nextFiles);
      loadNextCrop(nextFiles[0]);
    } else {
      setPendingCropFiles([]);
      setCropDialogOpen(false);
      setDialogOpen(false);
    }
  };

  return (
    <>
      <div>
        <Label>
          Event Photos<span className="text-red-500">*</span>
        </Label>
      </div>

      <div className="flex gap-2 min-w-0 w-full">
        <MediaDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          trigger={<AddMedia />}
          onFileSelected={(file) => {
            setPendingCropFiles([file]);
            loadNextCrop(file);
          }}
          toUpload={(newFiles) => {
            setPendingCropFiles(newFiles);
            loadNextCrop(newFiles[0]);
          }}
        />
        {files.length > 0 && (
          <FormBlobList value={files} onChange={updateFiles} />
        )}
        <CropImageDialog
          open={cropDialogOpen}
          onClose={() => setCropDialogOpen(false)}
          imageSrc={imageSrc}
          originalFileName={currentFile?.name ?? "cropped.jpg"}
          aspectOptions={SUPPORTED_IMAGE_SIZES}
          outputType="image/webp"
          outputQuality={0.9}
          onCropComplete={handleCropComplete}
        />
      </div>
    </>
  );
};

export default FormMediaField;
