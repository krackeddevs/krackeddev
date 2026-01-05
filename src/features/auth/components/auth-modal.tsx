'use client';

import { useEffect, useCallback } from 'react';
import { X, ExternalLink, LogOut } from 'lucide-react';
import { LoginForm } from './login-form';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    isAuthenticated: boolean;
}

export function AuthModal({ isOpen, onClose, user, isAuthenticated }: AuthModalProps) {
    const supabase = createClient();

    // Handle escape key to close modal
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        },
        [onClose]
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    const displayName =
        user?.user_metadata?.user_name ||
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email?.split('@')[0] ||
        'User';

    const avatarUrl =
        user?.user_metadata?.avatar_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;

    const providerType = user?.app_metadata?.provider || 'email';

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Content */}
            <div className="relative z-10 w-full max-w-md mx-4 animate-in fade-in-0 zoom-in-95 duration-200">
                <div className="bg-popover border border-neon-primary shadow-[0_0_30px_rgba(21,128,61,0.3)]">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-neon-primary/30">
                        <h2
                            id="auth-modal-title"
                            className="text-lg font-bold text-neon-primary uppercase tracking-wider"
                        >
                            {isAuthenticated ? 'Your Profile' : 'Connect Account'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Close modal"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        {isAuthenticated && user ? (
                            // Logged in state
                            <div className="space-y-6">
                                {/* User Card */}
                                <div className="flex items-center gap-4 p-4 bg-background border border-neon-primary/20">
                                    <img
                                        src={avatarUrl}
                                        alt={`${displayName}'s avatar`}
                                        className="w-16 h-16 border-2 border-neon-primary rounded-full"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-lg font-bold text-foreground truncate">
                                            {displayName}
                                        </p>
                                        <p className="text-sm text-muted-foreground capitalize">
                                            Connected via {providerType}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="space-y-3">
                                    {user?.user_metadata?.user_name && (
                                        <a
                                            href={`https://github.com/${user.user_metadata.user_name}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-neon-primary/50 text-neon-primary font-semibold uppercase tracking-wider text-sm hover:bg-neon-primary/10 transition-all"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            View GitHub Profile
                                        </a>
                                    )}
                                    <button
                                        onClick={handleSignOut}
                                        className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-red-500/50 text-red-500 font-semibold uppercase tracking-wider text-sm hover:bg-red-500/10 transition-all"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Disconnect Account
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Logged out state
                            <div className="space-y-6">
                                {/* Description */}
                                <div className="text-center space-y-2">
                                    <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                                        <img
                                            src="/logo/logo-old.png"
                                            alt="Kracked Devs Logo"
                                            className="w-24 h-24 object-cover p-0.5 bg-green-400"
                                        />
                                    </div>
                                    <p className="text-sm text-foreground">Welcome to Kracked Devs!</p>
                                    <p className="text-muted-foreground">
                                        A community of cracked developers who want to level up together.
                                    </p>
                                </div>

                                <LoginForm onSuccess={onClose} />

                                {/* Info text */}
                                <p className="text-xs text-center text-muted-foreground">
                                    By connecting, you agree to our{' '}
                                    <a href="/terms" className="text-neon-primary hover:underline">
                                        Terms of Service
                                    </a>{' '}
                                    and{' '}
                                    <a href="/privacy" className="text-neon-primary hover:underline">
                                        Privacy Policy
                                    </a>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
