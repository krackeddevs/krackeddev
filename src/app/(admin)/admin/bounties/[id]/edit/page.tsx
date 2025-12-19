export const runtime = 'edge';

import EditBountyClient from './EditBountyClient';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditBountyPage({ params }: PageProps) {
    const { id } = await params;
    return <EditBountyClient id={id} />;
}
