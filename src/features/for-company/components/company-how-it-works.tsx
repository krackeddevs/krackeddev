"use client";

import { motion } from "framer-motion";
import { PenTool, MessageSquare, Code2, Star } from "lucide-react";

const steps = [
    {
        icon: PenTool,
        title: "Post Your Project",
        description: "Tell us what you need. Set budget and deadline. It takes minutes.",
        step: "01"
    },
    {
        icon: MessageSquare,
        title: "Review & Connect",
        description: "See portfolios and ratings. Chat directly with applicants. No middleman.",
        step: "02"
    },
    {
        icon: Code2,
        title: "They Build, You Pay",
        description: "Developer starts building. Approve work as it happens. Release payment safely.",
        step: "03"
    },
    {
        icon: Star,
        title: "Rate & Review",
        description: "Leave feedback to build the community trust. Simple.",
        step: "04"
    }
];

export function CompanyHowItWorks() {
    return (
        <section id="how-it-works" className="py-24 bg-background relative">
            <div className="container px-4 mx-auto">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-sm font-mono text-[var(--neon-primary)] tracking-widest uppercase mb-4">Process</h2>
                        <h3 className="text-3xl md:text-5xl font-bold font-mono text-foreground mb-6 uppercase">
                            How It Works
                        </h3>
                    </motion.div>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 md:top-[85px] z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className="relative mb-8">
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-none bg-background border-2 border-border group-hover:border-[var(--neon-primary)] transition-colors flex items-center justify-center shadow-lg relative z-10 group-hover:shadow-[0_0_20px_rgba(var(--neon-primary-rgb),0.3)] duration-300">
                                        <step.icon className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground group-hover:text-[var(--neon-primary)] transition-colors" />
                                    </div>
                                    <div className="absolute -top-4 -right-4 bg-background border border-border px-2 py-1 rounded-none text-xs font-mono font-bold text-muted-foreground group-hover:text-[var(--neon-primary)] group-hover:border-[var(--neon-primary)] transition-colors">
                                        {step.step}
                                    </div>
                                </div>

                                <h4 className="text-xl font-bold font-mono text-foreground mb-3 uppercase tracking-tighter">{step.title}</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed font-mono uppercase tracking-tighter">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
