import { BountyInquiriesList } from "@/features/dashboard/components/bounty-inquiries-list";
import { Terminal } from "lucide-react";

export default function PersonalInquiriesPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <Terminal className="w-6 h-6 text-neon-primary" />
                    Personal Bounty Inquiries
                </h1>
                <p className="text-muted-foreground">
                    Track the status of your individual project submissions.
                </p>
            </div>

            <BountyInquiriesList type="individual" />
        </div>
    );
}
