"use client";

import Link from 'next/link';
import { useSupabase } from '@/context/SupabaseContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { LogOut, User, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AdminSidebarContent } from './admin-sidebar';
import { useState } from 'react';

export function AdminHeader() {
    const { isAuthenticated, signOut, openLoginModal } = useSupabase();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Trigger */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden mr-2">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[80%] max-w-[300px] p-0">
                        <AdminSidebarContent className="p-4" onLinkClick={() => setMobileMenuOpen(false)} />
                    </SheetContent>
                </Sheet>

                <h2 className="font-bold text-lg md:hidden">Admin Panel</h2>
            </div>

            <div className="flex items-center gap-2 ml-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full border border-border"
                        >
                            <User className="h-4 w-4" />
                            <span className="sr-only">User menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href="/profile/view" className="cursor-pointer">
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {isAuthenticated ? (
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => signOut()}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem onClick={() => openLoginModal()}>
                                <User className="mr-2 h-4 w-4" />
                                Login
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
