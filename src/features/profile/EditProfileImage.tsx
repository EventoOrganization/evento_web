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
import { getCroppedImg } from "@/utils/imageHelpers"; // Assurez-vous que cette fonction retourne une Data URL
import Image from "next/image";
import { useState } from "react";
import Cropper, { Area } from "react-easy-crop";

const EditProfileImage = ({
  userInfo,
  onUpdateImage,
}: {
  userInfo?: UserType;
  onUpdateImage: (image: string) => void;
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
        setOpenDialog(true);
      };
      reader.readAsDataURL(file); // Directement en base64
    }
  };

  const handleCropComplete = (croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
  };

  const handleSaveCroppedImage = async () => {
    if (croppedArea && imageSrc) {
      try {
        // Obtenez la largeur et la hauteur réelles de l'image avant le recadrage
        const imageElement = new window.Image();
        imageElement.src = imageSrc;
        const imageWidth = imageElement.naturalWidth;
        const imageHeight = imageElement.naturalHeight;

        console.log("Actual image dimensions before cropping:", {
          imageWidth,
          imageHeight,
        });

        // Passez les dimensions réelles et le zoom à `getCroppedImg`
        const croppedImageDataUrl = await getCroppedImg(
          imageSrc,
          croppedArea,
          imageWidth,
          imageHeight,
          zoom,
        );

        if (croppedImageDataUrl) {
          setImageSrc(croppedImageDataUrl);
          onUpdateImage(croppedImageDataUrl);
          setOpenDialog(false);
        }
      } catch (error) {
        console.error("Error during image processing:", error);
        alert("An error occurred during image processing. Please try again.");
      }
    }
  };

  return (
    <>
      <div
        onClick={() => document.getElementById("profileImage")?.click()}
        className="cursor-pointer w-fit"
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
        <Input
          type="file"
          id="profileImage"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {openDialog && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="w-[95%] max-w-xl">
            <DialogHeader>
              <DialogTitle>Profile Image</DialogTitle>
              <DialogDescription>
                Your profile image will be rendered in this format. Please adapt
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
              <Button onClick={handleSaveCroppedImage}>Crop & Save</Button>
              <Button onClick={() => setOpenDialog(false)} variant="outline">
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
