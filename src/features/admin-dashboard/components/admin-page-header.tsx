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
                <nav className="flex items-center gap-2 text-[10px] text-[var(--neon-primary)]/70 mb-4 overflow-x-auto font-mono tracking-widest uppercase">
                    <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-1 hover:text-[var(--neon-primary)] transition-colors"
                    >
                        <Home className="w-3 h-3" />
                        <span className="hidden sm:inline">TERMINAL</span>
                    </Link>
                    {breadcrumbs.map((crumb, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <ChevronRight className="w-3 h-3 flex-shrink-0 text-[var(--neon-primary)]/30" />
                            {crumb.href ? (
                                <Link
                                    href={crumb.href}
                                    className="hover:text-[var(--neon-primary)] transition-colors whitespace-nowrap"
                                >
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className="text-[var(--neon-primary)] font-bold whitespace-nowrap">
                                    {crumb.label}
                                </span>
                            )}
                        </div>
                    ))}
                </nav>
            )}

            {/* Header with neon accent line */}
            <div className="border-l-4 border-[var(--neon-primary)] pl-6 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter font-mono text-foreground uppercase">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-foreground/40 mt-1 font-mono text-[10px] uppercase tracking-wider">{description}</p>
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
            <div className="h-px bg-gradient-to-r from-[var(--neon-primary)]/40 via-[var(--neon-primary)]/10 to-transparent" />
        </div>
    );
}
