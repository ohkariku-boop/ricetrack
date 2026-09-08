import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Avoid ESLint config resolution issues on Vercel during build
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
