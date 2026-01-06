"use client";

import { motion } from "framer-motion";
import { Target, Users, Briefcase, DollarSign, TrendingUp, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const impacts = [
    {
        icon: Users,
        title: "Reduce Youth Unemployment",
        stats: "1,000 developers by 2027",
        description: "Train and employ junior developers with 30% employment within 6 months. Low-income families gain free training and income opportunities.",
        color: "text-neon-cyan"
    },
    {
        icon: Target,
        title: "Close Digital Skills Gap",
        stats: "40% unfilled positions",
        description: "Reduce hiring time from 3-6 months to 2-4 weeks with pre-vetted, portfolio-proven candidates trained in modern AI-assisted coding.",
        color: "text-neon-primary"
    },
    {
        icon: Briefcase,
        title: "Support Local Tech Ecosystem",
        stats: "RM5K-15K saved per hire",
        description: "Companies save on recruitment costs. Reduced overseas outsourcing keeps talent and capital in Malaysia.",
        color: "text-status-warning"
    },
    {
        icon: TrendingUp,
        title: "Scalable Without Public Budget",
        stats: "Profitable by Year 2",
        description: "Commission-based model requires no ongoing funding. Government provides credibility and visibility, not money.",
        color: "text-neon-secondary"
    }
];

const metrics = [
    {
        category: "Developer Outcomes",
        items: [
            "Members trained and onboarded",
            "Bootcamp completion rate (target: 70%)",
            "Average time to first job (target: 4-6 months)",
            "Employment rate at 6 months (target: 30%)",
            "Average starting salary (target: RM3,000-5,000)"
        ]
    },
    {
        category: "Employer Outcomes",
        items: [
            "Companies hiring from platform",
            "Average time to hire (target: 2-4 weeks vs 3-6 months)",
            "Cost savings per hire (target: RM5,000-10,000)",
            "Repeat hiring rate (target: 60%)"
        ]
    },
    {
        category: "Economic Impact",
        items: [
            "Total income earned by developers",
            "Malaysian Ringgit retained vs outsourcing",
            "Tax revenue from newly employed developers",
            "Company productivity gains from faster hiring"
        ]
    }
];

export function GovernmentImpact() {
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
                        <h2 className="text-sm font-mono text-neon-cyan tracking-widest uppercase mb-4">Impact on National Priorities</h2>
                        <h3 className="text-3xl md:text-5xl font-bold font-mono text-foreground mb-6 uppercase">
                            Aligned with <span className="text-neon-cyan">Malaysia Digital Economy Blueprint</span>
                        </h3>
                    </motion.div>
                </div>

                {/* Impact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-20">
                    {impacts.map((impact, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full bg-card/50 backdrop-blur-sm border-border hover:border-neon-cyan/50 transition-all duration-300">
                                <CardHeader>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-xl bg-background border border-border ${impact.color}`}>
                                            <impact.icon className="w-6 h-6" />
                                        </div>
                                        <span className="text-xs font-mono text-neon-cyan bg-neon-cyan/10 px-2 py-1 rounded">
                                            {impact.stats}
                                        </span>
                                    </div>
                                    <CardTitle className="text-xl font-bold font-mono uppercase">{impact.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {impact.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Success Metrics */}
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <h4 className="text-2xl font-bold font-mono text-foreground mb-4 uppercase flex items-center justify-center gap-3">
                            <BarChart3 className="w-6 h-6 text-neon-cyan" />
                            Success Metrics We Track
                        </h4>
                        <p className="text-muted-foreground">Transparent impact reporting for accountability</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {metrics.map((metric, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="h-full bg-card/30 backdrop-blur-sm border-border">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-bold font-mono text-neon-cyan uppercase">
                                            {metric.category}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2">
                                            {metric.items.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                    <span className="text-neon-cyan mt-1">•</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
