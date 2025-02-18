// lib/s3.ts
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION || "",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function uploadFileToS3(file: File, folder: string) {
  const uniqueName = crypto.randomUUID();
  const fileExtension = file.name.split(".").pop();
  const key = `${folder}/${uniqueName}.${fileExtension}`;
  const buffer = await file.arrayBuffer();

  const params = {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
    Key: key,
    Body: Buffer.from(buffer),
    ContentType: file.type,
    // ACL: "public-read" as ObjectCannedACL,
  };

  try {
    await s3.send(new PutObjectCommand(params));
    const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;

    return { success: true, key, url };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Upload failed");
  }
}

export async function deleteFileFromS3(fileKey: string) {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
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
