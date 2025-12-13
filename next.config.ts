import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp'],
    qualities: [75, 85, 90, 95],
  },
};

export default nextConfig;
