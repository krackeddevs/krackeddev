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
                <nav className="flex items-center gap-2 text-sm text-neon-primary/70 mb-4 overflow-x-auto font-mono">
                    <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-1 hover:text-neon-primary transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        <span className="hidden sm:inline">DASHBOARD</span>
                    </Link>
                    {breadcrumbs.map((crumb, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <ChevronRight className="w-4 h-4 flex-shrink-0 text-neon-primary/50" />
                            {crumb.href ? (
                                <Link
                                    href={crumb.href}
                                    className="hover:text-neon-primary transition-colors whitespace-nowrap uppercase"
                                >
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className="text-neon-primary font-medium whitespace-nowrap uppercase">
                                    {crumb.label}
                                </span>
                            )}
                        </div>
                    ))}
                </nav>
            )}

            {/* Header with neon accent line */}
            <div className="border-l-4 border-neon-primary pl-4 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight font-mono text-neon-primary uppercase">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-muted-foreground mt-2 font-mono text-sm">{description}</p>
                        )}
                    </div>
                    {actions && (
                        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                            {actions}
                        </div>
                    )}
                </div>
            </div>

            {/* Decorative line */}
            <div className="h-px bg-gradient-to-r from-neon-primary/50 via-neon-primary/20 to-transparent" />
        </div>
    );
}
