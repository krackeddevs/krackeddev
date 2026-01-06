"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, User, Code, ArrowRight } from "lucide-react";
import { useSupabase } from "@/context/SupabaseContext";
import { useRouter } from "next/navigation";

const steps = [
    {
        icon: UserPlus,
        step: "Step 1",
        title: "Join Beta",
        description: "Sign up for free. Takes 2 minutes.",
        color: "neon-primary"
    },
    {
        icon: User,
        step: "Step 2",
        title: "Create Your Profile",
        description: "Tell us about yourself. Link your GitHub. Join our Discord.",
        color: "neon-cyan"
    },
    {
        icon: Code,
        step: "Step 3",
        title: "Start Building",
        description: "Browse bounties. Ask questions. Win projects. Build your portfolio.",
        color: "neon-secondary"
    }
];

export function DevelopersJourney() {
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
        <section className="py-24 bg-muted/10 relative overflow-hidden font-mono">
            {/* Background Pattern */}
            <div className="absolute inset-0 grid-background opacity-[0.05]" />

            <div className="container px-4 mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-sm font-mono text-[var(--neon-primary)] tracking-widest uppercase mb-4 tracking-widest">Get Started</h2>
                    <h3 className="text-3xl md:text-5xl font-bold font-mono text-foreground mb-6 uppercase tracking-tighter">
                        Your Journey Starts <br />
                        <span className="text-[var(--neon-primary)]">In 3 Simple Steps</span>
                    </h3>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full bg-card border-border hover:border-[var(--neon-primary)]/50 transition-all duration-300 relative rounded-none group">
                                <CardContent className="p-6 text-center">
                                    <div className="p-4 rounded-none bg-muted/20 border border-border w-fit mx-auto mb-4 group-hover:border-[var(--neon-primary)]/50 transition-colors">
                                        <step.icon className="w-8 h-8 text-foreground group-hover:text-[var(--neon-primary)] transition-colors" />
                                    </div>
                                    <div className="text-xs font-mono text-[var(--neon-primary)] mb-2 uppercase tracking-widest font-bold">
                                        {step.step}
                                    </div>
                                    <h4 className="text-xl font-bold font-mono text-foreground mb-3 uppercase tracking-tight">
                                        {step.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed uppercase">
                                        {step.description}
                                    </p>
                                </CardContent>
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                                        <ArrowRight className="w-8 h-8 text-[var(--neon-primary)] opacity-20" />
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-center max-w-3xl mx-auto"
                >
                    <div className="bg-card border border-border rounded-none p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-primary)]/5 via-transparent to-[var(--neon-primary)]/5 opacity-50" />

                        <div className="relative z-10">
                            <h4 className="text-2xl md:text-3xl font-bold font-mono text-foreground mb-4 uppercase tracking-tighter">
                                {isAuthenticated && profile?.onboarding_completed
                                    ? "Welcome Back, Developer"
                                    : `Join ${displayCount} Developers Today`}
                            </h4>
                            <p className="text-base md:text-lg text-muted-foreground mb-8 uppercase tracking-tight">
                                Your next opportunity is waiting. The community is ready. <br />
                                All you have to do is show up.
                            </p>
                            <Button
                                size="lg"
                                className="bg-[var(--neon-primary)] text-background hover:bg-[var(--neon-secondary)] font-bold text-lg px-10 py-8 h-auto shadow-[0_0_20px_rgba(var(--neon-primary-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--neon-primary-rgb),0.5)] transition-all duration-300 rounded-none uppercase group"
                                onClick={handleJoinClick}
                            >
                                {isAuthenticated && profile?.onboarding_completed
                                    ? "Enter Dashboard"
                                    : "Join Beta Now"}
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <p className="text-sm text-muted-foreground mt-10 font-mono uppercase tracking-widest">
                                Questions? <a href="https://discord.gg/krackeddevs" className="text-[var(--neon-primary)] hover:underline">Discord</a> / <a href="mailto:hello@krackeddevs.com" className="text-[var(--neon-primary)] hover:underline font-bold">hello@krackeddevs.com</a>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
