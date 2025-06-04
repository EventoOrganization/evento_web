import { MediaItem } from "@/store/useCreateEventStore";
import heic2any from "heic2any";

export const resizeImage = async (blob: Blob, width: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = width / img.width;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("No context");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (resizedBlob) => {
          if (resizedBlob) resolve(resizedBlob);
          else reject("Failed to resize");
        },
        "image/jpeg",
        0.8,
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(blob);
  });
};
export const isMediaItem = (media: {
  url: string;
  type: string;
}): media is MediaItem => {
  return media.type === "image" || media.type === "video";
};

export const convertHEICtoJPEG = async (file: File): Promise<File> => {
  const blob = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.9,
  });
  return new File([blob as Blob], file.name.replace(/\.heic$/, ".jpeg"), {
    type: "image/jpeg",
  });
};
