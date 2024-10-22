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
    ],
  },
};

// Configuration de PWA ici
export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
})(nextConfig);
