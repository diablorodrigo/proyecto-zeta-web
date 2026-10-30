import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    // Solo el host viejo. Apex → www y http → https ya los resuelve Vercel
    // con un 308 antes de llegar a Next; repetirlos acá puede hacer un bucle.
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "zeta-finance.vercel.app" }],
        destination: "https://www.zetafinance.com.ar/:path*",
        permanent: true,
      },
    ];
  },
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
