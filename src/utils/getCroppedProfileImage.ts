import { Area } from "react-easy-crop";

const createImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (err) => reject(err));
    image.src = url;
  });
};

export const getCroppedProfileImage = async (
  imageSrc: string,
  pixelCrop: Area,
  imageWidth: number,
  imageHeight: number,
  zoom: number,
  outputWidth: number = 250,
  outputHeight: number = 250,
): Promise<string | null> => {
  const image = await createImage(imageSrc);

  const cropCanvas = document.createElement("canvas");
  const cropCtx = cropCanvas.getContext("2d");

  if (!cropCtx) return null;

  const cropX = (pixelCrop.x * imageWidth) / 100;
  const cropY = (pixelCrop.y * imageHeight) / 100;
  const cropWidth = (pixelCrop.width * imageWidth) / 100;
  const cropHeight = (pixelCrop.height * imageHeight) / 100;

  console.log("Crop values:", { cropX, cropY, cropWidth, cropHeight });

  cropCanvas.width = cropWidth;
  cropCanvas.height = cropHeight;

  cropCtx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight,
  );

  const outputCanvas = document.createElement("canvas");
  const outputCtx = outputCanvas.getContext("2d");

  if (!outputCtx) return null;

  outputCanvas.width = outputWidth;
  outputCanvas.height = outputHeight;

  outputCtx.drawImage(
    cropCanvas,
    0,
    0,
    cropWidth,
    cropHeight,
    0,
    0,
    outputWidth,
    outputHeight,
  );

  console.log("Output dimensions after resizing:", {
    outputCanvasWidth: outputCanvas.width,
    outputCanvasHeight: outputCanvas.height,
  });

  return new Promise<string | null>((resolve, reject) => {
    outputCanvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        console.log(
          "Blob size after resizing and cropping:",
          blob.size,
          "bytes",
        );

        const fileUrl = URL.createObjectURL(blob);
        resolve(fileUrl);
      },
      "image/jpeg",
      0.6,
    );
  });
};
