/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
      handler: "CacheFirst",
      options: { cacheName: "google-fonts", expiration: { maxEntries: 4, maxAgeSeconds: 365 * 24 * 60 * 60 } },
    },
    {
      urlPattern: /^https:\/\/.*\.googleapis\.com\/maps\/.*/i,
      handler: "NetworkFirst",
      options: { cacheName: "google-maps", expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 } },
    },
    {
      urlPattern: /\/_next\/static\/.*/i,
      handler: "CacheFirst",
      options: { cacheName: "next-static", expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 } },
    },
    {
      urlPattern: /\/_next\/image\?.*/i,
      handler: "StaleWhileRevalidate",
      options: { cacheName: "next-image", expiration: { maxEntries: 64, maxAgeSeconds: 24 * 60 * 60 } },
    },
    {
      urlPattern: /^\/dashboard.*/i,
      handler: "StaleWhileRevalidate",
      options: { cacheName: "dashboard-pages", expiration: { maxEntries: 10, maxAgeSeconds: 24 * 60 * 60 } },
    },
  ],
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = withPWA(nextConfig);
