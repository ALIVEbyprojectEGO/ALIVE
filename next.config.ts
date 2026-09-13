import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  outputFileTracingRoot: __dirname,
  basePath: "/alive",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
