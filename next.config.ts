import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "jjitmsvvaksjkvbrzpnw.supabase.co",
      },
    ],
  },
  // Disable features incompatible with static export
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
