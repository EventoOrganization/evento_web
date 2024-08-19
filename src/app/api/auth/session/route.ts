// src\app\api\auth\session\route.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  console.log("GET /api/auth/session");

  try {
    const session = await auth();
    const token = session?.user?.data?.token;

    if (token) {
      return NextResponse.json({ token });
    } else {
      return NextResponse.json({ error: "Failed to retrieve session" });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve session" });
  }
}
