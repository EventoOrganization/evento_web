/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000", // URL de base pour le frontend
  generateRobotsTxt: true, // Générer automatiquement le fichier robots.txt
  exclude: ["/api/*"], // Exclure les routes API du sitemap
  additionalPaths: async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"; // URL du backend

    // Fetch des données sitemap depuis le backend
    const { events = [], profiles = [] } = await fetch(
      `${apiUrl}/sitemap/sitemap-data`,
    )
      .then((res) => res.json())
      .catch((error) => {
        console.error("Error fetching sitemap data:", error);
        return { events: [], profiles: [] };
      });

    // Générer les chemins dynamiques pour les événements
    const eventPaths = events.map((eventId) => ({
      loc: `/events/${eventId}`, // URL dynamique pour chaque événement
      changefreq: "daily",
      priority: 0.7,
    }));

    // Générer les chemins dynamiques pour les profils d'utilisateurs
    const profilePaths = profiles.map((profileId) => ({
      loc: `/profile/${profileId}`, // URL dynamique pour chaque profil
      changefreq: "weekly",
      priority: 0.6,
    }));

    // Chemins statiques additionnels
    return [
      { loc: "/chats", changefreq: "daily", priority: 0.7 },
      { loc: "/contact", changefreq: "weekly", priority: 0.8 },
      { loc: "/events/create", changefreq: "weekly", priority: 0.9 },
      { loc: "/events", changefreq: "daily", priority: 1.0 },
      { loc: "/terms", changefreq: "yearly", priority: 0.5 },
      ...eventPaths,
      ...profilePaths,
    ];
  },
};
