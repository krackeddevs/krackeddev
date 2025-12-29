import { ReactNode } from "react";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Breadcrumb {
    label: string;
    href?: string;
}

interface AdminPageHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: Breadcrumb[];
    actions?: ReactNode;
}

export function AdminPageHeader({
    title,
    description,
    breadcrumbs = [],
    actions,
}: AdminPageHeaderProps) {
    return (
        <div className="mb-8">
            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4 overflow-x-auto">
                    <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        <span className="hidden sm:inline">Dashboard</span>
                    </Link>
                    {breadcrumbs.map((crumb, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <ChevronRight className="w-4 h-4 flex-shrink-0" />
                            {crumb.href ? (
                                <Link
                                    href={crumb.href}
                                    className="hover:text-foreground transition-colors whitespace-nowrap"
                                >
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className="text-foreground font-medium whitespace-nowrap">
                                    {crumb.label}
                                </span>
                            )}
                        </div>
                    ))}
                </nav>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    {description && (
                        <p className="text-muted-foreground mt-2">{description}</p>
                    )}
                </div>
                {actions && (
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}
