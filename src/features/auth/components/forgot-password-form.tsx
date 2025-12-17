'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Mail, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function ForgotPasswordForm() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const supabase = createClient();

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/update-password`,
        });

        setLoading(false);

        if (error) {
            setError(error.message);
            return;
        }

        setSuccess(true);
    };

    if (success) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-card border border-neon-primary/30 p-8 shadow-[0_0_30px_rgba(21,128,61,0.2)]">
                        <div className="text-center space-y-4">
                            <CheckCircle className="w-16 h-16 text-neon-primary mx-auto" />
                            <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
                            <p className="text-muted-foreground">
                                We've sent a password reset link to <strong>{email}</strong>
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Didn't receive the email? Check your spam folder or try again.
                            </p>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-neon-primary hover:underline"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to home
                            </Link>
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
                        <Mail className="w-12 h-12 text-neon-primary mx-auto" />
                        <h1 className="text-2xl font-bold text-foreground">Forgot Password?</h1>
                        <p className="text-muted-foreground">
                            Enter your email and we'll send you a reset link.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
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
                            disabled={loading || !email}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-neon-primary text-black font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neon-primary/90 transition-colors"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
