import { createApiError } from "@/lib/apiError";
import AWS from "aws-sdk";
import { NextResponse } from "next/server";

export async function GET() {
  const bucketName = process.env.S3_BUCKET_NAME;
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!bucketName || !region || !accessKeyId || !secretAccessKey) {
    return createApiError("❌ Missing AWS configuration.", 500);
  }

  AWS.config.update({
    accessKeyId,
    secretAccessKey,
    region,
  });

  const s3 = new AWS.S3();
  const params = {
    Bucket: bucketName,
    Prefix: "create-event/",
  };

  try {
    const data = await s3.listObjectsV2(params).promise();

    const files =
      data.Contents?.filter(
        (item) => item?.Key && item.Size && !item.Key.endsWith("/"),
      ).map((item) => ({
        key: item!.Key!,
        url: `https://${bucketName}.s3.${region}.amazonaws.com/${item!.Key!}`,
      })) ?? [];

    return NextResponse.json(files, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error fetching S3 objects:", error);
    return createApiError(
      error?.message || "Unknown S3 error",
      error?.statusCode || 500,
    );
  }
}
