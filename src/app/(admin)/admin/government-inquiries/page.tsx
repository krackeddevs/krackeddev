import { createClient } from "@/lib/supabase/server";
import { AdminPageHeader } from "@/features/admin-dashboard/components/admin-page-header";
import { GovernmentInquiriesClient } from "@/features/admin/components/government-inquiries-client";

interface GovernmentInquiry {
    id: string;
    inquiry_type: 'policy_maker' | 'mdec_ministry' | 'glc_company';
    organization_name: string;
    contact_name: string;
    contact_email: string;
    contact_phone: string | null;
    position_title: string | null;
    message: string;
    status: 'new' | 'reviewing' | 'contacted' | 'scheduled' | 'completed' | 'archived';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    created_at: string;
    updated_at: string;
}

export default async function GovernmentInquiriesPage() {
    const supabase = await createClient();

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return <div className="text-destructive p-8">Unauthorized</div>;
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single<{ role: string }>();

    if (!profile || profile.role !== 'admin') {
        return <div className="text-destructive p-8">Forbidden - Admin access required</div>;
    }

    // Fetch all government inquiries
    const { data, error } = await (supabase
        .from("government_inquiries") as any)
        .select("*")
        .order("created_at", { ascending: false });

    const inquiries = data as GovernmentInquiry[] | null;

    if (error) {
        console.error("Error fetching government inquiries:", error);
        return <div className="text-destructive p-8">Failed to load inquiries.</div>;
    }

    // Stats
    const stats = {
        total: inquiries?.length || 0,
        new: inquiries?.filter(i => i.status === 'new').length || 0,
        reviewing: inquiries?.filter(i => i.status === 'reviewing').length || 0,
        contacted: inquiries?.filter(i => i.status === 'contacted').length || 0,
        scheduled: inquiries?.filter(i => i.status === 'scheduled').length || 0,
    };

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Government Inquiries"
                description="Manage partnership requests from government entities, MDEC, ministries, and GLCs."
                breadcrumbs={[{ label: "Government Inquiries" }]}
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-card border border-border rounded-lg p-4">
                    <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Total</div>
                </div>
                <div className="bg-card border border-blue-400/30 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-400">{stats.new}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">New</div>
                </div>
                <div className="bg-card border border-yellow-400/30 rounded-lg p-4">
                    <div className="text-2xl font-bold text-yellow-400">{stats.reviewing}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Reviewing</div>
                </div>
                <div className="bg-card border border-purple-400/30 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-400">{stats.contacted}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Contacted</div>
                </div>
                <div className="bg-card border border-neon-cyan/30 rounded-lg p-4">
                    <div className="text-2xl font-bold text-neon-cyan">{stats.scheduled}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Scheduled</div>
                </div>
            </div>

            {/* Table/Cards */}
            <GovernmentInquiriesClient initialInquiries={inquiries || []} />
        </div>
    );
}
