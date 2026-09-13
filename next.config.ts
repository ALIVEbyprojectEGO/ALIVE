import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  outputFileTracingRoot: __dirname,
  // GitHub Pages serves at /<repo-name> (case-sensitive, repo is "ALIVE").
  basePath: process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}`
    : "/alive",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
