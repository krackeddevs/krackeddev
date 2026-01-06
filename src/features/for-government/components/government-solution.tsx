"use client";

import { motion } from "framer-motion";
import { Zap, Users, DollarSign, TrendingUp, Award, Gamepad2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
    {
        icon: Gamepad2,
        title: "Gamified Learning",
        description: "Retro 2D platform where developers learn modern AI-assisted coding through community-driven bootcamps at their own pace.",
        color: "text-neon-cyan"
    },
    {
        icon: Award,
        title: "Real Portfolio Projects",
        description: "Developers build 2-3 real portfolio projects with mentor guidance, proving their skills to employers.",
        color: "text-neon-primary"
    },
    {
        icon: DollarSign,
        title: "Earn While Learning",
        description: "Paid projects (RM150-3,000) and mentoring opportunities (RM30-100/hour) keep learners motivated and reduce financial barriers.",
        color: "text-status-warning"
    },
    {
        icon: Users,
        title: "Community Support",
        description: "87% higher engagement than traditional training through peer support, mentorship, and collaborative learning.",
        color: "text-neon-secondary"
    },
    {
        icon: Zap,
        title: "Fast Employment",
        description: "Companies hire vetted developers in 2-4 weeks instead of 3-6 months, with proven portfolios instead of resume guessing.",
        color: "text-neon-cyan"
    },
    {
        icon: TrendingUp,
        title: "Self-Sustaining Model",
        description: "Revenue from job posting fees and recruitment commissions. No taxpayer money required, no ongoing public funding needed.",
        color: "text-neon-primary"
    }
];

export function GovernmentSolution() {
    return (
        <section className="py-24 bg-background relative overflow-hidden font-mono">
            {/* Background elements */}
            <div className="absolute inset-0 grid-background opacity-[0.05]" />
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[var(--neon-cyan)]/5 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[var(--neon-primary)]/5 blur-[100px] rounded-full" />

            <div className="container px-4 mx-auto relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-sm font-mono text-[var(--neon-cyan)] tracking-widest uppercase mb-4 tracking-widest">The Kracked Devs Solution</h2>
                        <h3 className="text-3xl md:text-5xl font-bold font-mono text-foreground mb-6 uppercase tracking-tighter">
                            A Self-Sustaining Ecosystem <br />
                            <span className="text-[var(--neon-cyan)]">That Requires No Public Funding</span>
                        </h3>
                        <p className="text-muted-foreground max-w-3xl mx-auto text-sm leading-relaxed uppercase">
                            We solve the talent gap through gamification, community, and real economic incentives—all without government subsidies.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full bg-card border-border hover:border-[var(--neon-cyan)]/50 transition-all duration-300 rounded-none group hover:shadow-[0_0_20px_rgba(var(--neon-cyan-rgb),0.2)]">
                                <CardContent className="p-6 flex flex-col items-start gap-4">
                                    <div className="p-3 rounded-none bg-muted/20 border border-border group-hover:border-[var(--neon-cyan)]/50 transition-colors">
                                        <feature.icon className="w-8 h-8 text-foreground group-hover:text-[var(--neon-cyan)] transition-colors" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold font-mono text-foreground mb-3 uppercase tracking-tight">{feature.title}</h4>
                                        <p className="text-muted-foreground leading-relaxed text-xs uppercase opacity-80">
                                            {feature.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* How It Works Flow */}
                <div className="mt-20 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h4 className="text-2xl font-bold font-mono text-center text-foreground mb-12 uppercase tracking-tight">System Workflow</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                "Developers join for free and complete onboarding in 1-2 days",
                                "Learn vibe coding (AI-assisted development) through community bootcamp",
                                "Build 2-3 real portfolio projects with mentor guidance",
                                "Take on paid projects from businesses (RM150-3,000 per project)",
                                "Advanced developers become mentors (RM30-100 per hour)",
                                "Companies browse vetted portfolios and hire in 2-4 weeks",
                                "Platform earns through job fees and commissions—zero taxpayer money"
                            ].map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex items-start gap-4 bg-muted/10 border border-border rounded-none p-6 shadow-xl relative overflow-hidden group hover:border-[var(--neon-cyan)]/30 transition-colors"
                                >
                                    <div className="flex-shrink-0 w-10 h-10 rounded-none bg-[var(--neon-cyan)]/10 border border-[var(--neon-cyan)]/50 flex items-center justify-center group-hover:bg-[var(--neon-cyan)]/20 transition-colors">
                                        <span className="text-[var(--neon-cyan)] font-bold text-sm font-mono">[{index + 1}]</span>
                                    </div>
                                    <p className="text-muted-foreground text-xs uppercase leading-relaxed pt-1 font-mono">{step}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
