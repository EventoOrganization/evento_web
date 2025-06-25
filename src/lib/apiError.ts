import { NextResponse } from "next/server";

export function createApiError(message: string, status: number = 500) {
  return NextResponse.json({ message, status }, { status });
}
