// src/pages/api/getToken.ts

import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers"; // Available in Next.js 13+ API routes

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  // Get token from cookies
  const cookieToken = cookies().get("token");

  if (!cookieToken?.value) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = cookieToken.value;

  // Now you can use the token for further API calls, validation, etc.
  res.status(200).json({ message: "Token found", token });
}
