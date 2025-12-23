"use client";

import { useRef } from "react";
import { useSupabase } from "@/context/SupabaseContext";

interface RequireAuthProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RequireAuth({ children, fallback = null }: RequireAuthProps) {
  const { isAuthenticated, loading, openLoginModal } = useSupabase();
  const hasOpenedModal = useRef(false);

  if (loading) {
    return fallback;
  }

  if (!isAuthenticated) {
    if (!hasOpenedModal.current) {
      hasOpenedModal.current = true;
      queueMicrotask(() => openLoginModal());
    }
    return fallback;
  }

  // Reset ref when authenticated (handles logout and revisit)
  hasOpenedModal.current = false;

  return <>{children}</>;
}
