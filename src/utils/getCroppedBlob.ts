import { Area } from "react-easy-crop";

export const getCroppedBlob = async (
  imageSrc: string,
  crop: Area,
  imageWidth: number,
  imageHeight: number,
  zoom: number,
  maxOutputWidth = 1080,
): Promise<Blob | null> => {
  const image = new Image();
  image.src = imageSrc;

  await new Promise((res, rej) => {
    image.onload = res;
    image.onerror = rej;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const { x, y, width, height } = crop;

  const cropRatio = width / height;

  const outputWidth = maxOutputWidth;
  const outputHeight = Math.round(outputWidth / cropRatio);

  canvas.width = outputWidth;
  canvas.height = outputHeight;

  ctx.drawImage(image, x, y, width, height, 0, 0, outputWidth, outputHeight);

  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob ?? null), "image/jpeg", 0.6);
  });
};
