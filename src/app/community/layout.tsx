import { CommunitySubNav } from "@/features/community/components/shared/community-sub-nav";


export default function CommunityLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <CommunitySubNav />
            {/* Container wrapper for community content */}
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
