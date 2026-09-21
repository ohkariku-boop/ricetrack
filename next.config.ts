import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
  // Unblock deploys if ESLint plugin resolution flakes on Vercel
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
