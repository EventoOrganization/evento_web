import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { base64data, fileName } = await req.json();

    if (!base64data || !fileName) {
      return new NextResponse(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 },
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, fileName);
    const buffer = Buffer.from(base64data.split(",")[1], "base64");

    fs.writeFileSync(filePath, buffer);

    const publicFilePath = `/uploads/${fileName}`;
    console.log("publicFilePath", publicFilePath);
    return new NextResponse(
      JSON.stringify({
        message: "File uploaded successfully",
        filePath: publicFilePath,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500 },
    );
  }
}
