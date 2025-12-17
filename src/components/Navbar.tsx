"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Menu, User, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useSupabase } from "@/context/SupabaseContext";

interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

const PRAYER_ORDER = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

const Navbar = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const { isAuthenticated, signOut, openLoginModal, supabase } = useSupabase();
  const [pageViews, setPageViews] = React.useState<number | null>(null);
  const [nextPrayer, setNextPrayer] = React.useState<{
    name: string;
    time: string;
  } | null>(null);

  // Hide navigation links (middle section) on game pages and job detail pages, but keep header visible
  const gamePages = [
    "/blog",
    "/new-jobs",
    "/code",
    "/profile",
    "/whitepaper",
    "/members",
    "/onboarding",
  ];
  const isJobDetailPage = pathname?.startsWith("/jobs/");
  const shouldHideNavLinks =
    isHomepage || gamePages.includes(pathname) || isJobDetailPage;

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track + fetch total page views (centralized here so we don't double-count in pages)
  React.useEffect(() => {
    if (!supabase) return;

    const trackAndFetchPageViews = async () => {
      try {
        const key = "visitor_id";
        const existing = localStorage.getItem(key);
        const visitorId =
          existing ??
          (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()));
        if (!existing) localStorage.setItem(key, visitorId);

        await supabase.from("page_views").insert({
          page_path: pathname || "/",
          visitor_id: visitorId,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
        } as any);

        const { count } = await supabase
          .from("page_views")
          .select("*", { count: "exact", head: true });

        setPageViews(count ?? 0);
      } catch (error) {
        console.error("Error tracking page views:", error);
      }
    };

    trackAndFetchPageViews();
  }, [supabase, pathname]);

  // Fetch next prayer time (KL, method 17 / JAKIM) for marquee
  React.useEffect(() => {
    const calculateNextPrayer = (timings: PrayerTimes) => {
      const now = new Date();
      const timeNow = now.getHours() * 60 + now.getMinutes();

      for (const prayer of PRAYER_ORDER) {
        const [hours, minutes] = timings[prayer].split(":").map(Number);
        const prayerTime = hours * 60 + minutes;
        if (prayerTime > timeNow) {
          setNextPrayer({ name: prayer, time: timings[prayer] });
          return;
        }
      }
      setNextPrayer({ name: "Fajr", time: timings["Fajr"] });
    };

    const fetchPrayerTimes = async () => {
      try {
        const date = new Date();
        const formattedDate = `${date.getDate()}-${date.getMonth() + 1
          }-${date.getFullYear()}`;
        const res = await fetch(
          `https://api.aladhan.com/v1/timingsByCity/${formattedDate}?city=Kuala%20Lumpur&country=Malaysia&method=17`
        );
        const data = await res.json();
        const timings = data?.data?.timings as PrayerTimes | undefined;
        if (timings) calculateNextPrayer(timings);
      } catch (error) {
        console.error("Failed to fetch prayer times", error);
      }
    };

    fetchPrayerTimes();
    const interval = setInterval(fetchPrayerTimes, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled || isMobileMenuOpen
          ? "bg-background/80 backdrop-blur-lg border-white/10 shadow-[0_0_20px_rgba(21,128,61,0.1)]"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="group relative flex items-center gap-2"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="absolute -inset-2 bg-neon-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="relative font-mono text-xl font-bold tracking-tighter text-foreground group-hover:text-neon-primary transition-colors duration-300">
            &lt;Kracked Devs /&gt;
          </span>
        </Link>

        {/* Desktop Nav */}
        {!shouldHideNavLinks && (
          <div className="hidden md:flex items-center gap-8"></div>
        )}

        {/* Right Side (Desktop) */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="py-2 h-auto w-auto px-4 border border-white hover:border-neon-primary/40 hover:bg-white/5"
                aria-label="Profile"
              >
                <span>Profile</span>
                <User className="min-h-5 min-w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8}>
              <DropdownMenuLabel>Profile</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isAuthenticated ? (
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    signOut();
                  }}
                >
                  <LogOut />
                  Logout
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => {
                    openLoginModal();
                  }}
                >
                  <User />
                  Login
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu Toggle */}
        {!shouldHideNavLinks && (
          <div className="flex items-center gap-4 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground hover:text-neon-primary"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        )}
      </div>
      <div className="border-t border-white/10 bg-white/5 backdrop-blur-md">
        <div className="overflow-hidden">
          <div className="marquee text-[10px] sm:text-xs font-mono text-foreground/80">
            <div className="marquee__group px-4 py-1 flex items-center gap-4 lg:gap-20">
              <span className="text-foreground/60">
                Page visits:{" "}
                {pageViews !== null ? pageViews.toLocaleString() : "---"}
              </span>
              <span className="text-foreground/30">•</span>
              <span className="text-foreground/60">
                Next prayer (KL):{" "}
                {nextPrayer ? `${nextPrayer.name} ${nextPrayer.time}` : "---"}
              </span>
              <span className="text-foreground/30">•</span>
              <span className="text-foreground/60">Stay kracked.</span>
              <span className="text-foreground/30">•</span>
            </div>
            <div
              className="marquee__group px-4 py-1 flex items-center gap-4 lg:gap-20"
              aria-hidden="true"
            >
              <span className="text-foreground/60">
                Page visits:{" "}
                {pageViews !== null ? pageViews.toLocaleString() : "---"}
              </span>
              <span className="text-foreground/30">•</span>
              <span className="text-foreground/60">
                Next prayer (KL):{" "}
                {nextPrayer ? `${nextPrayer.name} ${nextPrayer.time}` : "---"}
              </span>
              <span className="text-foreground/30">•</span>
              <span className="text-foreground/60">Stay kracked.</span>
              <span className="text-foreground/30">•</span>
            </div>
            <div
              className="marquee__group px-4 py-1 flex items-center gap-4 lg:gap-20"
              aria-hidden="true"
            >
              <span className="text-foreground/60">
                Page visits:{" "}
                {pageViews !== null ? pageViews.toLocaleString() : "---"}
              </span>
              <span className="text-foreground/30">•</span>
              <span className="text-foreground/60">
                Next prayer (KL):{" "}
                {nextPrayer ? `${nextPrayer.name} ${nextPrayer.time}` : "---"}
              </span>
              <span className="text-foreground/30">•</span>
              <span className="text-foreground/60">Stay kracked.</span>
              <span className="text-foreground/30">•</span>
            </div>
            <div
              className="marquee__group px-4 py-1 flex items-center gap-4 lg:gap-20"
              aria-hidden="true"
            >
              <span className="text-foreground/60">
                Page visits:{" "}
                {pageViews !== null ? pageViews.toLocaleString() : "---"}
              </span>
              <span className="text-foreground/30">•</span>
              <span className="text-foreground/60">
                Next prayer (KL):{" "}
                {nextPrayer ? `${nextPrayer.name} ${nextPrayer.time}` : "---"}
              </span>
              <span className="text-foreground/30">•</span>
              <span className="text-foreground/60">Stay kracked.</span>
              <span className="text-foreground/30">•</span>
            </div>
            <div
              className="marquee__group px-4 py-1 flex items-center gap-4 lg:gap-20"
              aria-hidden="true"
            >
              <span className="text-foreground/60">
                Page visits:{" "}
                {pageViews !== null ? pageViews.toLocaleString() : "---"}
              </span>
              <span className="text-foreground/30">•</span>
              <span className="text-foreground/60">
                Next prayer (KL):{" "}
                {nextPrayer ? `${nextPrayer.name} ${nextPrayer.time}` : "---"}
              </span>
              <span className="text-foreground/30">•</span>
              <span className="text-foreground/60">Stay kracked.</span>
              <span className="text-foreground/30">•</span>
            </div>
          </div>
        </div>
        <style jsx>{`
          .marquee {
            display: flex;
            width: max-content;
            will-change: transform;
            animation: marquee 60s linear infinite;
          }
          .marquee__group {
            display: inline-flex;
            align-items: center;
            white-space: nowrap;
          }
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .marquee {
              animation: none;
              transform: none;
            }
          }
        `}</style>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && !shouldHideNavLinks && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 space-y-4 flex flex-col">
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="border border-white/10 hover:border-neon-primary/40 hover:bg-white/5"
                      aria-label="Profile"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" sideOffset={8}>
                    <DropdownMenuLabel>Profile</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isAuthenticated ? (
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => {
                          signOut();
                        }}
                      >
                        <LogOut />
                        Logout
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => {
                          openLoginModal();
                        }}
                      >
                        <User />
                        Login
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Neon Line */}
      <div
        className={cn(
          "absolute bottom-0 left-0 h-px bg-linear-to-r from-transparent via-neon-primary to-transparent transition-all duration-500",
          isScrolled || isMobileMenuOpen ? "w-full opacity-50" : "w-0 opacity-0"
        )}
      />
    </motion.nav>
  );
};

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="relative text-sm font-medium text-zinc-50 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:text-neon-primary transition-colors duration-300 py-2 group"
  >
    {children}
    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-neon-primary shadow-[0_0_10px_var(--neon-primary)] group-hover:w-full transition-all duration-300" />
  </Link>
);

const MobileNavLink = ({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className="text-lg font-medium text-zinc-50 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:text-neon-primary hover:pl-2 transition-all duration-300 border-l-2 border-transparent hover:border-neon-primary py-2"
  >
    {children}
  </Link>
);

export default Navbar;
