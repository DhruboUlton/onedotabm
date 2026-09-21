import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev-only: lets phones/tablets on the LAN load HMR resources.
  allowedDevOrigins: ["192.168.10.115"],
};

export default nextConfig;
