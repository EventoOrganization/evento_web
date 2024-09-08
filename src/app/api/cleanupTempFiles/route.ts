// src/app/api/cleanupTempFiles.js
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(req: NextRequest) {
  console.log("Cleaning up temporary files");
  if (req.method === "POST") {
    const body = await req.json();

    const files = body;

    files.forEach((file: { url: string }) => {
      const fileName = path.basename(file.url);

      const filePath = path.join(process.cwd(), "public/uploads", fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filePath}`);
      } else {
        console.log(`File not found: ${filePath}`);
      }
    });

    return NextResponse.json({
      message: "Temporary files deleted successfully",
    });
  } else {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 },
    );
  }
}
