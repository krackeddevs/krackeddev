"use client";

import React from "react";
import { TownhallV2 } from "@/features/landingpage/components/townhall";
import "@/styles/jobs.css";

export default function V2Page() {
  return (
    <main className="min-h-screen w-full bg-gray-900 relative">
      {/* CRT Scanline Overlay */}
      <div className="scanlines fixed inset-0 pointer-events-none z-50" />
      <TownhallV2 />
    </main>
  );
}
