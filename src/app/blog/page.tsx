"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BlogScene } from '@/components/game/BlogScene';
import { MusicPlayer } from '@/components/game/MusicPlayer';
import { SoundToggle } from '@/components/game/SoundToggle';
import '../jobs/jobs.css';

export default function BlogPage() {
  const router = useRouter();
  const [showGame, setShowGame] = useState(true);

  const handleBack = () => {
    router.push('/');
  };

  if (showGame) {
    return (
      <main className="min-h-screen w-full bg-gray-900 relative">
        <MusicPlayer startPlaying={true} />
        <SoundToggle />
        <div className="scanlines fixed inset-0 pointer-events-none z-50"></div>
        <BlogScene onBack={handleBack} />
      </main>
    );
  }

  // Fallback to original blog page if needed
  return null;
}
