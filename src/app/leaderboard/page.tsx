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
        <main className="min-h-screen bg-gray-900">
            <div className="scanlines fixed inset-0 pointer-events-none z-50"></div>
            <div className="relative z-10">
                {/* Header */}
                <div className="bg-gray-800/50 border-b border-gray-700">
                    <div className="container mx-auto px-4 py-6 max-w-4xl">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-mono text-sm mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>

                        {/* Tab Navigation */}
                        <div className="flex items-center gap-4 mb-4">
                            <Link
                                href="/members"
                                className="flex items-center gap-2 px-4 py-2 border-2 border-gray-600 hover:border-neon-primary text-gray-400 hover:text-neon-primary transition-colors"
                            >
                                <Users className="w-4 h-4" />
                                <span className="font-mono text-sm">Members</span>
                            </Link>
                            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border-2 border-amber-500">
                                <Trophy className="w-4 h-4 text-amber-400" />
                                <span className="font-mono text-sm text-amber-400">Leaderboard</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center">
                                <Trophy className="w-6 h-6 text-amber-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold font-mono text-white">
                                    LEADERBOARD
                                </h1>
                                <p className="text-gray-400 font-mono text-sm">
                                    Top developers ranked by bounty wins
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="container mx-auto px-4 py-8 max-w-4xl">
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
