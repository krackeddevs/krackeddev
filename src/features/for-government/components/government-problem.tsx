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
        <section className="py-24 bg-muted/5 relative overflow-hidden">
            <div className="container px-4 mx-auto">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-sm font-mono text-neon-cyan tracking-widest uppercase mb-4">The Problem Governments Face</h2>
                        <h3 className="text-3xl md:text-5xl font-bold font-mono text-foreground mb-6 uppercase">
                            The Tech Talent Crisis <span className="text-destructive">Is Slowing National Growth</span>
                        </h3>
                        <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
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

                {/* Traditional Approaches Section */}
                <div className="mt-20 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-card/30 backdrop-blur-sm border border-destructive/30 rounded-xl p-8"
                    >
                        <h4 className="text-2xl font-bold font-mono text-foreground mb-4 uppercase flex items-center gap-3">
                            <AlertTriangle className="w-6 h-6 text-destructive" />
                            Traditional Approaches Don't Work
                        </h4>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-start gap-3">
                                <span className="text-destructive mt-1">✗</span>
                                <span>Government-funded bootcamps have low completion rates and poor employment outcomes</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-destructive mt-1">✗</span>
                                <span>Skills training programs teach outdated curriculums that don't match industry needs</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-destructive mt-1">✗</span>
                                <span>Job placement initiatives lack engagement mechanisms and community support</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-destructive mt-1">✗</span>
                                <span>Public-private partnerships move slowly with heavy bureaucracy</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-destructive mt-1">✗</span>
                                <span>Graduates still can't prove their skills to employers</span>
                            </li>
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
