// lib/s3.ts
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import heic2any from "heic2any";

const s3 = new S3Client({
  region: process.env.AWS_REGION || "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

async function convertHeicToJpeg(file: File): Promise<File> {
  try {
    const blob = await heic2any({ blob: file, toType: "image/jpeg" });
    const convertedBlob = Array.isArray(blob) ? blob[0] : blob;

    // Crée un nouveau fichier avec l'extension `.jpeg`
    const convertedFile = new File(
      [convertedBlob],
      file.name.replace(/\.[^.]+$/, ".jpeg"),
      { type: "image/jpeg" },
    );
    return convertedFile;
  } catch (error) {
    console.error("Error converting HEIC to JPEG:", error);
    throw new Error("HEIC to JPEG conversion failed");
  }
}

export async function uploadFileToS3(file: File, folder: string) {
  let processedFile = file;

  // Vérifie si le fichier est un HEIC et le convertit en JPEG
  if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
    processedFile = await convertHeicToJpeg(file);
  }

  const uniqueName = crypto.randomUUID();
  const fileExtension = processedFile.name.split(".").pop();
  const key = `${folder}/${uniqueName}.${fileExtension}`;
  const buffer = await processedFile.arrayBuffer();

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: Buffer.from(buffer),
    ContentType: processedFile.type,
    // ACL: "public-read" as ObjectCannedACL,
  };

  try {
    await s3.send(new PutObjectCommand(params));
    const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return { success: true, key, url };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Upload failed");
  }
}

export async function deleteFileFromS3(fileKey: string) {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey,
  };

  try {
    const response = await s3.send(new DeleteObjectCommand(params));
    console.log(`File deleted successfully: ${fileKey}`);
    console.log(response);
    return { success: true };
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw new Error("Delete failed");
  }
}
