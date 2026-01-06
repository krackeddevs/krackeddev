"use client";

import { AdminDataTable, Column } from "@/features/admin-dashboard/components/admin-data-table";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { BountyRowActions } from "./bounty-row-actions";

type Bounty = {
    id: string;
    title: string;
    status: string;
    reward_amount: number;
    type: string;
    created_at: string;
};

interface BountiesTableClientProps {
    bounties: Bounty[];
}

export function BountiesTableClient({ bounties }: BountiesTableClientProps) {
    const getStatusBadge = (status: string) => {
        let style = {};
        switch (status) {
            case "open":
                style = { backgroundColor: 'var(--status-success)', color: 'var(--background)', borderColor: 'var(--status-success)' };
                break;
            case "in_progress":
                style = { backgroundColor: 'var(--status-warning)', color: 'var(--background)', borderColor: 'var(--status-warning)' };
                break;
            case "completed":
                style = { backgroundColor: 'var(--status-info)', color: 'var(--background)', borderColor: 'var(--status-info)' };
                break;
            case "closed":
                style = { backgroundColor: 'var(--status-error)', color: 'var(--background)', borderColor: 'var(--status-error)' };
                break;
            default:
                style = { backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' };
        }

        return (
            <Badge variant="outline" className="border" style={style}>
                {status.replace('_', ' ').toUpperCase()}
            </Badge>
        );
    };

    const columns: Column<Bounty>[] = [
        {
            key: "title",
            label: "Title",
            sortable: true,
            render: (bounty) => (
                <div>
                    <div className="font-medium">{bounty.title}</div>
                    <div className="text-sm text-muted-foreground">{bounty.type}</div>
                </div>
            ),
            mobileRender: (bounty) => (
                <div className="space-y-2">
                    <div className="font-bold">{bounty.title}</div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{bounty.type}</span>
                        {getStatusBadge(bounty.status)}
                    </div>
                </div>
            ),
        },
        {
            key: "reward_amount",
            label: "Reward",
            sortable: true,
            render: (bounty) => (
                <div className="flex items-center gap-1 font-semibold text-neon-primary">
                    <DollarSign className="h-4 w-4" />
                    RM {bounty.reward_amount.toLocaleString()}
                </div>
            ),
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            render: (bounty) => getStatusBadge(bounty.status),
        },
        {
            key: "created_at",
            label: "Created",
            sortable: true,
            render: (bounty) =>
                formatDistanceToNow(new Date(bounty.created_at), { addSuffix: true }),
        },
        {
            key: "actions",
            label: "Actions",
            sortable: false,
            render: (bounty) => <BountyRowActions bountyId={bounty.id} />,
        },
    ];

    return (
        <AdminDataTable
            data={bounties}
            columns={columns}
            searchPlaceholder="Search bounties by title or type..."
            emptyMessage="No bounties found"
        />
    );
}
