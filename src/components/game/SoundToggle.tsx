"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export const SoundToggle: React.FC = () => {
  // Always start with false to match server render
  const [isMuted, setIsMuted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Mark as client-side rendered
    setIsClient(true);

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Load initial state from localStorage on client only
    const muted = localStorage.getItem("soundMuted") === "true";
    setIsMuted(muted);

    // Sync with localStorage changes
    const handleStorageChange = () => {
      const muted = localStorage.getItem("soundMuted") === "true";
      setIsMuted(muted);
    };

    // Sync with soundToggle events from MobileControls
    const handleSoundToggle = (e: CustomEvent) => {
      setIsMuted(e.detail.muted);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("soundToggle", handleSoundToggle as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "soundToggle",
        handleSoundToggle as EventListener
      );
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const toggleSound = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem("soundMuted", newMuted.toString());

    // Trigger custom event for MusicPlayer to listen
    window.dispatchEvent(
      new CustomEvent("soundToggle", { detail: { muted: newMuted } })
    );
  };

  // Render consistent initial state until client-side hydration
  const displayMuted = isClient ? isMuted : false;

  // This component is now deprecated - audio toggle is in the navbar
  // Always return null to hide this old floating button
  return null;
};
