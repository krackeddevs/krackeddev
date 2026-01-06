"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign, Globe } from "lucide-react";

const timeline = [
    {
        year: "Year 1 (2026-2027)",
        title: "Proof of Concept",
        icon: Users,
        metrics: [
            "500 active members by February 2026",
            "50 developers hired by companies",
            "RM30-50K in bounties and mentoring income distributed",
            "5 corporate partners onboarded"
        ],
        color: "text-neon-cyan"
    },
    {
        year: "Year 2 (2027-2028)",
        title: "Scale",
        icon: TrendingUp,
        metrics: [
            "3,000 active members",
            "300 developers hired",
            "RM200-500K in income distributed to developers",
            "20 corporate partners"
        ],
        color: "text-neon-primary"
    },
    {
        year: "Year 3 (2028-2029)",
        title: "Regional Leader",
        icon: Globe,
        metrics: [
            "5,000 active members in Malaysia",
            "500 developers hired annually",
            "RM1.5-2M in income distributed",
            "Begin expansion to Singapore and Thailand"
        ],
        color: "text-neon-secondary"
    }
];

export function GovernmentTimeline() {
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
                        <h2 className="text-sm font-mono text-neon-cyan tracking-widest uppercase mb-4">Timeline & Projections</h2>
                        <h3 className="text-3xl md:text-5xl font-bold font-mono text-foreground mb-6 uppercase">
                            Path to <span className="text-neon-cyan">National Impact</span>
                        </h3>
                    </motion.div>
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-neon-cyan via-neon-primary to-neon-secondary" />

                        <div className="space-y-12">
                            {timeline.map((phase, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.2 }}
                                    className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                                >
                                    {/* Content Card */}
                                    <div className="w-full md:w-[calc(50%-2rem)] bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-neon-cyan/50 transition-all duration-300">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`p-2 rounded-lg bg-background border border-border ${phase.color}`}>
                                                <phase.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-mono text-neon-cyan uppercase">{phase.year}</h4>
                                                <h5 className="text-xl font-bold font-mono text-foreground uppercase">{phase.title}</h5>
                                            </div>
                                        </div>
                                        <ul className="space-y-2">
                                            {phase.metrics.map((metric, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                    <span className="text-neon-cyan mt-1">•</span>
                                                    <span>{metric}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Timeline Dot */}
                                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-neon-cyan border-4 border-background shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Vision Statement */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="mt-16 text-center bg-gradient-to-r from-neon-cyan/10 via-neon-primary/10 to-neon-secondary/10 border border-neon-cyan/30 rounded-xl p-8"
                    >
                        <p className="text-lg font-mono text-foreground leading-relaxed">
                            By Year 3, Kracked Devs becomes a <span className="text-neon-cyan font-bold">self-sustaining national asset</span>, training thousands, employing hundreds, and closing the skills gap <span className="text-neon-cyan font-bold">without ongoing public funding</span>.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
