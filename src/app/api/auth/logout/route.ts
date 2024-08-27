import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("Logout request received");

  // Clear the token cookie by setting it with an expired date
  const response = NextResponse.json({ message: "Logged out successfully" });
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
