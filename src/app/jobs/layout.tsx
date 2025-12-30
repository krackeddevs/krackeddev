import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kracked Jobs",
  description:
    "Level up your career with Kracked Jobs. Earn XP, unlock badges, climb the leaderboard, and find your dream tech job. Search and filter jobs by tech stack, location, and type.",
  openGraph: {
    title: "Kracked Jobs | Kracked Devs",
    description:
      "Level up your career with Kracked Jobs. Earn XP, unlock badges, and find your dream tech job.",
    url: "/jobs",
    type: "website",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Kracked Jobs" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kracked Jobs",
    description:
      "Level up your career. Earn XP, unlock badges, and climb the leaderboard!",
    images: ["/images/og-image-twitter.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

import "@/styles/jobs.css";

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-neon-lime selection:text-black">
      {/* Global Grid Overlay (Managed by global CSS on body, but ensuring visibility here if needed or just letting transparency work) */}

      {/* CRT Scanline Overlay - Fixed to viewport */}
      <div className="scanlines fixed inset-0 pointer-events-none z-50 h-screen"></div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-primary/10 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-secondary/10 rounded-full blur-3xl opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
