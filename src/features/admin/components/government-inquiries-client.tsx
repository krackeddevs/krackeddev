"use client";

import { useEffect, useState } from "react";
import { AdminDataTable, Column } from "@/features/admin-dashboard/components/admin-data-table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Building2, Mail, Phone, User } from "lucide-react";
import { GovernmentInquiryActions } from "@/features/admin/components/government-inquiry-actions";
import { useRouter } from "next/navigation";

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

const inquiryTypeLabels = {
    policy_maker: 'Policy Maker',
    mdec_ministry: 'MDEC / Ministry',
    glc_company: 'GLC / Company'
};

const statusColors = {
    new: 'text-blue-400 border-blue-400 bg-blue-400/10',
    reviewing: 'text-yellow-400 border-yellow-400 bg-yellow-400/10',
    contacted: 'text-purple-400 border-purple-400 bg-purple-400/10',
    scheduled: 'text-neon-cyan border-neon-cyan bg-neon-cyan/10',
    completed: 'text-neon-primary border-neon-primary bg-neon-primary/10',
    archived: 'text-muted-foreground border-muted-foreground bg-muted/10'
};

const priorityColors = {
    low: 'text-gray-400 border-gray-400 bg-gray-400/10',
    medium: 'text-blue-400 border-blue-400 bg-blue-400/10',
    high: 'text-orange-400 border-orange-400 bg-orange-400/10',
    urgent: 'text-red-400 border-red-400 bg-red-400/10'
};

interface GovernmentInquiriesClientProps {
    initialInquiries: GovernmentInquiry[];
}

export function GovernmentInquiriesClient({ initialInquiries }: GovernmentInquiriesClientProps) {
    const router = useRouter();
    const [inquiries] = useState<GovernmentInquiry[]>(initialInquiries);

    const columns: Column<GovernmentInquiry>[] = [
        {
            key: "created_at",
            label: "Created",
            sortable: true,
            render: (inquiry) => (
                <span className="font-mono text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: true })}
                </span>
            ),
        },
        {
            key: "inquiry_type",
            label: "Type",
            sortable: true,
            render: (inquiry) => (
                <Badge variant="outline" className="text-neon-cyan border-neon-cyan/50 bg-neon-cyan/10 text-[10px] uppercase tracking-wider">
                    {inquiryTypeLabels[inquiry.inquiry_type]}
                </Badge>
            ),
        },
        {
            key: "organization_name",
            label: "Organization",
            sortable: true,
            render: (inquiry) => (
                <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-neon-secondary mt-0.5 flex-shrink-0" />
                    <div className="flex flex-col gap-1">
                        <span className="font-medium text-foreground">
                            {inquiry.organization_name}
                        </span>
                        {inquiry.position_title && (
                            <span className="text-xs text-muted-foreground">
                                {inquiry.position_title}
                            </span>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: "contact_name",
            label: "Contact",
            render: (inquiry) => (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm font-medium">{inquiry.contact_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        <a href={`mailto:${inquiry.contact_email}`} className="text-xs text-neon-cyan hover:underline font-mono">
                            {inquiry.contact_email}
                        </a>
                    </div>
                    {inquiry.contact_phone && (
                        <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            <a href={`tel:${inquiry.contact_phone}`} className="text-xs text-muted-foreground hover:text-foreground font-mono">
                                {inquiry.contact_phone}
                            </a>
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: "message",
            label: "Message",
            render: (inquiry) => (
                <div className="text-xs text-muted-foreground font-mono whitespace-pre-wrap line-clamp-2 bg-muted/20 p-2 rounded border border-border/50 max-w-md">
                    {inquiry.message}
                </div>
            ),
        },
        {
            key: "priority",
            label: "Priority",
            sortable: true,
            render: (inquiry) => (
                <Badge variant="outline" className={`uppercase text-[10px] tracking-wider font-bold ${priorityColors[inquiry.priority]}`}>
                    {inquiry.priority}
                </Badge>
            ),
        },
        {
            key: "status",
            label: "Status",
            sortable: true,
            render: (inquiry) => (
                <Badge variant="outline" className={`uppercase text-[10px] tracking-wider font-bold ${statusColors[inquiry.status]}`}>
                    {inquiry.status}
                </Badge>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (inquiry) => (
                <GovernmentInquiryActions
                    inquiryId={inquiry.id}
                    currentStatus={inquiry.status}
                    currentPriority={inquiry.priority}
                />
            ),
            mobileRender: (inquiry) => (
                <div className="space-y-3 pt-3 border-t">
                    {/* Mobile Header */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-neon-secondary" />
                            <span className="font-bold text-foreground">{inquiry.organization_name}</span>
                        </div>
                        <Badge variant="outline" className="text-neon-cyan border-neon-cyan/50 bg-neon-cyan/10 text-[10px] uppercase tracking-wider">
                            {inquiryTypeLabels[inquiry.inquiry_type]}
                        </Badge>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-1.5 text-sm">
                        <div className="flex items-center gap-2">
                            <User className="w-3 h-3 text-muted-foreground" />
                            <span>{inquiry.contact_name}</span>
                            {inquiry.position_title && (
                                <span className="text-xs text-muted-foreground">({inquiry.position_title})</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            <a href={`mailto:${inquiry.contact_email}`} className="text-xs text-neon-cyan hover:underline font-mono">
                                {inquiry.contact_email}
                            </a>
                        </div>
                        {inquiry.contact_phone && (
                            <div className="flex items-center gap-2">
                                <Phone className="w-3 h-3 text-muted-foreground" />
                                <a href={`tel:${inquiry.contact_phone}`} className="text-xs text-muted-foreground hover:text-foreground font-mono">
                                    {inquiry.contact_phone}
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Message */}
                    <div className="text-xs text-muted-foreground font-mono whitespace-pre-wrap line-clamp-3 bg-muted/20 p-2 rounded border border-border/50">
                        {inquiry.message}
                    </div>

                    {/* Status & Priority */}
                    <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline" className={`uppercase text-[10px] tracking-wider font-bold ${statusColors[inquiry.status]}`}>
                            {inquiry.status}
                        </Badge>
                        <Badge variant="outline" className={`uppercase text-[10px] tracking-wider font-bold ${priorityColors[inquiry.priority]}`}>
                            {inquiry.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-mono ml-auto">
                            {formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: true })}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end">
                        <GovernmentInquiryActions
                            inquiryId={inquiry.id}
                            currentStatus={inquiry.status}
                            currentPriority={inquiry.priority}
                        />
                    </div>
                </div>
            ),
        },
    ];

    return (
        <AdminDataTable
            data={inquiries}
            columns={columns}
            searchPlaceholder="Search by organization, contact, or message..."
            emptyMessage="No government inquiries found"
            pageSize={20}
        />
    );
}
