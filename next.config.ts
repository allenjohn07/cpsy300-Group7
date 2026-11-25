import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  output: "standalone",
  // Load the Azure SDKs with Node's require instead of bundling them. Bundling
  // @azure/identity pulls in powershell-utils, whose hardcoded powershell.exe
  // path makes Turbopack fail the build.
  serverExternalPackages: ["@azure/service-bus", "@azure/identity"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
