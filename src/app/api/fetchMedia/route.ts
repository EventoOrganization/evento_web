import AWS from "aws-sdk";
import { NextResponse } from "next/server";

export async function GET() {
  // Ensure the environment variables are properly set
  const bucketName = process.env.S3_BUCKET_NAME;

  if (!bucketName) {
    return NextResponse.json(
      { error: "S3_BUCKET_NAME environment variable is not set." },
      { status: 500 },
    );
  }

  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  const s3 = new AWS.S3();
  const params = {
    Bucket: bucketName,
    Prefix: "create-event/",
  };

  try {
    const data = await s3.listObjectsV2(params).promise();
    const mediaFiles = data.Contents?.map((item) => {
      if (item.Key && item.Size && item.Size > 0 && !item.Key.endsWith("/")) {
        const url = s3.getSignedUrl("getObject", {
          Bucket: params.Bucket,
          Key: item.Key,
        });
        return url;
      }
      return null;
    }).filter(Boolean);

    return NextResponse.json(mediaFiles, { status: 200 });
  } catch (error) {
    console.error("Error fetching S3 objects:", error);
    return NextResponse.json(
      { error: "Failed to fetch media from S3" },
      { status: 500 },
    );
  }
}
