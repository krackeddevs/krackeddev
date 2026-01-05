import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Terminal, Calendar, DollarSign, Building2, User } from "lucide-react";
import { BountyInquiry } from "@/types/database";

interface BountyInquiriesListProps {
    type: 'individual' | 'company';
    limit?: number;
}

export async function BountyInquiriesList({ type, limit }: BountyInquiriesListProps) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Fetch inquiries filtered by user and type
    let query = supabase
        .from("bounty_inquiries")
        .select("*")
        .eq("user_id", user.id)
        .eq("submitter_type", type)
        .order("created_at", { ascending: false });

    if (limit) {
        query = query.limit(limit);
    }

    const { data, error } = await query;
    const inquiries = (data as BountyInquiry[] | null) || [];

    // Handle errors gracefully - often RLS or connection issues
    if (error) {
        console.error("Error fetching inquiries:", error);
        // Don't crash the whole page, show an empty state with error hint
        return (
            <Card className="bg-destructive/10 border-destructive/30 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-8 text-center text-destructive">
                    <p className="font-bold">Unable to load inquiries</p>
                    <p className="text-xs opacity-70">Please check your connection or permissions.</p>
                </CardContent>
            </Card>
        );
    }

    if (!inquiries || inquiries.length === 0) {
        return (
            <Card className="bg-card/50 border-dashed border-border/50">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                    <Terminal className="w-12 h-12 mb-4 opacity-30" />
                    <p className="text-lg font-medium mb-1 font-mono">No Inquiries Found</p>
                    <p className="text-sm opacity-70 mb-6">Initiate a new bounty protocol to see it tracked here.</p>
                    <Button variant="outline" className="border-neon-primary/50 text-neon-primary hover:bg-neon-primary/10" asChild>
                        <Link href="/post-bounty">
                            Initialize Bounty Protocol
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-4">
            {inquiries.map((inquiry) => (
                <Card key={inquiry.id} className="overflow-hidden border border-border/50 bg-card/40 backdrop-blur hover:border-neon-primary/30 transition-colors group">
                    <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <CardTitle className="text-lg font-mono text-foreground mb-1">
                                    <Link href={`/dashboard/${type === 'company' ? 'company' : 'personal'}/inquiries/${inquiry.id}`} className="hover:underline flex items-center gap-2 group-hover:text-neon-primary transition-colors">
                                        {/* Prefer Title if available, fallback to legacy display */}
                                        {inquiry.title ? (
                                            <span>{inquiry.title}</span>
                                        ) : (
                                            <>
                                                {type === 'company' ? (
                                                    <>
                                                        <Building2 className="w-4 h-4" />
                                                        {inquiry.company_name}
                                                    </>
                                                ) : (
                                                    <>
                                                        <User className="w-4 h-4" />
                                                        Individual Bounty
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </Link>
                                </CardTitle>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: true })}
                                    </div>
                                </div>
                                <Badge variant="outline" className={`
                                    capitalize border-opacity-50
                                    ${inquiry.status === 'new' ? 'text-blue-400 border-blue-400 bg-blue-400/10' : ''}
                                    ${inquiry.status === 'contacted' ? 'text-yellow-400 border-yellow-400 bg-yellow-400/10' : ''}
                                    ${inquiry.status === 'closed' ? 'text-gray-400 border-gray-400 bg-gray-400/10' : ''}
                                `}>
                                    {inquiry.status}
                                </Badge>
                                <div className="flex items-center gap-1 text-xs font-mono text-neon-cyan bg-neon-cyan/5 px-2 py-1 rounded border border-neon-cyan/20 font-bold">
                                    {inquiry.estimated_budget ? (
                                        <span>RM {Number(inquiry.estimated_budget).toLocaleString()}</span>
                                    ) : (
                                        <>
                                            <DollarSign className="w-3 h-3" />
                                            {inquiry.budget_range}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-3">
                                <div className="space-y-1">
                                    <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold opacity-70">Mission Brief</h4>
                                    <p className="text-sm text-foreground/90 whitespace-pre-wrap line-clamp-3 font-mono leading-relaxed">
                                        {inquiry.description}
                                    </p>
                                </div>
                                {inquiry.skills && inquiry.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {inquiry.skills.map((skill: string) => (
                                            <span key={skill} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/50 font-mono">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-3 border-l border-border/30 pl-6 border-dashed">
                                <div className="space-y-1">
                                    <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold opacity-70">Contact</h4>
                                    <p className="text-xs font-mono text-foreground/80 break-all bg-background/50 p-1 rounded">
                                        {inquiry.email}
                                    </p>
                                </div>
                                {inquiry.difficulty && (
                                    <div className="space-y-1">
                                        <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold opacity-70">Difficulty</h4>
                                        <div className="text-xs capitalize flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full 
                                                ${inquiry.difficulty === 'beginner' ? 'bg-green-500' : ''}
                                                ${inquiry.difficulty === 'intermediate' ? 'bg-yellow-500' : ''}
                                                ${inquiry.difficulty === 'advanced' ? 'bg-orange-500' : ''}
                                                ${inquiry.difficulty === 'expert' ? 'bg-red-500' : ''}
                                            `}></span>
                                            {inquiry.difficulty}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))
            }
        </div >
    );
}
