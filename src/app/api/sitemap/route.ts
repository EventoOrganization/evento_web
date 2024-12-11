import { EventType } from "@/types/EventType";
import { UserType } from "@/types/UserType";
import { NextResponse } from "next/server";

export async function GET() {
  // Simuler une récupération d'IDs dynamiques (remplacez par vos appels DB/API)
  const events = await fetch("https://api.evento-app.io/events").then((res) =>
    res.json(),
  );
  const profiles = await fetch("https://api.evento-app.io/profiles").then(
    (res) => res.json(),
  );

  const baseUrl = "https://www.evento-app.io";

  // Générer les URLs
  const urls = [
    ...events.map((event: EventType) => `${baseUrl}/event/${event._id}`),
    ...profiles.map((profile: UserType) => `${baseUrl}/profile/${profile._id}`),
    `${baseUrl}/chats`,
    `${baseUrl}/contact`,
    `${baseUrl}/discover`,
    `${baseUrl}/terms`,
  ];

  // Construire le XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `
  <url>
    <loc>${url}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`,
  )
  .join("")}
</urlset>`;

  // Retourner le sitemap en réponse
  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
