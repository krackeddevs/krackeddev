import { BountyInquiriesList } from "@/features/dashboard/components/bounty-inquiries-list";
import { Building2 } from "lucide-react";

export default function CompanyInquiriesPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-neon-secondary" />
                    Company Bounty Inquiries
                </h1>
                <p className="text-muted-foreground">
                    Track requests submitted on behalf of your organization.
                </p>
            </div>

            <BountyInquiriesList type="company" />
        </div>
    );
}
