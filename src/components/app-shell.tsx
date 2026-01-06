"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { GlobalSidebar } from "@/components/global-sidebar";

interface AppShellProps {
    children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="relative flex flex-col min-h-screen">
            <GlobalSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Navbar onMenuClick={() => setSidebarOpen(true)} />
            <main className="flex-grow flex flex-col relative z-0">
                {children}
            </main>
        </div>
    );
}
