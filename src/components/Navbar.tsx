"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Menu, User, X, Shield, Home } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useSupabase } from "@/context/SupabaseContext";
import { usePageViews } from "@/lib/hooks/use-page-views";
import { usePrayerTimes } from "@/lib/hooks/use-prayer-times";
import { ModeToggle } from "./mode-toggle";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const { isAuthenticated, signOut, openLoginModal, profile } = useSupabase();
  const { data: pageViews } = usePageViews(pathname || "/");
  const { data: nextPrayer } = usePrayerTimes();

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
  const isDashboardPage = pathname?.startsWith("/dashboard");
  const shouldHideNavLinks =
    isHomepage || gamePages.includes(pathname) || isJobDetailPage;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Completely hide navbar on dashboard (after all hooks)
  if (isDashboardPage) return null;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled || isMobileMenuOpen
          ? "bg-background/70 backdrop-blur-md border-primary/20 shadow-[0_0_20px_rgba(21,128,61,0.1)]"
          : "bg-background/20 backdrop-blur-sm border-transparent",
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
          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-yellow-500 text-black rounded uppercase tracking-wider animate-flicker shadow-[0_0_10px_rgba(234,179,8,0.8)]">
            Beta
          </span>
        </Link>

        {/* Right Side (Desktop) */}
        <div className="flex items-center gap-2">
          {/* Home Button - For admins when on admin pages */}
          {isAuthenticated &&
            profile?.role === "admin" &&
            pathname?.startsWith("/admin") && (
              <Button
                variant="ghost"
                asChild
                className="py-2 h-auto w-auto px-2 sm:px-4 border border-border hover:border-primary hover:bg-primary/10"
              >
                <Link href="/">
                  <Home className="min-h-4 min-w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Home</span>
                </Link>
              </Button>
            )}
          {/* Admin Dashboard Button - Only for admins when NOT on admin pages */}
          {isAuthenticated &&
            profile?.role === "admin" &&
            !pathname?.startsWith("/admin") && (
              <Button
                variant="ghost"
                asChild
                className="py-2 h-auto w-auto px-2 sm:px-4 border border-yellow-500/50 hover:border-yellow-400 hover:bg-yellow-500/10 text-yellow-400"
              >
                <Link href="/admin/dashboard">
                  <Shield className="min-h-4 min-w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              </Button>
            )}

          <ModeToggle />

          {/* Hiring Button */}
          <Button
            variant="ghost"
            asChild
            className="hidden md:flex py-2 h-auto w-auto px-2 sm:px-4 text-muted-foreground hover:text-foreground"
          >
            <Link href="/hire/register">Hiring?</Link>
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="py-2 h-auto w-auto px-2 sm:px-4 border border-primary/50 hover:border-primary hover:bg-primary/10"
                  aria-label="Profile"
                >
                  <span className="hidden sm:inline mr-2">Profile</span>
                  <User className="min-h-5 min-w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8}>
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="cursor-pointer w-full font-semibold"
                  >
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    signOut();
                  }}
                >
                  <LogOut />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              onClick={() => openLoginModal()}
              className="py-2 h-auto w-auto px-2 sm:px-4 border border-primary/50 hover:border-primary hover:bg-primary/10"
            >
              <span className="hidden sm:inline mr-2">Login</span>
              <User className="min-h-5 min-w-5" />
            </Button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        {
          !shouldHideNavLinks && (
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
          )
        }
      </div >
      <div className="border-t border-primary/20 bg-primary/5 backdrop-blur-md">
        <div className="overflow-hidden">
          <div className="marquee text-[10px] sm:text-xs font-mono text-foreground/80">
            <div className="marquee__group px-4 py-1 flex items-center gap-4 lg:gap-20">
              <span className="text-foreground/60">
                Page visits:{" "}
                {pageViews != null ? pageViews.toLocaleString() : "---"}
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
                {pageViews != null ? pageViews.toLocaleString() : "---"}
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
                {pageViews != null ? pageViews.toLocaleString() : "---"}
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
                {pageViews != null ? pageViews.toLocaleString() : "---"}
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
                {pageViews != null ? pageViews.toLocaleString() : "---"}
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
            className="md:hidden border-t border-primary/20 bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 space-y-4 flex flex-col">
              <div className="pt-4 border-t border-primary/20 flex items-center justify-between">
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="border border-primary/20 hover:border-neon-primary/40 hover:bg-primary/5"
                        aria-label="Profile"
                      >
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" sideOffset={8}>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/profile"
                          className="cursor-pointer w-full font-semibold"
                        >
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => {
                          signOut();
                        }}
                      >
                        <LogOut />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    variant="ghost"
                    onClick={() => openLoginModal()}
                    className="border border-primary/20 hover:border-neon-primary/40 hover:bg-primary/5"
                  >
                    <User className="h-5 w-5 mr-2" />
                    Login
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Neon Line */}
      <div
        className={cn(
          "absolute bottom-0 left-0 h-px bg-linear-to-r from-transparent via-neon-primary to-transparent transition-all duration-500",
          isScrolled || isMobileMenuOpen
            ? "w-full opacity-50"
            : "w-0 opacity-0",
        )}
      />
    </motion.nav >
  );
};

export default Navbar;
