'use server';

import { createClient } from '@/lib/supabase/server';
import { ActionResult, AnalyticsData } from './types';
import { UserRole, Profile, Bounty } from '@/types/database';

// Helper to check admin role
async function checkAdmin(): Promise<ActionResult<boolean>> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { data: null, error: 'Not authenticated' };
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || (profile as { role: UserRole }).role !== 'admin') {
        return { data: null, error: 'Unauthorized: Admin access required' };
    }

    return { data: true, error: null };
}

import { revalidatePath } from 'next/cache';
import { BountySchema } from './schemas';
import { BountyInputData } from './types';

export async function createBounty(data: BountyInputData): Promise<ActionResult<any>> {
    const authCheck = await checkAdmin();
    if (authCheck.error) return { data: null, error: authCheck.error };

    const validation = BountySchema.safeParse(data);
    if (!validation.success) {
        return { data: null, error: validation.error.issues[0].message };
    }

    const supabase = await createClient();
    const { data: bounty, error } = await (supabase
        .from('bounties') as any)
        .insert({
            title: data.title,
            slug: data.slug,
            description: data.description,
            long_description: data.long_description,
            reward_amount: data.reward_amount,
            status: data.status,
            type: data.type,
            company_name: data.company_name,
            skills: data.skills,
            difficulty: data.difficulty,
            deadline: data.deadline || null,
            requirements: data.requirements,
            repository_url: data.repository_url,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating bounty:', error);
        return { data: null, error: 'Failed to create bounty' };
    }

    revalidatePath('/admin/bounties');
    return { data: bounty, error: null };
}

export async function updateBounty(id: string, data: BountyInputData): Promise<ActionResult<any>> {
    const authCheck = await checkAdmin();
    if (authCheck.error) return { data: null, error: authCheck.error };

    const validation = BountySchema.safeParse(data);
    if (!validation.success) {
        return { data: null, error: validation.error.issues[0].message };
    }

    const supabase = await createClient();
    const { data: bounty, error } = await (supabase
        .from('bounties') as any)
        .update({
            title: data.title,
            slug: data.slug,
            description: data.description,
            long_description: data.long_description,
            reward_amount: data.reward_amount,
            status: data.status,
            type: data.type,
            company_name: data.company_name,
            skills: data.skills,
            updated_at: new Date().toISOString(),
            difficulty: data.difficulty,
            deadline: data.deadline || null,
            requirements: data.requirements,
            repository_url: data.repository_url,
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating bounty:', error);
        return { data: null, error: 'Failed to update bounty' };
    }

    revalidatePath('/admin/bounties');
    return { data: bounty, error: null };
}

export async function deleteBounty(id: string): Promise<ActionResult<boolean>> {
    const authCheck = await checkAdmin();
    if (authCheck.error) return { data: null, error: authCheck.error };

    const supabase = await createClient();
    const { error } = await supabase
        .from('bounties')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting bounty:', error);
        return { data: null, error: 'Failed to delete bounty' };
    }

    revalidatePath('/admin/bounties');
    return { data: true, error: null };
}

export async function fetchUsers(): Promise<ActionResult<Profile[]>> {
    const authCheck = await checkAdmin();
    if (authCheck.error) return { data: null, error: authCheck.error };

    const supabase = await createClient();
    const { data: users, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });


    if (error) {
        console.error('Error fetching users:', error);
        return { data: null, error: 'Failed to fetch users' };
    }

    return { data: users as Profile[], error: null };
}

export async function toggleUserBan(userId: string, currentStatus: 'active' | 'banned'): Promise<ActionResult<boolean>> {
    const authCheck = await checkAdmin();
    if (authCheck.error) return { data: null, error: authCheck.error };

    const newStatus = currentStatus === 'active' ? 'banned' : 'active';
    const supabase = await createClient();

    const { error } = await (supabase
        .from('profiles') as any)
        .update({ status: newStatus })
        .eq('id', userId);

    if (error) {
        console.error('Error toggling ban:', error);
        return { data: null, error: `Failed to ${newStatus === 'banned' ? 'ban' : 'unban'} user` };
    }

    revalidatePath('/admin/users');
    return { data: true, error: null };
}

