"use client";

import CropImageDialog from "@/components/CropImageDialog";
import { Label } from "@/components/ui/label";
import { SUPPORTED_IMAGE_SIZES } from "@/constantes/supportedImageSize";
import { usePredefinedMediaStore } from "@/store/usePredefinedMediaStore";
import { PresetMedia } from "@/types/EventType";
import { useState } from "react";
import AddButton from "../../../../../../components/AddButton";
import AddMediaDialog from "./AddMediaDialog";
import FormMediaPreview from "./FormMediaPreview";

type Props = {
  onChange?: (files: File[]) => void;
  selectedPredefinedMedia?: PresetMedia[];
  setSelectedPredefinedMedia?: React.Dispatch<
    React.SetStateAction<PresetMedia[]>
  >;
};

const FormMediaField = ({
  onChange,
  selectedPredefinedMedia,
  setSelectedPredefinedMedia,
}: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { predefinedMediaUrls } = usePredefinedMediaStore();
  const [files, setFiles] = useState<File[]>([]);
  const [pendingCropFiles, setPendingCropFiles] = useState<File[]>([]);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");

  const updateFiles = (next: File[]) => {
    setFiles(next);
    onChange?.(next);
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
        <AddMediaDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          presetImages={predefinedMediaUrls}
          selectedPredefinedMedia={selectedPredefinedMedia}
          setSelectedPredefinedMedia={setSelectedPredefinedMedia}
          trigger={<AddButton />}
          onFileSelected={(file) => {
            setPendingCropFiles([file]);
            loadNextCrop(file);
          }}
          toUpload={(newFiles) => {
            setPendingCropFiles(newFiles);
            loadNextCrop(newFiles[0]);
          }}
        />
        {/* TODO  remove if not needed*/}
        {/* {selectedPredefinedMedia &&
          selectedPredefinedMedia?.length > 0 &&
          setSelectedPredefinedMedia && (
            <FormPresetList
              value={selectedPredefinedMedia}
              onChange={setSelectedPredefinedMedia}
            />
          )}

        {files.length > 0 && (
          <FormBlobList value={files} onChange={updateFiles} />
        )} */}
        <FormMediaPreview
          files={files}
          onFilesChange={updateFiles}
          presetMedia={selectedPredefinedMedia ?? []}
          onPresetMediaChange={(next) => setSelectedPredefinedMedia?.(next)}
        />
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
