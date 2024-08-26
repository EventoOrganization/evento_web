// src\app\api\auth\route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token not found" }, { status: 401 });
  }

  return NextResponse.json({ token: token.value });
}
