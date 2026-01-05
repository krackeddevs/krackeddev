"use client";

import { motion } from "framer-motion";
import { AlertCircle, Clock, DollarSign, SearchX, UserX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const problems = [
    {
        icon: SearchX,
        title: "Flooded Job Boards",
        description: "Job boards are flooded with applications from unqualified candidates. Sorting through them is a nightmare."
    },
    {
        icon: DollarSign,
        title: "Expensive Agencies",
        description: "Recruitment agencies take 20-30% commission. That's money that could go into development."
    },
    {
        icon: UserX,
        title: "Unverified Skills",
        description: "It's hard to tell if developers can actually code or just talk about it. Resumes can be faked."
    },
    {
        icon: Clock,
        title: "Slow Onboarding",
        description: "Onboarding junior developers takes significant time and training before they become productive."
    }
];

export function CompanyProblem() {
    return (
        <section className="py-24 bg-muted/5 relative overflow-hidden">
            <div className="container px-4 mx-auto">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-sm font-mono text-neon-primary tracking-widest uppercase mb-4">The Problem You Face</h2>
                        <h3 className="text-3xl md:text-5xl font-bold font-mono text-foreground mb-6 uppercase">
                            Hiring Developers <span className="text-destructive line-through decoration-wavy decoration-2">Is Broken</span>
                        </h3>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                            Traditional hiring methods are failing modern companies. The struggle to find quality talent is real.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {problems.map((problem, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full bg-card/50 backdrop-blur-sm border-border hover:border-destructive/50 transition-all duration-300 group">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4 group-hover:bg-destructive/20 transition-colors">
                                        <problem.icon className="w-6 h-6 text-destructive" />
                                    </div>
                                    <CardTitle className="text-xl font-bold font-mono">{problem.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {problem.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
