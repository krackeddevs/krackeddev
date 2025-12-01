"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ProfileScene } from '@/components/game/ProfileScene';
import '../jobs/jobs.css';

export default function ProfilePage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <main className="min-h-screen w-full bg-gray-900 relative">
      <div className="scanlines fixed inset-0 pointer-events-none z-50"></div>
      <ProfileScene onBack={handleBack} />
    </main>
  );
}

