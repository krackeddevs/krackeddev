"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Building2, TrendingUp, Users } from "lucide-react";

export function GovernmentHero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
            {/* Background Effects */}
            <div className="absolute inset-0 grid-background opacity-[0.05]" />

            {/* Spotlight Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--neon-cyan)] opacity-[0.03] dark:opacity-[0.1] rounded-full blur-[100px]" />

            <div className="container relative z-10 px-4 mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-none border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 text-[var(--neon-cyan)] text-[10px] font-mono uppercase tracking-wider">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--neon-cyan)] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--neon-cyan)]"></span>
                        </span>
                        For Government & Policy Makers
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-mono tracking-tight mb-6 uppercase text-foreground">
                        Building Malaysia's <br />
                        <span className="text-[var(--neon-cyan)] text-glow">Tech Talent Pipeline</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 font-mono leading-relaxed">
                        Partner with Kracked Devs to upskill junior developers, reduce unemployment, and close the digital skills gap, <span className="text-foreground font-bold">at zero cost to taxpayers.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                            size="lg"
                            className="bg-[var(--neon-cyan)] text-background hover:bg-[var(--neon-cyan)]/90 font-bold text-lg px-8 py-6 h-auto shadow-[0_0_20px_rgba(var(--neon-cyan-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--neon-cyan-rgb),0.5)] transition-all duration-300 group min-w-[200px] rounded-none"
                            onClick={() => {
                                const ctaSection = document.getElementById('contact-forms');
                                ctaSection?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            Partner With Us
                        </Button>
                    </div>

                    {/* Alignment Badge */}
                    <div className="mt-12 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
                        <Building2 className="w-5 h-5 text-neon-cyan" />
                        <span className="text-sm font-mono text-muted-foreground">
                            Aligned with <span className="text-foreground font-bold">Malaysia Digital Economy Blueprint 2025-2030</span>
                        </span>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto border-t border-border/50 pt-8">
                        <div className="flex flex-col items-center gap-2">
                            <Users className="w-8 h-8 text-neon-cyan mb-2" />
                            <h3 className="font-bold text-foreground">1,000+ Developers</h3>
                            <p className="text-sm text-muted-foreground">Trained by 2027</p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <TrendingUp className="w-8 h-8 text-neon-cyan mb-2" />
                            <h3 className="font-bold text-foreground">30% Employment Rate</h3>
                            <p className="text-sm text-muted-foreground">Within 6 months</p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Building2 className="w-8 h-8 text-neon-cyan mb-2" />
                            <h3 className="font-bold text-foreground">Zero Public Funding</h3>
                            <p className="text-sm text-muted-foreground">Self-sustaining model</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
