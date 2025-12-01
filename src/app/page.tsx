"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SplitTextAnimation from "./components/SplitTextAnimation";
import JobTownBoard from "@/components/jobs/JobTownBoard";
import "./jobs/jobs.css";

export default function Home() {
  const [showAnimation, setShowAnimation] = useState(true);
  const router = useRouter();

  return (
    <main className="min-h-screen w-full bg-gray-900 relative">
      {/* CRT Scanline Overlay */}
      {!showAnimation && (
        <div className="scanlines fixed inset-0 pointer-events-none z-50"></div>
      )}
      {showAnimation && (
        <SplitTextAnimation
          text="Welcome to Kracked Devs"
          onComplete={() => setShowAnimation(false)}
        />
      )}
      {!showAnimation && (
        <JobTownBoard
          onVisitJobs={() => router.push("/jobs")}
          onVisitBlog={() => router.push("/blog")}
          onVisitHackathon={() => router.push("/hackathon")}
        />
      )}
    </main>
  );
}
