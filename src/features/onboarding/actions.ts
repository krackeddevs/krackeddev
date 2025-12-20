'use server';

import { createClient } from '@/lib/supabase/server';
import { onboardingSchema, type OnboardingFormData } from './schema';
import { revalidatePath } from 'next/cache';

export async function saveOnboardingDetails(data: OnboardingFormData) {
    const supabase = await createClient();

    // Validate the data
    const validationResult = onboardingSchema.safeParse(data);
    if (!validationResult.success) {
        return { error: validationResult.error.issues[0].message };
    }

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        return { error: 'Not authenticated' };
    }

    // Update profile with onboarding data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
        .from('profiles')
        .update({
            full_name: validationResult.data.fullName || null,
            username: validationResult.data.username || null,
            developer_role: validationResult.data.developerRole,
            stack: validationResult.data.stack,
            location: validationResult.data.location,
            x_url: validationResult.data.xUrl || null,
            linkedin_url: validationResult.data.linkedinUrl || null,
            website_url: validationResult.data.websiteUrl || null,
            onboarding_completed: true,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

    if (updateError) {
        console.error('Error updating profile:', updateError);
        return { error: 'Failed to save profile' };
    }

    revalidatePath('/');
    return { success: true };
}

export async function getOnboardingStatus() {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        return { completed: false, authenticated: false };
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single();

    return {
        completed: (profile as any)?.onboarding_completed ?? false,
        authenticated: true
    };
}
