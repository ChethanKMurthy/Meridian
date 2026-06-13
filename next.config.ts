import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@electric-sql/pglite"],
  // Allow opening the dev server from other devices on the local network
  // (e.g. a phone on the same Wi-Fi). Affects `next dev` only.
  allowedDevOrigins: ["192.168.1.4", "192.168.1.7", "192.168.1.0/24"],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
