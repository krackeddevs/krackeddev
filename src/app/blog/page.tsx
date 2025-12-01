"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BlogScene } from '@/components/game/BlogScene';
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
        <div className="scanlines fixed inset-0 pointer-events-none z-50"></div>
        <BlogScene onBack={handleBack} />
      </main>
    );
  }

  // Fallback to original blog page if needed
  return null;
}
