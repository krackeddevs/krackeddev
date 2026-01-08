"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { GlobalSidebar } from "@/components/global-sidebar";
import Footer from "@/components/Footer";

interface AppShellProps {
    children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const isSplashPage = pathname === "/";

    return (
        <div className="relative flex flex-col min-h-screen">
            <GlobalSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Navbar onMenuClick={() => setSidebarOpen(true)} />
            <main className="flex-grow flex flex-col relative z-0">
                {children}
            </main>
            {!isSplashPage && <Footer />}
        </div>
    );
}
