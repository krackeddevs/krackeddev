export const runtime = 'edge';

import { createClient } from '@/lib/supabase/server';
import { AdminPageHeader } from '@/features/admin-dashboard/components/admin-page-header';
import { BountiesTableClient } from '@/features/admin-dashboard/components/bounties-table-client';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function AdminBountiesPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/login');
    }

    const { data: bounties, error } = await supabase
        .from('bounties')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching bounties:', error);
        return <div>Error loading bounties</div>;
    }

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Bounties"
                description="Manage bounty listings and rewards"
                breadcrumbs={[{ label: "Bounties" }]}
                actions={
                    <Button asChild>
                        <Link href="/admin/bounties/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Bounty
                        </Link>
                    </Button>
                }
            />
            <BountiesTableClient bounties={bounties || []} />
        </div>
    );
}
