import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
    heading: string;
    text?: string;
    children?: React.ReactNode;
    className?: string;
}

export function DashboardHeader({
    heading,
    text,
    children,
    className,
}: DashboardHeaderProps) {
    return (
        <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8", className)}>
            <div className="grid gap-1">
                <h1 className="font-bold text-3xl md:text-4xl tracking-tight text-foreground">
                    {heading}
                </h1>
                {text && (
                    <p className="text-lg text-muted-foreground">
                        {text}
                    </p>
                )}
            </div>
            {children && (
                <div className="flex items-center gap-2">
                    {children}
                </div>
            )}
        </div>
    );
}
