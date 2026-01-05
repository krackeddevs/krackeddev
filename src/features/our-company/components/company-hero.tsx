"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Code2, ShieldCheck, Zap } from "lucide-react";

export function CompanyHero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />
            <div className="absolute top-0 left-0 w-full h-full bg-background/80 backdrop-blur-[1px]" />

            {/* Spotlight Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-primary/20 rounded-full blur-[100px] opacity-30" />

            <div className="container relative z-10 px-4 mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-neon-primary/30 bg-neon-primary/5 text-neon-primary text-xs font-mono uppercase tracking-wider">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-primary"></span>
                        </span>
                        For Companies & Employers
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-mono tracking-tight mb-6 uppercase text-foreground">
                        Find and Hire <br />
                        <span className="text-neon-primary text-glow">Malaysia's Best Developers</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-mono leading-relaxed">
                        Post a project. Get applications from vetted developers. Choose your winner. <span className="text-foreground font-bold">Done.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                            size="lg"
                            className="bg-neon-primary text-primary-foreground hover:bg-neon-secondary font-bold text-lg px-8 py-6 h-auto shadow-[0_0_20px_rgba(21,128,61,0.5)] hover:shadow-[0_0_30px_rgba(21,128,61,0.7)] transition-all duration-300 group min-w-[200px]"
                            asChild
                        >
                            <Link href="/post-bounty">
                                Post a Project
                                <span className="block text-xs font-normal opacity-80 mt-1">One-off deliverable</span>
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-neon-primary/50 text-neon-primary hover:bg-neon-primary/10 font-bold text-lg px-8 py-6 h-auto transition-all duration-300 group min-w-[200px]"
                            asChild
                        >
                            <Link href="/hire/register">
                                Hire Staff
                                <span className="block text-xs font-normal opacity-80 mt-1">Full-time / Contract</span>
                            </Link>
                        </Button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto border-t border-border/50 pt-8">
                        <div className="flex flex-col items-center gap-2">
                            <ShieldCheck className="w-8 h-8 text-neon-primary mb-2" />
                            <h3 className="font-bold text-foreground">Pre-Vetted Talent</h3>
                            <p className="text-sm text-muted-foreground">Top 5% of applicants</p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Zap className="w-8 h-8 text-neon-primary mb-2" />
                            <h3 className="font-bold text-foreground">Fast Turnaround</h3>
                            <p className="text-sm text-muted-foreground">Hiring in 48 hours</p>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Code2 className="w-8 h-8 text-neon-primary mb-2" />
                            <h3 className="font-bold text-foreground">Real Projects</h3>
                            <p className="text-sm text-muted-foreground">Proven track record</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
