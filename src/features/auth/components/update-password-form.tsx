'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function UpdatePasswordForm() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

    useEffect(() => {
        // Check if user has a valid recovery session
        const checkSession = async () => {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            setIsValidSession(!!session);
        };
        checkSession();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError(null);

        const supabase = createClient();

        const { error } = await supabase.auth.updateUser({ password });

        setLoading(false);

        if (error) {
            setError(error.message);
            return;
        }

        setSuccess(true);

        // Redirect to home after success
        setTimeout(() => {
            router.push('/');
        }, 2000);
    };

    if (isValidSession === null) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-neon-primary" />
            </div>
        );
    }

    if (!isValidSession) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-card border border-red-500/30 p-8">
                        <div className="text-center space-y-4">
                            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                            <h1 className="text-2xl font-bold text-foreground">Invalid or Expired Link</h1>
                            <p className="text-muted-foreground">
                                This password reset link is invalid or has expired.
                            </p>
                            <Link
                                href="/auth/forgot-password"
                                className="inline-block px-6 py-3 bg-neon-primary text-black font-bold uppercase tracking-wider hover:bg-neon-primary/90 transition-colors"
                            >
                                Request New Link
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-card border border-neon-primary/30 p-8 shadow-[0_0_30px_rgba(21,128,61,0.2)]">
                        <div className="text-center space-y-4">
                            <CheckCircle className="w-16 h-16 text-neon-primary mx-auto" />
                            <h1 className="text-2xl font-bold text-foreground">Password Updated!</h1>
                            <p className="text-muted-foreground">
                                Your password has been successfully updated. Redirecting...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-card border border-neon-primary/30 p-8 shadow-[0_0_30px_rgba(21,128,61,0.2)]">
                    <div className="text-center space-y-2 mb-6">
                        <Lock className="w-12 h-12 text-neon-primary mx-auto" />
                        <h1 className="text-2xl font-bold text-foreground">Set New Password</h1>
                        <p className="text-muted-foreground">
                            Enter your new password below.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                                New Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-primary"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-primary"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !password || !confirmPassword}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-neon-primary text-black font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neon-primary/90 transition-colors"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Update Password'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