export async function getAnalyticsData(): Promise<ActionResult<AnalyticsData>> {
    const authCheck = await checkAdmin();
    if (authCheck.error) return { data: null, error: authCheck.error };

    const supabase = await createClient();

    // Parallel fetch for efficiency
    const [profilesRes, bountiesRes] = await Promise.all([
        supabase
            .from('profiles')
            .select('id, full_name, username, avatar_url, location, stack, developer_role, created_at')
            .order('created_at', { ascending: false }),
        supabase
            .from('bounties')
            .select('id, title, status, created_at, reward_amount')
            .order('created_at', { ascending: false })
    ]);

    if (profilesRes.error) {
        console.error('Error fetching analytics data (profiles):', profilesRes.error);
        return { data: null, error: 'Failed to fetch profiles data' };
    }
    if (bountiesRes.error) {
        console.error('Error fetching analytics data (bounties):', bountiesRes.error);
        return { data: null, error: 'Failed to fetch bounties data' };
    }

    // Cast to expected types since select partials don't perfectly match full types
    const profiles = profilesRes.data as unknown as Profile[];
    const bounties = bountiesRes.data as unknown as Bounty[];

    // --- Helper for Tech Stack Normalization ---
    const normalizeTechName = (name: string): string => {
        const lower = name.toLowerCase().trim();
        const map: Record<string, string> = {
            'react': 'React',
            'reactjs': 'React',
            'react.js': 'React',
            'next': 'Next.js',
            'nextjs': 'Next.js',
            'next.js': 'Next.js',
            'vue': 'Vue.js',
            'vuejs': 'Vue.js',
            'vue.js': 'Vue.js',
            'node': 'Node.js',
            'nodejs': 'Node.js',
            'node.js': 'Node.js',
            'ts': 'TypeScript',
            'typescript': 'TypeScript',
            'js': 'JavaScript',
            'javascript': 'JavaScript',
            'python': 'Python',
            'py': 'Python',
            'tailwind': 'Tailwind CSS',
            'tailwindcss': 'Tailwind CSS',
            'postgres': 'PostgreSQL',
            'postgresql': 'PostgreSQL',
            'supabase': 'Supabase',
            'firebase': 'Firebase',
            'aws': 'AWS',
            'docker': 'Docker',
            'go': 'Go',
            'golang': 'Go',
            'rust': 'Rust',
            'java': 'Java',
            'c#': 'C#',
            'csharp': 'C#',
            'php': 'PHP',
            'laravel': 'Laravel',
            'flutter': 'Flutter',
            'react native': 'React Native',
        };

        // Return mapped name or capitalized original
        return map[lower] || name.charAt(0).toUpperCase() + name.slice(1);
    };

    // --- Helper for Location Normalization ---
    const normalizeLocationName = (name: string): string => {
        if (!name) return 'Unknown';

        const lower = name.toLowerCase().trim();

        // Exact matches for the requested normalizations
        if (lower === 'kuala lumpur' || lower.includes('kuala lumpur')) return 'Wilayah Persekutuan Kuala Lumpur';
        if (lower === 'putrajaya' || lower.includes('putrajaya')) return 'Wilayah Persekutuan Putrajaya';
        if (lower === 'labuan' || lower.includes('labuan')) return 'Wilayah Persekutuan Labuan';
        if (lower === 'penang') return 'Pulau Pinang';

        // Standard capitalization for others if needed, or return original
        // Ideally we match standard Malaysian states if possible

        return name.trim();
    };

    // --- Helper for Monthly Growth ---
    const getGrowth = (dates: (string | null | undefined)[]) => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        let currentCount = 0;
        let prevCount = 0;

        dates.forEach(d => {
            if (!d) return;
            const date = new Date(d);
            if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) currentCount++;
            if (date.getMonth() === prevMonth && date.getFullYear() === prevMonthYear) prevCount++;
        });

        if (prevCount === 0) return currentCount > 0 ? 100 : 0;
        return Math.round(((currentCount - prevCount) / prevCount) * 100);
    };

    // --- Process Profiles ---
    const locationMap = new Map<string, number>();
    const stackMap = new Map<string, number>();
    const roleMap = new Map<string, number>();
    const growthMap = new Map<string, number>();

    profiles.forEach((profile) => {
        // Location
        if (profile.location) {
            const loc = normalizeLocationName(profile.location);
            locationMap.set(loc, (locationMap.get(loc) || 0) + 1);
        }

        // Stack
        if (profile.stack && Array.isArray(profile.stack)) {
            profile.stack.forEach((tech: string) => {
                if (!tech) return;
                const normalized = normalizeTechName(tech);
                stackMap.set(normalized, (stackMap.get(normalized) || 0) + 1);
            });
        }

        // Role
        if (profile.developer_role) {
            roleMap.set(profile.developer_role, (roleMap.get(profile.developer_role) || 0) + 1);
        }

        // Growth Timeline
        if (profile.created_at) {
            const date = new Date(profile.created_at);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            growthMap.set(key, (growthMap.get(key) || 0) + 1);
        }
    });

    // Format Charts
    const locationDistribution = Array.from(locationMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    const stackDistribution = Array.from(stackMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10); // Top 10

    const roleDistribution = Array.from(roleMap.entries())
        .map(([name, value]) => ({ name, value }));

    // Accumulate growth
    const sortedDates = Array.from(growthMap.keys()).sort();
    let cumulative = 0;
    const userGrowth = sortedDates.map(date => {
        cumulative += growthMap.get(date)!;
        return { date, count: cumulative };
    });

    // --- Stats Calculation ---
    // Users
    const totalUsers = profiles.length;
    const userGrowthRate = getGrowth(profiles.map((p) => p.created_at));

    // Bounties
    const totalBounties = bounties.length;
    const activeBounties = bounties.filter((b) => b.status === 'published' || b.status === 'open').length;
    const completedBounties = bounties.filter((b) => b.status === 'completed' || b.status === 'paid').length;
    const bountyGrowthRate = getGrowth(bounties.map((b) => b.created_at));
    const totalRewards = bounties.reduce((acc, b) => acc + (b.reward_amount || 0), 0);

    // --- Recent Activity ---
    const recentUsers = profiles.slice(0, 5).map((p) => ({
        id: p.id,
        name: p.full_name || p.username || 'Anonymous',
        email: 'Hidden',
        role: p.developer_role || 'Developer',
        joinedAt: p.created_at,
        avatar: p.avatar_url || undefined,
    }));

    const recentBounties = bounties.slice(0, 5).map((b) => ({
        id: b.id,
        title: b.title,
        status: b.status,
        reward: b.reward_amount,
        createdAt: b.created_at,
    }));

    return {
        data: {
            // Metrics
            totalUsers,
            userGrowthRate,
            totalBounties,
            activeBounties,
            completedBounties,
            bountyGrowthRate,
            totalRewards,

            // Charts
            locationDistribution,
            stackDistribution,
            roleDistribution,
            userGrowth,

            // Recent
            recentUsers,
            recentBounties,
        },
        error: null
    };
}

