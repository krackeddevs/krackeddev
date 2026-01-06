"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Code2, Users, Zap } from "lucide-react";
import { useSupabase } from "@/context/SupabaseContext";
import { useRouter } from "next/navigation";

export function DevelopersHero() {
    const { isAuthenticated, openLoginModal, profile } = useSupabase();
    const router = useRouter();
    const [userCount, setUserCount] = useState<number | null>(null);

    useEffect(() => {
        fetch('/api/stats/user-count')
            .then(res => res.json())
            .then(data => setUserCount(data.count))
            .catch(err => console.error('Error fetching user count:', err));
    }, []);

    const displayCount = userCount ? `${userCount}+` : '400+';

    const handleJoinClick = () => {
        if (isAuthenticated) {
            if (profile?.onboarding_completed) {
                router.push("/dashboard");
            } else {
                router.push("/onboarding/form");
            }
        } else {
            openLoginModal(true);
        }
    };

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
            {/* Background Effects */}
            <div className="absolute inset-0 grid-background opacity-[0.05]" />

            {/* Spotlight Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--neon-primary)] opacity-[0.03] dark:opacity-[0.1] rounded-full blur-[100px]" />

            <div className="container relative z-10 px-4 mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-none border border-[var(--neon-primary)]/30 bg-[var(--neon-primary)]/5 text-[var(--neon-primary)] text-[10px] font-mono uppercase tracking-wider">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--neon-primary)] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--neon-primary)]"></span>
                        </span>
                        For Developers
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-mono tracking-tight mb-6 uppercase text-foreground">
                        <span className="text-[var(--neon-primary)] text-glow">Build. Learn. Earn.</span> <br />
                        Together.
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 font-mono leading-relaxed">
                        Join Malaysia's most active developer community. Learn vibe coding, win paid bounties, and build your portfolio, <span className="text-foreground font-bold">all while being part of something bigger.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                            size="lg"
                            className="bg-[var(--neon-primary)] text-background hover:bg-[var(--neon-primary)]/90 font-bold text-lg px-8 py-6 h-auto shadow-[0_0_20px_rgba(var(--neon-primary-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--neon-primary-rgb),0.5)] transition-all duration-300 group min-w-[200px] rounded-none"
                            onClick={handleJoinClick}
                        >
                            {isAuthenticated && profile?.onboarding_completed
                                ? "Go to Dashboard"
                                : "Join Beta - It's Free"}
                        </Button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto border-t border-border/50 pt-8">
                        <div className="flex flex-col items-center gap-2">
                            <Users className="w-8 h-8 text-neon-primary mb-2" />
                            <h3 className="font-bold text-foreground">{displayCount} Developers</h3>
                            <p className="text-sm text-muted-foreground">Already Waiting to Build With You</p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Zap className="w-8 h-8 text-neon-primary mb-2" />
                            <h3 className="font-bold text-foreground">RM150-3,000</h3>
                            <p className="text-sm text-muted-foreground">Per Bounty Project</p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Code2 className="w-8 h-8 text-neon-primary mb-2" />
                            <h3 className="font-bold text-foreground">AI-Assisted Coding</h3>
                            <p className="text-sm text-muted-foreground">Learn How Devs Work in 2026</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
