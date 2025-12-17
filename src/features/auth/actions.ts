'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function signInWithEmail(email: string, password: string) {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    return { error: null };
}

export async function signUpWithEmail(email: string, password: string) {
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    return { error: null };
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/');
}

export async function getUser() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export async function getUserProfile() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    return profile;
}