export async function getUserGrowth(period: 'daily' | 'weekly' | 'monthly'): Promise<ActionResult<{ date: string; count: number }[]>> {
    const authCheck = await checkAdmin();
    if (authCheck.error) return { data: null, error: authCheck.error };

    const supabase = await createClient();

    // Limit fetching based on period to avoid fetching everything forever
    const now = new Date();
    let startDate = new Date();

    if (period === 'daily') {
        startDate.setDate(now.getDate() - 30); // Last 30 days
    } else if (period === 'weekly') {
        startDate.setDate(now.getDate() - 90); // Last ~3 months
    } else {
        startDate.setFullYear(now.getFullYear() - 1); // Last 1 year
    }

    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching user growth:', error);
        return { data: null, error: 'Failed to fetch user growth data' };
    }

    const map = new Map<string, number>();

    (profiles as unknown as { created_at: string }[]).forEach((p) => {
        if (!p.created_at) return;
        const date = new Date(p.created_at);
        let key = '';

        if (period === 'daily') {
            key = date.toISOString().split('T')[0]; // YYYY-MM-DD
        } else if (period === 'weekly') {
            // Get start of week (Sunday)
            const day = date.getDay();
            const diff = date.getDate() - day;
            const weekStart = new Date(date);
            weekStart.setDate(diff);
            key = weekStart.toISOString().split('T')[0];
        } else {
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
        }

        map.set(key, (map.get(key) || 0) + 1);
    });

    // Cumulative calculation
    // Note: This only counts users joined within the window. 
    // To show total users over time, we need the base count before the window.
    // For simplicity in this "User Growth" chart which usually shows trend, 
    // we might just show new users per period OR cumulative. 
    // The existing chart showed cumulative. Let's try to do cumulative but we need the start count.

    // Fetch total count before start date
    const { count: startCount, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .lt('created_at', startDate.toISOString());

    if (countError) {
        console.error('Error fetching initial count:', countError);
        return { data: null, error: 'Failed to fetch initial count' };
    }

    let cumulative = startCount || 0;
    const sortedKeys = Array.from(map.keys()).sort();

    // Fill in gaps? Ideally yes, but for MVP let's just map existing data points + startCount logic.
    // Actually, for a smooth line chart, filling gaps is better.

    // Simple version first:
    const result = sortedKeys.map(date => {
        cumulative += map.get(date)!;
        return { date, count: cumulative };
    });

    return { data: result, error: null };
}

