/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "evento-media-bucket.s3.ap-southeast-2.amazonaws.com",
      "github.com",
    ],
  },
};

export default nextConfig;
