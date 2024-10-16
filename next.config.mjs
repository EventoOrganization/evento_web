/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "evento-media-bucket.s3.ap-southeast-2.amazonaws.com",
      "github.com",
    ],
  },
  async rewrites() {
    return [
      {
        source: "/auth/(.*)", // Capture toutes les requêtes qui commencent par /auth/
        destination: "http://backend.evento-app.io/auth/$1",
      },
      {
        source: "/users/(.*)", // Capture toutes les requêtes qui commencent par /user/
        destination: "http://backend.evento-app.io/user/$1",
      },
      {
        source: "/events/(.*)", // Capture toutes les requêtes qui commencent par /events/
        destination: "http://backend.evento-app.io/events/$1",
      },
      {
        source: "/profile/(.*)", // Capture toutes les requêtes qui commencent par /profile/
        destination: "http://backend.evento-app.io/profile/$1",
      },
      {
        source: "/chats/(.*)", // Capture toutes les requêtes qui commencent par /profile/
        destination: "http://backend.evento-app.io/chats/$1",
      },
    ];
  },
};

export default nextConfig;
