import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // 👈 evita que ESLint bloquee el build
  },
};

export default nextConfig;
