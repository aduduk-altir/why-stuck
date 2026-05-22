import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/deck", destination: "/deck.html" }];
  },
};

export default nextConfig;
