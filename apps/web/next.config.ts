import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["api.dicebear.com", "ui-avatars.com"],
  },
};

export default nextConfig;
