"use client";

import { ReactNode, useState } from 'react';
import { AdminSidebar, AdminSidebarContent } from '../components/admin-sidebar';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
    children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex flex-col h-[calc(100vh-theme(spacing.16)-theme(spacing.8))] w-full bg-black text-foreground relative overflow-hidden">
            {/* Grid Overlay */}
            <div
                className="fixed inset-0 pointer-events-none z-0 opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />

            {/* Scanlines Effect */}
            <div
                className="fixed inset-0 pointer-events-none z-10 opacity-10"
                style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.5) 2px, rgba(0, 0, 0, 0.5) 4px)'
                }}
            />

            <div className="flex flex-1 min-h-0 relative z-20">
                {/* Desktop Sidebar */}
                <AdminSidebar />

                <main className="flex-1 flex flex-col min-h-0">
                    {/* Mobile Header */}
                    <div className="md:hidden border-b border-green-500/30 bg-black/95 backdrop-blur p-4 flex items-center shrink-0">
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="mr-2 hover:bg-green-500/10 hover:text-green-500">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[80%] max-w-[300px] p-0 bg-black border-green-500/30">
                                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                <AdminSidebarContent className="p-4" onLinkClick={() => setOpen(false)} />
                            </SheetContent>
                        </Sheet>
                        <div className="font-bold text-lg font-mono text-green-500">ADMIN PANEL</div>
                    </div>

                    {/* Content Area - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
