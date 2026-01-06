"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Zap, DollarSign, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
    {
        icon: Users,
        title: "Vetted Talent",
        description: "Every developer has real project history, not just resume claims. Community ratings, verified GitHub profiles, and proven delivery.",
        color: "text-neon-cyan"
    },
    {
        icon: DollarSign,
        title: "Affordable",
        description: "No hidden costs. No 20-30% agency commissions. You pay for the project, we take 0% from your budget.",
        color: "text-neon-primary"
    },
    {
        icon: Zap,
        title: "Fast Turnaround",
        description: "Post today, get applications tomorrow. Winning developer starts in days, not weeks.",
        color: "text-status-warning"
    },
    {
        icon: TrendingUp,
        title: "Scale With Us",
        description: "Ongoing access to a growing talent pool. Build long-term partnerships and teams as you grow.",
        color: "text-neon-secondary"
    }
];

export function CompanySolution() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[var(--neon-primary)] opacity-[0.02] blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[var(--neon-cyan)] opacity-[0.02] blur-[100px] rounded-full" />

            <div className="container px-4 mx-auto relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-sm font-mono text-[var(--neon-primary)] tracking-widest uppercase mb-4">The Kracked Devs Difference</h2>
                        <h3 className="text-3xl md:text-5xl font-bold font-mono text-foreground mb-6 uppercase">
                            We Connect You to <span className="text-[var(--neon-primary)]">Real Talent</span>
                        </h3>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed font-mono uppercase">
                            Fast. Affordable. Proven. The modern way to build your dev team.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full bg-card border-border hover:border-[var(--neon-primary)]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(var(--neon-primary-rgb),0.05)] rounded-none">
                                <CardContent className="p-8 flex items-start gap-6">
                                    <div className={cn("p-3 rounded-none bg-background border border-border shadow-sm", feature.color)}>
                                        <feature.icon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold font-mono text-foreground mb-3 uppercase">{feature.title}</h4>
                                        <p className="text-muted-foreground leading-relaxed font-mono text-sm uppercase">
                                            {feature.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
