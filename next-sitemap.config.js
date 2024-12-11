module.exports = {
  siteUrl: "https://www.evento-app.io",
  generateRobotsTxt: true,
  additionalPaths: async () => {
    return [
      { loc: "/chats", changefreq: "daily", priority: 0.7 },
      { loc: "/contact", changefreq: "weekly", priority: 0.8 },
      { loc: "/create-event", changefreq: "weekly", priority: 0.9 },
      { loc: "/discover", changefreq: "daily", priority: 1.0 },
      { loc: "/event/[id]", changefreq: "daily", priority: 0.7 },
      { loc: "/profile/[id]", changefreq: "weekly", priority: 0.6 },
      { loc: "/terms", changefreq: "yearly", priority: 0.5 },
    ];
  },
};
