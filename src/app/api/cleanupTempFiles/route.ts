// src/app/api/cleanupTempFiles.js
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(req: NextRequest) {
  console.log("Cleaning up temporary files", "req", req);
  if (req.method === "POST") {
    const body = await req.json();
    const { files } = body;

    files.forEach((fileName: string) => {
      const filePath = path.join(process.cwd(), "public/uploads", fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete the file
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
