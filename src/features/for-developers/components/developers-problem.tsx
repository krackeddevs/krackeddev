"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, DollarSign, Users, BookOpen, Briefcase } from "lucide-react";

const struggles = [
    {
        icon: BookOpen,
        title: "No Real Projects",
        description: "You've learned to code but have nothing to show employers"
    },
    {
        icon: DollarSign,
        title: "Expensive Bootcamps",
        description: "RM10K-20K with no job guarantee and rigid curriculums"
    },
    {
        icon: Users,
        title: "Isolated Learning",
        description: "Freelancing alone is competitive with no one to ask when stuck"
    },
    {
        icon: Briefcase,
        title: "Experience Paradox",
        description: "Companies want experience but won't give you a chance"
    }
];

const alternatives = [
    "Traditional bootcamps: Expensive, rigid, outdated methods",
    "Solo freelancing: Race to the bottom, no support",
    "Job boards: List opportunities but don't help build skills",
    "Self-learning: Slow progress, no accountability, only tutorials"
];

export function DevelopersProblem() {
    return (
        <section className="py-24 bg-muted/30 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />

            <div className="container px-4 mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-sm font-mono text-neon-primary tracking-widest uppercase mb-4">The Problem You Face</h2>
                    <h3 className="text-3xl md:text-5xl font-bold font-mono text-foreground mb-6 uppercase">
                        You Can Code. <br />
                        <span className="text-neon-primary">But Where Do You Go From Here?</span>
                    </h3>
                </motion.div>

                {/* The Struggle */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {struggles.map((struggle, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full bg-card/40 backdrop-blur-md border-border hover:border-neon-primary/50 transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 w-fit mb-4">
                                        <struggle.icon className="w-6 h-6 text-destructive" />
                                    </div>
                                    <h4 className="text-lg font-bold font-mono text-foreground mb-2 uppercase">
                                        {struggle.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {struggle.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* The Alternatives Don't Work */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="bg-card/60 backdrop-blur-md border border-border rounded-xl p-8">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/30">
                                <AlertCircle className="w-6 h-6 text-destructive" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold font-mono text-foreground mb-2 uppercase">
                                    The Alternatives Don't Work
                                </h4>
                                <p className="text-muted-foreground text-sm">
                                    You've probably tried these. Here's why they fail:
                                </p>
                            </div>
                        </div>
                        <ul className="space-y-3">
                            {alternatives.map((alt, index) => (
                                <li key={index} className="flex items-start gap-3 text-sm">
                                    <span className="text-destructive mt-1">✗</span>
                                    <span className="text-muted-foreground">{alt}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                {/* What You Actually Need */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-16 text-center max-w-3xl mx-auto"
                >
                    <h4 className="text-2xl font-bold font-mono text-foreground mb-6 uppercase">
                        What You Actually Need
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                        {[
                            "A community that supports your growth",
                            "Real projects to build your portfolio",
                            "Ways to earn money while learning",
                            "Mentorship from developers who've been there",
                            "A platform that opens doors, not just lists jobs"
                        ].map((need, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <span className="text-neon-primary mt-1">✓</span>
                                <span className="text-muted-foreground text-sm">{need}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
