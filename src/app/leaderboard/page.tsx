import { fetchTopHunters } from "@/features/profiles/actions";
import { TopHuntersList } from "@/features/profiles/components/top-hunters-list";
import { Trophy, ArrowLeft, Users } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Leaderboard | Kracked Devs",
    description: "See the top bounty hunters in the Kracked Devs community ranked by wins and earnings.",
};

export default async function LeaderboardPage() {
    const { data: hunters, error } = await fetchTopHunters(50);

    return (
        <main className="min-h-screen">
            <div className="scanlines fixed inset-0 pointer-events-none z-50"></div>
            <div className="relative z-10">
                {/* Header */}
                <div className="bg-card/50 border-b border-border">
                    <div className="container mx-auto px-4 py-6 max-w-5xl">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-mono text-sm mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>

                        {/* Tab Navigation */}
                        <div className="flex items-center gap-4 mb-4">
                            <Link
                                href="/members"
                                className="flex items-center gap-2 px-4 py-2 border-2 border-muted-foreground/30 hover:border-neon-primary text-muted-foreground hover:text-neon-primary transition-colors rounded-lg"
                            >
                                <Users className="w-4 h-4" />
                                <span className="font-mono text-sm">Members</span>
                            </Link>
                            <div
                                className="flex items-center gap-2 px-4 py-2 border-2 rounded-lg"
                                style={{
                                    borderColor: 'var(--rank-gold)',
                                    backgroundColor: 'var(--rank-gold-bg)',
                                    color: 'var(--rank-gold)'
                                }}
                            >
                                <Trophy className="w-4 h-4" />
                                <span className="font-mono text-sm">Leaderboard</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div
                                className="w-12 h-12 border-2 flex items-center justify-center rounded-xl"
                                style={{
                                    borderColor: 'var(--rank-gold)',
                                    backgroundColor: 'var(--rank-gold-bg)',
                                    color: 'var(--rank-gold)'
                                }}
                            >
                                <Trophy className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold font-mono text-foreground">
                                    LEADERBOARD
                                </h1>
                                <p className="text-muted-foreground font-mono text-sm">
                                    Top developers ranked by bounty wins
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="container mx-auto px-4 py-8 max-w-5xl">
                    {error ? (
                        <div className="text-center py-12 text-red-400 font-mono">
                            {error}
                        </div>
                    ) : (
                        <TopHuntersList hunters={hunters} />
                    )}
                </div>
            </div>
        </main>
    );
}
