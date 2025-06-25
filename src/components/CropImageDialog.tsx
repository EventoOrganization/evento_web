"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SupportedAspectRatioOptions } from "@/constantes/supportedImageSize";
import { cn } from "@/lib/utils";
import { getCroppedBlob } from "@/utils/getCroppedBlob";
import { useEffect, useState } from "react";
import Cropper, { Area } from "react-easy-crop";

type CropImageDialogProps = {
  open: boolean;
  imageSrc: string;
  aspect?: number;
  originalFileName?: string;
  aspectOptions?: SupportedAspectRatioOptions;
  onClose: () => void;
  onCropComplete: (croppedFile: File) => void;
  outputType?: string;
  outputQuality?: number;
};

const CropImageDialog = ({
  open,
  imageSrc,
  aspect = 1,
  aspectOptions,
  originalFileName = "cropped-image.jpg",
  outputType = "image/jpeg",
  outputQuality = 0.6,
  onClose,
  onCropComplete,
}: CropImageDialogProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [currentAspect, setCurrentAspect] = useState<number>(
    aspectOptions?.[0]?.value ?? aspect,
  );

  useEffect(() => {
    if (open) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCurrentAspect(aspectOptions?.[0]?.value ?? aspect);
    }
  }, [open, aspectOptions, aspect]);

  const handleCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleConfirmCrop = async () => {
    if (!croppedAreaPixels || !imageSrc) return;

    try {
      const imageElement = new window.Image();
      imageElement.src = imageSrc;
      imageElement.crossOrigin = "anonymous";

      await new Promise<void>((resolve, reject) => {
        imageElement.onload = () => resolve();
        imageElement.onerror = (err) => reject(err);
      });

      const imageWidth = imageElement.naturalWidth;
      const imageHeight = imageElement.naturalHeight;

      const croppedBlob = await getCroppedBlob(
        imageSrc,
        croppedAreaPixels,
        imageWidth,
        imageHeight,
        zoom,
        outputType,
        outputQuality ?? 0.6,
      );

      if (!croppedBlob) {
        console.error("Cropped blob is null or undefined");
        alert("Cropping failed. Please try again.");
        return;
      }

      const croppedFile = new File([croppedBlob], originalFileName, {
        type: "image/jpeg",
      });

      onCropComplete(croppedFile);
    } catch (err) {
      console.error("Error cropping image", err);
      alert("Error cropping image. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95%] max-w-xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>

        {aspectOptions && aspectOptions.length > 1 && (
          <div className="flex justify-center mb-2 gap-2">
            {aspectOptions.map((opt) => (
              <Button
                key={opt.value}
                variant={opt.value === currentAspect ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentAspect(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        )}

        <div
          className={cn("relative w-full max-w-xl bg-gray-200 aspect-square")}
        >
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={currentAspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        <DialogFooter className="flex justify-between w-full mt-4 gap-2">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleConfirmCrop}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CropImageDialog;
