export const runtime = 'edge';

import BountyDetailClient from './BountyDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BountyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return <BountyDetailClient slug={slug} />;
}
