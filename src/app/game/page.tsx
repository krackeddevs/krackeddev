"use client";

import { RequireAuth } from "@/features/auth";
import { DojoScene, MobileWarningModal } from "@/features/game";
import { useIsMobile } from "@/lib/hooks/use-is-mobile";

export default function GamePage() {
  const isMobile = useIsMobile();

  return (
    <RequireAuth>
      <div className="min-h-screen bg-black">
        <MobileWarningModal isOpen={isMobile} />
        {!isMobile && <DojoScene />}
      </div>
    </RequireAuth>
  );
}
