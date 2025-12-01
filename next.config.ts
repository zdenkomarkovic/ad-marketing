import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "apiv1.promosolution.services",
      },
      {
        protocol: "https",
        hostname: "apiv2.promosolution.services",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 3600, // Cache images for 1 hour
    dangerouslyAllowSVG: false,
  },
  // Enable compression
  compress: true,
  // Enable React strict mode for better performance debugging
  reactStrictMode: true,
  // Production source maps disabled for smaller bundles
  productionBrowserSourceMaps: false,
};

export default nextConfig;
