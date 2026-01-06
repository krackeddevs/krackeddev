"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, DollarSign, FolderKanban, Users, TrendingUp } from "lucide-react";

const features = [
    {
        icon: Brain,
        title: "Learn Modern Skills",
        description: "Master AI-assisted vibe coding, the way developers actually work in 2026",
        points: [
            "Forget memorizing syntax - learn to build with AI tools",
            "Practical projects from day one, no theoretical fluff",
            "Community-driven learning with peer support",
            "Learn at your own pace with free resources"
        ]
    },
    {
        icon: DollarSign,
        title: "Earn Real Money",
        description: "Win paid bounties from real businesses while building your portfolio",
        points: [
            "Bounties ranging from RM150 to RM3,000",
            "Recent bounties average RM150-500 per project",
            "No experience required - bounties for all levels",
            "Every win builds your reputation"
        ]
    },
    {
        icon: FolderKanban,
        title: "Build Your Portfolio",
        description: "Every bounty becomes proof of your skills to future employers",
        points: [
            "Showcase real client work, not tutorial projects",
            "GitHub integration shows your actual code",
            "Create case studies you can share",
            "Collect testimonials that build credibility"
        ]
    },
    {
        icon: Users,
        title: "Join the Community",
        description: "400+ developers waiting to build, learn, and grow together",
        points: [
            "Active Discord - get unstuck 24/7",
            "Weekly events: portfolio reviews, live builds, Q&A",
            "Share opportunities and collaborations",
            "Never code alone again"
        ]
    },
    {
        icon: TrendingUp,
        title: "Grow Your Career",
        description: "From first project to first job, and beyond",
        points: [
            "Job board launching Q1 2026",
            "Get discovered - companies see your work first",
            "No application black holes",
            "Freelance clients, co-founder opportunities, contracts"
        ]
    }
];

export function DevelopersSolution() {
    return (
        <section className="py-24 bg-background relative overflow-hidden font-mono">
            {/* Background Effects */}
            <div className="absolute inset-0 grid-background opacity-[0.05]" />

            <div className="container px-4 mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-sm font-mono text-[var(--neon-primary)] tracking-widest uppercase mb-4 tracking-widest">The Kracked Devs Difference</h2>
                    <h3 className="text-3xl md:text-5xl font-bold font-mono text-foreground mb-6 uppercase tracking-tighter">
                        We're Not Just Another Job Board. <br />
                        <span className="text-[var(--neon-primary)]">We're Your Whole Ecosystem.</span>
                    </h3>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={index === 4 ? "md:col-span-2 lg:col-span-1" : ""}
                        >
                            <Card className="h-full bg-card border border-border hover:border-[var(--neon-primary)]/50 transition-all duration-300 rounded-none group">
                                <CardContent className="p-6">
                                    <div className="p-3 rounded-none bg-[var(--neon-primary)]/5 border border-[var(--neon-primary)]/20 w-fit mb-4 group-hover:bg-[var(--neon-primary)]/10 transition-colors">
                                        <feature.icon className="w-6 h-6 text-[var(--neon-primary)]" />
                                    </div>
                                    <h4 className="text-xl font-bold font-mono text-foreground mb-2 uppercase tracking-tight">
                                        {feature.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed uppercase">
                                        {feature.description}
                                    </p>
                                    <ul className="space-y-2">
                                        {feature.points.map((point, i) => (
                                            <li key={i} className="flex items-start gap-2 text-[10px] text-muted-foreground uppercase">
                                                <span className="text-[var(--neon-primary)] font-bold">[•]</span>
                                                <span className="opacity-80">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
