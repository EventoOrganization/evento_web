import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.query) {
      console.error("[API] ❌ Missing query parameter");
      return NextResponse.json(
        { error: "Query parameter is missing" },
        { status: 400 },
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error("[API] ❌ Missing Google API Key");
      return NextResponse.json(
        { error: "Missing Google API Key" },
        { status: 500 },
      );
    }

    const googleResponse = await fetch(
      `https://places.googleapis.com/v1/places:searchText`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "places.formattedAddress,places.location,places.types",
        } as HeadersInit,
        body: JSON.stringify({
          textQuery: body.query,
          languageCode: "fr",
        }),
      },
    );

    if (!googleResponse.ok) {
      console.error(
        "[API] ❌ Google API returned error:",
        googleResponse.statusText,
      );
      return NextResponse.json(
        { error: `Google API error: ${googleResponse.statusText}` },
        { status: googleResponse.status },
      );
    }

    const data = await googleResponse.json();
    console.log("[API] ✅ Google Places API response:", data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("[API] ❌ Internal Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
