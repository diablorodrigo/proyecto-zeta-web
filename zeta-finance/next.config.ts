import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    // Apex → www y http → https ya los resuelve Vercel con un 308 antes de
    // llegar a Next (http se queda en el mismo host y el apex pasa a www en
    // el salto siguiente). Repetirlos acá puede hacer un bucle.
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "zeta-finance.vercel.app" }],
        destination: "https://www.zetafinance.com.ar/:path*",
        permanent: true,
      },
      {
        source: "/shop",
        destination: "/planillas",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
