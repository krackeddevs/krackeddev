"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { WhitepaperScene } from '@/components/game/WhitepaperScene';
import '../jobs/jobs.css';

export default function WhitepaperPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <main className="min-h-screen w-full bg-gray-900 relative">
      <div className="scanlines fixed inset-0 pointer-events-none z-50"></div>
      <WhitepaperScene onBack={handleBack} />
    </main>
  );
}

