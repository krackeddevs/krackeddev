"use client";

import Link from "next/link";
import { Trophy, Gamepad2, Users, ArrowRight } from "lucide-react";

const NAV_ITEMS = [
  {
    title: "BOUNTY BOARD",
    description: "Complete missions, earn rewards, and level up your rank.",
    icon: Trophy,
    href: "/code/bounty",
    color: "text-yellow-500",
    borderColor: "group-hover:border-yellow-500/50",
    bgColor: "group-hover:bg-yellow-500/10",
  },
  /*
  {
    title: "GAME WORLD",
    description: "Explore the virtual HQ, find hidden easter eggs and secrets.",
    icon: Gamepad2,
    href: "/game",
    color: "text-purple-500",
    borderColor: "group-hover:border-purple-500/50",
    bgColor: "group-hover:bg-purple-500/10",
  },
  */
  {
    title: "AGENT DIRECTORY",
    description: "Connect with other operatives and build your squad.",
    icon: Users,
    href: "/members",
    color: "text-blue-500",
    borderColor: "group-hover:border-blue-500/50",
    bgColor: "group-hover:bg-blue-500/10",
  },
];

export function NavigationHub() {
  return (
    <div className="container mx-auto px-4 py-8 relative z-10">
      <div className="flex flex-col md:flex-row justify-center gap-6">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group relative block w-full md:max-w-sm flex-1"
          >
            <div
              className={`absolute inset-0 transition-opacity duration-300 opacity-0 ${item.bgColor.replace("group-hover:", "")}`}
            />

            <div
              className={`relative h-full bg-black/40 border border-gray-800 p-8 transition-all duration-300 ${item.borderColor} backdrop-blur-sm flex flex-col items-center text-center`}
            >
              <div
                className={`mb-6 p-4 rounded-full bg-gray-900 border border-gray-700 group-hover:scale-110 transition-transform duration-300 ${item.color}`}
              >
                <item.icon className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-white mb-3 font-mono tracking-wider group-hover:text-white transition-colors">
                {item.title}
              </h3>

              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
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
