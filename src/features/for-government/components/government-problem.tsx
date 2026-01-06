"use client";

import { motion } from "framer-motion";
import { AlertTriangle, GraduationCap, TrendingDown, Users, DollarSign, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const problems = [
    {
        icon: Users,
        title: "50,000 Junior Developers",
        description: "Looking for their first job, but 40% of tech positions remain unfilled due to talent gaps."
    },
    {
        icon: GraduationCap,
        title: "Lack of Experience",
        description: "Fresh graduates lack real-world project experience that employers demand."
    },
    {
        icon: DollarSign,
        title: "Expensive Bootcamps",
        description: "Training costs RM10K-20K, inaccessible to low-income families, perpetuating inequality."
    },
    {
        icon: Building,
        title: "Overseas Outsourcing",
        description: "Companies resort to outsourcing overseas, draining capital and talent from Malaysia."
    },
    {
        icon: TrendingDown,
        title: "High Youth Unemployment",
        description: "Youth unemployment in tech-adjacent fields remains high despite massive demand for digital skills."
    },
    {
        icon: AlertTriangle,
        title: "Traditional Programs Fail",
        description: "Government-funded bootcamps have low completion rates (20-50%) and poor employment outcomes."
    }
];

export function GovernmentProblem() {
    return (
        <section className="py-24 bg-muted/10 relative overflow-hidden font-mono">
            {/* Background Pattern */}
            <div className="absolute inset-0 grid-background opacity-[0.05]" />

            <div className="container px-4 mx-auto relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-sm font-mono text-[var(--neon-cyan)] tracking-widest uppercase mb-4 tracking-widest">The Problem Governments Face</h2>
                        <h3 className="text-3xl md:text-5xl font-bold font-mono text-foreground mb-6 uppercase tracking-tighter">
                            The Tech Talent Crisis <br />
                            <span className="text-destructive uppercase">Is Slowing National Growth</span>
                        </h3>
                        <p className="text-muted-foreground max-w-3xl mx-auto text-sm leading-relaxed uppercase">
                            Malaysia has the talent, but traditional approaches to skills training and employment are failing our youth and our economy.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {problems.map((problem, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full bg-card border-border hover:border-destructive/50 transition-all duration-300 group rounded-none">
                                <CardHeader>
                                    <div className="w-12 h-12 rounded-none bg-destructive/10 flex items-center justify-center mb-4 group-hover:bg-destructive/20 transition-colors border border-destructive/20">
                                        <problem.icon className="w-6 h-6 text-destructive" />
                                    </div>
                                    <CardTitle className="text-xl font-bold font-mono uppercase tracking-tight">{problem.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-xs leading-relaxed uppercase">
                                        {problem.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Traditional Approaches Section */}
                <div className="mt-20 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-card border border-destructive/30 rounded-none p-10 shadow-2xl"
                    >
                        <h4 className="text-2xl font-bold font-mono text-foreground mb-6 uppercase flex items-center gap-3 tracking-tighter">
                            <AlertTriangle className="w-8 h-8 text-destructive" />
                            Traditional Approaches Don't Work
                        </h4>
                        <ul className="space-y-4 text-muted-foreground text-xs uppercase">
                            {[
                                "Government-funded bootcamps have low completion rates and poor employment outcomes",
                                "Skills training programs teach outdated curriculums that don't match industry needs",
                                "Job placement initiatives lack engagement mechanisms and community support",
                                "Public-private partnerships move slowly with heavy bureaucracy",
                                "Graduates still can't prove their skills to employers"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="text-destructive font-bold">[X]</span>
                                    <span className="opacity-80">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
