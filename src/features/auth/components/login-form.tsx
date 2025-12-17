'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Provider } from '@supabase/supabase-js';

interface LoginFormProps {
    onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const supabase = createClient();

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const result = isSignUp
                ? await supabase.auth.signUp({ email, password })
                : await supabase.auth.signInWithPassword({ email, password });

            if (result.error) {
                setError(result.error.message);
            } else {
                onSuccess?.();
            }
        } catch {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleOAuthLogin = async (provider: Provider) => {
        const currentOrigin = typeof window !== 'undefined'
            ? window.location.origin
            : process.env.NEXT_PUBLIC_SITE_URL || 'https://krackeddevs.com';

        const redirectTo = `${currentOrigin.replace(/\/$/, '')}/auth/callback`;

        await supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo },
        });
    };

    return (
        <div className="space-y-4">
            {/* OAuth Buttons */}
            <button
                onClick={() => handleOAuthLogin('github')}
                className="bg-white text-black border border-black flex items-center justify-center gap-3 w-full px-4 py-4 font-bold uppercase tracking-wider text-sm hover:shadow-[0_0_30px_rgba(21,128,61,0.6)] transition-all"
            >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Login with Github
            </button>

            <div className="flex items-center justify-center">
                <span className="text-muted-foreground">or</span>
            </div>

            <button
                onClick={() => handleOAuthLogin('google')}
                className="bg-white text-black border border-black flex items-center justify-center gap-3 w-full px-4 py-4 font-bold uppercase tracking-wider text-sm hover:shadow-[0_0_30px_rgba(21,128,61,0.6)] transition-all"
            >
                <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Login with Google
            </button>

            <div className="flex items-center justify-center py-2">
                <span className="text-muted-foreground">or</span>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-3">
                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                        {error}
                    </div>
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-background border border-neon-primary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-primary"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 bg-background border border-neon-primary/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-primary"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-neon-primary text-black font-bold uppercase tracking-wider text-sm hover:bg-neon-primary/90 transition-all disabled:opacity-50"
                >
                    <Mail className="w-4 h-4" />
                    {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
                </button>
                <button
                    type="button"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                </button>
            </form>
        </div>
    );
}
