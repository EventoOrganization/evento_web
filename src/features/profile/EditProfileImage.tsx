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
  const [imageSrc, setImageSrc] = useState<string | null>(
    userInfo?.profileImage ? userInfo?.profileImage : "",
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
          <img
            src={imageSrc || userInfo?.profileImage}
            alt="user image"
            width={500}
            height={500}
            className="w-20 h-20 md:w-36 md:h-36 object-cover rounded-full"
            // forceImg
          />
        ) : imageSrc ? (
          <img
            src={imageSrc}
            alt="user image"
            width={500}
            height={500}
            className="w-20 h-20 md:w-36 md:h-36 object-cover rounded-full"
            // forceImg
          />
        ) : (
          <div className="rounded-full w-20 h-20 md:w-24 md:h-24 bg-gray-100 flex justify-center items-center hover:scale-105 hover:opacity-80 transition-transform duration-200 ease-in-out">
            <div className="w-10 h-10 md:w-14 md:h-14 -translate-y-1 ">
              <svg
                width="13"
                height="14"
                viewBox="0 0 13 14"
                fill="none"
                className={"w-full h-full "}
              >
                <path
                  d="M6 6.90002C7.9 6.90002 9.5 5.4 9.5 3.5C9.5 1.5 7.9 0 6 0C4.1 0 2.6001 1.5 2.6001 3.5C2.6001 5.4 4.1 6.90002 6 6.90002ZM8.5 7.80005H8C7.4 8.06672 6.73333 8.19995 6 8.19995C5.33333 8.19995 4.7001 8.06672 4.1001 7.80005H3.6001C1.6001 7.80005 0 9.40002 0 11.4V12.5C0 13.2 0.600049 13.8 1.30005 13.8H10.8C11.5 13.8 12.1001 13.2 12.1001 12.5V11.4C12.1001 9.40002 10.5 7.80005 8.5 7.80005Z"
                  fill="url(#paint0_linear_edit)"
                />

                <defs>
                  <linearGradient
                    id="paint0_linear_edit"
                    x1="1.43954e-07"
                    y1="-5.01002"
                    x2="7.60166"
                    y2="13.1579"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor={"#B127A6"} />
                    <stop offset="1" stopColor={"#5973D3"} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
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
                image={imageSrc || userInfo?.profileImage}
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
