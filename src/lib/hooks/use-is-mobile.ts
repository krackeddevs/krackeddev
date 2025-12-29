"use client";

import { useState, useEffect } from "react";

/**
 * Hook to detect if the user is accessing the page from a mobile device.
 * Uses window.innerWidth < 768 as the breakpoint (matching Tailwind's md breakpoint).
 * Listens for resize events to handle orientation changes.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on mount
    checkMobile();

    // Listen for resize events
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return isMobile;
}
