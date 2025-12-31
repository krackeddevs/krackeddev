import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export',
  images: {
    unoptimized: false, // Enable Next.js image optimization
    formats: ['image/avif', 'image/webp'], // Modern, efficient formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache for static images
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
  // Experimental performance optimizations
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      'framer-motion',
      '@radix-ui/react-avatar',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
    ],
  },
};

export default nextConfig;
