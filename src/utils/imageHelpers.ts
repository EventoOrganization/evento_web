import { Area } from "react-easy-crop";

// Fonction pour charger une image
const createImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (err) => reject(err));
    image.src = url;
  });
};

// Fonction pour obtenir l'image recadrée et redimensionnée
export const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area,
  imageWidth: number,
  imageHeight: number,
  zoom: number,
  outputWidth: number = 250, // Redimensionner à 250x250 par défaut
  outputHeight: number = 250, // Redimensionner à 250x250 par défaut
): Promise<string | null> => {
  const image = await createImage(imageSrc);

  // Premier canvas pour le recadrage initial
  const cropCanvas = document.createElement("canvas");
  const cropCtx = cropCanvas.getContext("2d");

  if (!cropCtx) return null;

  // Calcul des dimensions pour recadrer à partir de l'image d'origine
  const cropX = (pixelCrop.x * imageWidth) / 100;
  const cropY = (pixelCrop.y * imageHeight) / 100;
  const cropWidth = (pixelCrop.width * imageWidth) / 100;
  const cropHeight = (pixelCrop.height * imageHeight) / 100;

  console.log("Crop values:", { cropX, cropY, cropWidth, cropHeight });

  // Canvas pour le recadrage : dimensions exactes de la zone sélectionnée
  cropCanvas.width = cropWidth;
  cropCanvas.height = cropHeight;

  // Dessiner la partie recadrée dans `cropCanvas`
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

  // Deuxième canvas pour le redimensionnement à la taille de sortie souhaitée
  const outputCanvas = document.createElement("canvas");
  const outputCtx = outputCanvas.getContext("2d");

  if (!outputCtx) return null;

  // Dimensions finales du canvas pour redimensionnement
  outputCanvas.width = outputWidth;
  outputCanvas.height = outputHeight;

  // Redimensionner la zone recadrée pour la taille de sortie
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

  // Retourne l'image redimensionnée sous forme de Data URL
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
    ); // Compression à 60% de qualité
  });
};
