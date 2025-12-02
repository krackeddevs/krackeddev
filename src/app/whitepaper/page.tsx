"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { WhitepaperScene } from '@/components/game/WhitepaperScene';
import { MusicPlayer } from '@/components/game/MusicPlayer';
import { SoundToggle } from '@/components/game/SoundToggle';
import '../jobs/jobs.css';

export default function WhitepaperPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <main className="min-h-screen w-full bg-gray-900 relative">
      <MusicPlayer startPlaying={true} />
      <SoundToggle />
      <div className="scanlines fixed inset-0 pointer-events-none z-50"></div>
      <WhitepaperScene onBack={handleBack} />
    </main>
  );
}



