// import withPWA from "next-pwa";

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "evento-media-bucket.s3.ap-southeast-2.amazonaws.com",
//         pathname: "/**",
//       },
//       {
//         protocol: "https",
//         hostname: "github.com",
//         pathname: "/**",
//       },
//     ],
//   },
// };

// // Configuration de PWA ici
// export default withPWA({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === "production",
//   buildExcludes: [/app-build-manifest.json$/],
//   mode: process.env.NODE_ENV === "production" ? "production" : "development",
//   importScripts: ["/custom-sw.js"],
// })(nextConfig);
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

export default nextConfig;
