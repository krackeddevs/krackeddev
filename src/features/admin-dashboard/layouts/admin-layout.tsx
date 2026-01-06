"use client";

import { ReactNode } from 'react';
import { AdminSidebar } from '../components/admin-sidebar';

interface AdminLayoutProps {
    children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className="flex min-h-[calc(100vh-84px)] relative transition-colors duration-300">
            {/* Background Effects (Admin Specific) */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[var(--neon-primary)]/[0.02] rounded-full blur-3xl opacity-20" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[var(--neon-cyan)]/[0.02] rounded-full blur-3xl opacity-20" />
            </div>

            <div className="relative z-10 flex w-full">
                <AdminSidebar />

                <main className="flex-1 bg-transparent relative">
                    <div className="flex-1 p-4 md:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
