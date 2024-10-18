/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "evento-media-bucket.s3.ap-southeast-2.amazonaws.com",
        pathname: "/**", // Autorise toutes les images sous ce domaine
      },
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/**", // Pour les images de GitHub si nécessaire
      },
    ],
  },
};

export default nextConfig;
