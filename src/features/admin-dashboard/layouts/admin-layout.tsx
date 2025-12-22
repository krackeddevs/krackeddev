"use client";

import { ReactNode, useState } from 'react';
import { AdminSidebar, AdminSidebarContent } from '../components/admin-sidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
    children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex flex-col h-[calc(100vh-theme(spacing.16)-theme(spacing.8))] w-full bg-background text-foreground relative">
            {/* Background grid pattern */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none" />

            <div className="flex flex-1 min-h-0 relative z-10">
                {/* Desktop Sidebar */}
                <AdminSidebar />

                <main className="flex-1 flex flex-col min-h-0">
                    {/* Mobile Header (Sidebar Toggle only) */}
                    <div className="md:hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 flex items-center shrink-0">
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="mr-2">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[80%] max-w-[300px] p-0">
                                <AdminSidebarContent className="p-4" onLinkClick={() => setOpen(false)} />
                            </SheetContent>
                        </Sheet>
                        <div className="font-bold text-lg">Admin Panel</div>
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
