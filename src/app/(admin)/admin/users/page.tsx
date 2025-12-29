export const runtime = 'edge';

import { fetchUsers } from '@/features/admin-dashboard/actions';
import { AdminPageHeader } from '@/features/admin-dashboard/components/admin-page-header';
import { UsersTableClient } from '@/features/admin-dashboard/components/users-table-client';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const metadata = {
    title: 'User Management | Admin | KrackedDevs',
};

export default async function UsersPage() {
    const { data: users, error } = await fetchUsers();

    if (error) {
        return (
            <div className="p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {error || 'Failed to load users. Please check your connection and try again.'}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="User Management"
                description="View and manage user accounts. Banning a user will revoke their access immediately."
                breadcrumbs={[{ label: "Users" }]}
            />
            <UsersTableClient users={users || []} />
        </div>
    );
}
