"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";

export function CompanyCTA() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-background to-neon-primary/10" />

            <div className="container px-4 mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="w-20 h-20 bg-neon-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse-neon">
                        <Rocket className="w-10 h-10 text-neon-primary" />
                    </div>

                    <h2 className="text-4xl md:text-6xl font-bold font-mono text-foreground mb-6 uppercase tracking-tight">
                        Start Hiring <span className="text-neon-primary">Today</span>
                    </h2>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-mono">
                        Post your first project. See how fast you can find quality talent.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                            size="lg"
                            className="bg-neon-primary text-primary-foreground hover:bg-neon-secondary font-bold text-lg px-8 py-6 h-auto shadow-[0_0_20px_rgba(21,128,61,0.5)] hover:shadow-[0_0_30px_rgba(21,128,61,0.7)] transition-all duration-300 group min-w-[200px]"
                            asChild
                        >
                            <Link href="/post-bounty">
                                Post a Project
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
                            </Link>
                        </Button>
                    </div>

                    <div className="mt-12 text-sm text-muted-foreground font-mono">
                        Questions? Email <a href="mailto:hello@krackeddevs.com" className="text-neon-primary hover:underline">hello@krackeddevs.com</a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
