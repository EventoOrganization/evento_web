"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UserType } from "@/types/UserType";
import { getCroppedImg } from "@/utils/imageHelpers";
import Image from "next/image";
import { useState } from "react";
import Cropper, { Area } from "react-easy-crop";

const EditProfileImage = ({
  userInfo,
  onUpdateImage,
}: {
  userInfo?: UserType;
  onUpdateImage: any;
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>(
    userInfo?.profileImage || "https://github.com/shadcn.png",
  );
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
        setOpenDialog(true); // Ouvre la modale ici
      };
      reader.readAsDataURL(file);
      console.log("Imagetocrop", reader.result);
    }
  };

  const handleCropComplete = (
    croppedAreaPercentage: any,
    croppedAreaPixels: Area,
  ) => {
    setCroppedArea(croppedAreaPixels);
  };

  const handleSaveCroppedImage = async () => {
    if (croppedArea && imageSrc) {
      const croppedImage = await getCroppedImg(imageSrc, croppedArea);
      console.log("imagecropé", croppedImage);
      setImageSrc(croppedImage || "");
      onUpdateImage(croppedImage);
      setOpenDialog(false);
    }
  };

  return (
    <>
      <div
        onClick={() => document.getElementById("profileImage")?.click()}
        className="cursor-pointer"
      >
        {userInfo?.profileImage ? (
          <Image
            src={imageSrc}
            alt="user image"
            width={500}
            height={500}
            className="w-20 h-20 md:w-36 md:h-36 object-cover rounded-full"
          />
        ) : (
          <Avatar className="w-20 h-20 md:w-36 md:h-36">
            <AvatarImage src={imageSrc || "https://github.com/shadcn.png"} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        )}
      </div>
      <Input
        type="file"
        id="profileImage"
        accept="image/*"
        onChange={handleFileChange}
        className="sr-only"
      />

      {openDialog && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="w-[95%] max-w-xl">
            <DialogHeader className="">
              <DialogTitle>Profile Image</DialogTitle>
              <DialogDescription>
                Your profile image will be render in this format, please adapte
                it.
              </DialogDescription>
            </DialogHeader>
            <div className="relative min-h-40">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>

            <DialogFooter className="flex justify-around mt-4 gap-2">
              <Button onClick={handleSaveCroppedImage}>Crop</Button>
              <Button onClick={() => setOpenDialog(false)} variant={"outline"}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default EditProfileImage;
