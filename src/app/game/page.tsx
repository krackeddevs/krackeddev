"use client";

import { RequireAuth } from "@/features/auth";

export default function GamePage() {
  return (
    <RequireAuth>
      <div className="container mx-auto p-4">
        <h1>Game</h1>
        {/* Game content will go here */}
      </div>
    </RequireAuth>
  );
}
