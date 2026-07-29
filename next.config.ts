import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.GITHUB_PAGES === "true" ? "export" : undefined,
  basePath:
    process.env.GITHUB_PAGES === "true"
      ? process.env.NEXT_PUBLIC_BASE_PATH
      : undefined,
  assetPrefix:
    process.env.GITHUB_PAGES === "true"
      ? process.env.NEXT_PUBLIC_BASE_PATH
      : undefined,
  trailingSlash: process.env.GITHUB_PAGES === "true",
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: process.env.GITHUB_PAGES === "true",
  },
};

export default nextConfig;
