import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
    qualities: [75, 85, 90, 95],
  },
  serverExternalPackages: ["pdfkit"],
};

export default nextConfig;
