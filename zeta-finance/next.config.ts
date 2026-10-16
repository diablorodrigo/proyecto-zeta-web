import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/shop",
        destination: "/planillas",
      },
    ];
  },
};

export default nextConfig;
