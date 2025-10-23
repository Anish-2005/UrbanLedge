import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // allow all domains
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    dangerouslyAllowSVG: true,
  },
  // Allow building even if TypeScript reports errors and skip ESLint during build.
  // NOTE: This silences type/lint errors in production — prefer fixing them long-term.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Danger: setting this to true will allow production builds to succeed even with type errors.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
