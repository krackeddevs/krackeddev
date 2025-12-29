export const runtime = 'edge';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/types/database';

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // Handle OAuth errors
    if (error) {
        console.error('OAuth error:', error, errorDescription);
        return NextResponse.redirect(
            `${origin}/auth/auth-code-error?error=${encodeURIComponent(errorDescription || error)}`
        );
    }

    if (code) {
        const cookieStore = await cookies();

        const supabase = createServerClient<Database>(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch (error) {
                            console.error('Error setting cookies:', error);
                        }
                    },
                },
            }
        );

        const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
            console.error('Code exchange error:', exchangeError.message);
            return NextResponse.redirect(
                `${origin}/auth/auth-code-error?error=${encodeURIComponent(exchangeError.message)}`
            );
        }

        // Store GitHub access token in profile if available
        // CRITICAL: Only update if the provider is actually GitHub. 
        // Otherwise, logging in with Google will overwrite the GitHub token with a Google token, breaking the sync.
        const isGithubProvider = sessionData?.session?.user?.app_metadata?.provider === 'github' ||
            (sessionData?.session?.user?.identities || []).some((id: any) => id.provider === 'github' && id.last_sign_in_at === sessionData?.session?.user?.last_sign_in_at);

        if (isGithubProvider && sessionData?.session?.provider_token && sessionData?.session?.user?.id) {
            const userId = sessionData.session.user.id;
            const providerToken = sessionData.session.provider_token;

            // Update the profile with the GitHub token
            await (supabase.from('profiles') as any)
                .update({
                    github_access_token: providerToken,
                    portfolio_synced_at: null // Clear cache to force refresh
                })
                .eq('id', userId);
        }

        // Successful - redirect to home
        return NextResponse.redirect(`${origin}${next}`);
    }

    // No code provided
    return NextResponse.redirect(
        `${origin}/auth/auth-code-error?error=${encodeURIComponent('No authorization code provided')}`
    );
}
