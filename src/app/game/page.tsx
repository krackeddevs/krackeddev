"use client";

import { RequireAuth } from "@/features/auth";
import { DojoScene } from "@/features/game";

export default function GamePage() {
  return (
    <RequireAuth>
      <div className="min-h-screen bg-black">
        <DojoScene />
      </div>
    </RequireAuth>
  );
}
