import { Area } from "react-easy-crop";

export const getCroppedBlob = async (
  imageSrc: string,
  crop: Area,
  imageWidth: number,
  imageHeight: number,
  zoom: number,
  outputType: string = "image/jpeg", // 👈 ici
  outputQuality: number = 0.6,
): Promise<Blob | null> => {
  const image = new Image();
  image.src = imageSrc;
  image.crossOrigin = "anonymous";

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = (err) => reject(err);
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const { x, y, width, height } = crop;
  const cropRatio = width / height;

  const outputWidth = width;

  const outputHeight = Math.round(outputWidth / cropRatio);

  canvas.width = outputWidth;
  canvas.height = outputHeight;

  ctx.drawImage(image, x, y, width, height, 0, 0, outputWidth, outputHeight);

  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob ?? null), outputType, outputQuality);
  });
};
