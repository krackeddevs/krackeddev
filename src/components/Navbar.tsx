"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, User, Sun, Moon, Zap, Ghost, LogOut, Shield, Volume2, VolumeX } from "lucide-react";
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
import { useTheme } from "next-themes";

// Audio Toggle Button Component
const AudioToggleButton = () => {
  const [isMuted, setIsMuted] = useState(true); // Default to true (muted)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Default to muted (true) if not set in localStorage, otherwise use stored value
    const storedMuted = localStorage.getItem("soundMuted");
    const muted = storedMuted === null ? true : storedMuted === "true";
    setIsMuted(muted);

    const handleSoundToggle = (e: CustomEvent) => {
      setIsMuted(e.detail.muted);
    };

    window.addEventListener("soundToggle", handleSoundToggle as EventListener);
    return () => window.removeEventListener("soundToggle", handleSoundToggle as EventListener);
  }, []);

  const toggleSound = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem("soundMuted", newMuted.toString());
    window.dispatchEvent(new CustomEvent("soundToggle", { detail: { muted: newMuted } }));
  };

  if (!mounted) return null;

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        toggleSound();
      }}
      className="w-6 h-6 rounded-sm border border-border/30 bg-background hover:bg-muted/50 flex items-center justify-center transition-all group"
      aria-label={isMuted ? "Unmute audio" : "Mute audio"}
      title={isMuted ? "Unmute audio" : "Mute audio"}
    >
      {isMuted ? (
        <VolumeX className="w-3 h-3 text-foreground/50 group-hover:text-destructive transition-colors" />
      ) : (
        <Volume2 className="w-3 h-3 text-foreground/50 group-hover:text-[var(--neon-primary)] transition-colors" />
      )}
    </button>
  );
};

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const pathname = usePathname();
  const { isAuthenticated, signOut, openLoginModal, profile } = useSupabase();
  const { data: pageViews } = usePageViews(pathname || "/");
  const { data: nextPrayer } = usePrayerTimes();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const cycleTheme = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("monochrome-dark");
    else if (theme === "monochrome-dark") setTheme("monochrome-light");
    else setTheme("dark");
  };

  const getThemeIcon = () => {
    if (theme === "dark") return <Moon className="w-4 h-4 text-[#22c55e]" />;
    if (theme === "light") return <Sun className="w-4 h-4 text-[#15803d]" />;
    if (theme === "monochrome-dark") return <Zap className="w-4 h-4 text-white" />;
    if (theme === "monochrome-light") return <Ghost className="w-4 h-4 text-black" />;
    return <Moon className="w-4 h-4" />;
  };

  const getThemeLabel = () => {
    if (theme === "dark") return "DARK NEON";
    if (theme === "light") return "LIGHT NEON";
    if (theme === "monochrome-dark") return "DARK NOIR";
    if (theme === "monochrome-light") return "LIGHT NOIR";
    return "THEME";
  };

  return (
    <div className="flex flex-col sticky top-0 z-50">
      <header className="h-14 flex items-center justify-between px-4 border-b border-border/20 bg-background transition-colors duration-300">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="text-[var(--neon-primary)] hover:bg-[var(--neon-primary)]/10 h-8 w-8">
            <Menu className="w-5 h-5" />
          </Button>

          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className="font-mono text-sm sm:text-base md:text-lg font-bold tracking-tighter text-foreground group-hover:text-[var(--neon-primary)] transition-colors duration-300 whitespace-nowrap">
              &lt;Kracked Devs /&gt;
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider bg-[var(--beta-badge)] text-[var(--beta-badge-text)]">
              BETA
            </span>
            {/* Audio Toggle Button */}
            <AudioToggleButton />
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2">
            <Button
              variant="ghost"
              asChild
              className="text-foreground/60 hover:text-[var(--neon-primary)] font-mono text-[10px] uppercase tracking-widest h-8"
            >
              <Link href="/for-company">For Company</Link>
            </Button>

            <Button
              variant="ghost"
              asChild
              className="text-foreground/60 hover:text-[var(--neon-primary)] font-mono text-[10px] uppercase tracking-widest h-8"
            >
              <Link href="/for-developers">For Developers</Link>
            </Button>

            <Button
              variant="ghost"
              asChild
              className="text-foreground/60 hover:text-[var(--neon-primary)] font-mono text-[10px] uppercase tracking-widest h-8"
            >
              <Link href="/for-government">For Government</Link>
            </Button>

            <Button
              asChild
              className="bg-transparent border border-[var(--neon-primary)]/50 text-[var(--neon-primary)] hover:bg-[var(--neon-primary)] hover:text-background font-mono text-[10px] uppercase tracking-widest h-8 px-4 rounded-sm transition-all ml-2"
            >
              <Link href="/hire/register">Hiring?</Link>
            </Button>
          </div>

          <div className="flex items-center h-8 bg-background border border-border/20 rounded-sm ml-2 overflow-hidden shadow-sm">
            <Button
              variant="ghost"
              className="h-full px-3 text-foreground/50 hover:text-[var(--neon-primary)] flex items-center gap-2 transition-colors border-none"
              onClick={cycleTheme}
              title={`Current Theme: ${getThemeLabel()}`}
            >
              {getThemeIcon()}
              <span className="text-[9px] font-mono font-bold tracking-widest hidden sm:inline">{getThemeLabel()}</span>
            </Button>

            <div className="w-[1px] h-4 bg-border/20" />

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-full w-8 text-foreground/50 hover:text-[var(--neon-primary)] border-none">
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background border-border/20">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer font-mono text-foreground hover:text-[var(--neon-primary)]">PROFILE</Link>
                  </DropdownMenuItem>
                  {profile?.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard" className="cursor-pointer font-mono text-[#fbbf24]">ADMIN</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-border/10" />
                  <DropdownMenuItem
                    className="text-red-500 font-mono"
                    onClick={() => signOut()}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    LOGOUT
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" className="h-full w-8 text-foreground/50 hover:text-[var(--neon-primary)] border-none" onClick={() => openLoginModal()}>
                <User className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Ticker Bar Integration */}
      <div className="h-7 border-b border-border/10 bg-background overflow-hidden flex items-center transition-colors">
        <div className="flex whitespace-nowrap animate-marquee-ticker">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center">
              <div className="flex items-center mx-10">
                <span className="text-[9px] font-mono text-foreground/30 mr-2 uppercase tracking-wide">Next prayer (KL):</span>
                <span className="text-[9px] font-mono text-[var(--neon-primary)] uppercase font-bold tracking-widest">
                  {nextPrayer ? `${nextPrayer.name} ${nextPrayer.time}` : "---"}
                </span>
                <span className="ml-10 text-foreground/10">•</span>
              </div>
              <div className="flex items-center mx-10">
                <span className="text-[9px] font-mono text-foreground/30 mr-2 uppercase tracking-wide">Page visits:</span>
                <span className="text-[9px] font-mono text-[var(--neon-primary)] uppercase font-bold tracking-widest">
                  {pageViews != null ? pageViews.toLocaleString() : "0"}
                </span>
                <span className="ml-10 text-foreground/10">•</span>
              </div>
              <div className="flex items-center mx-10">
                <span className="text-[9px] font-mono text-foreground/30 mr-2 uppercase tracking-wide">Status:</span>
                <span className="text-[9px] font-mono text-[var(--neon-primary)] uppercase font-bold tracking-widest">STAY KRACKED.</span>
                <span className="ml-10 text-foreground/10">•</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
                @keyframes marquee-ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee-ticker {
                    animation: marquee-ticker 80s linear infinite;
                }
            `}</style>
    </div>
  );
};

export default Navbar;
