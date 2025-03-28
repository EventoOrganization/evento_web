import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "evento-media-bucket.s3.ap-southeast-2.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.evento-app.io",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost:3000",
        pathname: "/**",
      },
    ],
  },
};

// Configuration de PWA ici
export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable:
    process.env.NODE_ENV === "production" ||
    process.env.NODE_ENV === "development",
  buildExcludes: [/app-build-manifest.json$/],
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  importScripts: ["/custom-sw.js"],
})(nextConfig);
