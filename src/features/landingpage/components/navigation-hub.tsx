"use client";

import Link from "next/link";
import { Trophy, Gamepad2, Users, ArrowRight, Building2, Briefcase } from "lucide-react";

const NAV_ITEMS = [
  {
    title: "JOBS",
    description: "Browse open positions and find your next opportunity.",
    icon: Briefcase,
    href: "/jobs",
    color: "text-neon-primary",
    glowColor: "rgba(34, 197, 94, 0.3)",
  },
  {
    title: "COMPANIES",
    description: "Explore companies hiring on KrackedDev and find your next role.",
    icon: Building2,
    href: "/companies",
    color: "text-neon-primary",
    glowColor: "rgba(34, 197, 94, 0.3)",
  },
  {
    title: "BOUNTY BOARD",
    description: "Complete missions, earn rewards, and level up your rank.",
    icon: Trophy,
    href: "/code/bounty",
    color: "text-neon-primary",
    glowColor: "rgba(34, 197, 94, 0.3)",
  },
  {
    title: "AGENT DIRECTORY",
    description: "Connect with other operatives and build your squad.",
    icon: Users,
    href: "/members",
    color: "text-neon-primary",
    glowColor: "rgba(34, 197, 94, 0.3)",
  },
];

export function NavigationHub() {
  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group relative block"
          >
            <div
              className="relative h-full bg-card/60 border-2 border-neon-primary/30 p-8 transition-all duration-300 
                hover:border-neon-primary hover:bg-neon-primary/5 backdrop-blur-sm flex flex-col items-center text-center
                hover:-translate-y-1"
              style={{
                boxShadow: '0 0 0 rgba(34, 197, 94, 0)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `0 0 30px ${item.glowColor}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 rgba(34, 197, 94, 0)';
              }}
            >
              <div
                className={`mb-6 p-4 rounded-full bg-neon-primary/10 border-2 border-neon-primary/30 group-hover:scale-110 transition-transform duration-300 ${item.color}`}
              >
                <item.icon className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3 font-mono tracking-wider group-hover:text-neon-primary transition-colors uppercase">
                {item.title}
              </h3>

              <p className="text-muted-foreground text-sm mb-6 leading-relaxed font-mono">
                {item.description}
              </p>

              <div
                className={`mt-auto flex items-center text-xs font-bold uppercase tracking-widest ${item.color} opacity-70 group-hover:opacity-100 transition-opacity`}
              >
                Enter Sector{" "}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
