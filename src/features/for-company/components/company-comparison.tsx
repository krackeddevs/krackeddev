"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const comparisons = [
    {
        feature: "Cost",
        traditional: "Expensive (20-30% fees)",
        kracked: "Affordable (0% fees)"
    },
    {
        feature: "Vetting",
        traditional: "Often unverified / Resume scanning",
        kracked: "Real Project History & Code"
    },
    {
        feature: "Speed",
        traditional: "Weeks to Months",
        kracked: "Days (48hr shortlist)"
    },
    {
        feature: "Flexibility",
        traditional: "Long contracts / Headaches",
        kracked: "Direct relationship / Scalable"
    }
];

export function CompanyComparison() {
    return (
        <section className="py-24 bg-muted/5">
            <div className="container px-4 mx-auto max-w-5xl">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold font-mono text-foreground mb-6 uppercase">
                            Old Way <span className="text-muted-foreground mx-4">vs</span> <span className="text-neon-primary">New Way</span>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
                            Stop wasting budget on middlemen. Start building with builders.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* Desktop View - Table */}
                    <div className="hidden md:block overflow-hidden rounded-xl border border-border bg-card/50 backdrop-blur-sm shadow-xl">
                        <Table>
                            <TableHeader className="bg-muted/10">
                                <TableRow className="hover:bg-transparent border-b border-border">
                                    <TableHead className="w-[200px] text-lg font-bold font-mono text-foreground p-6">Comparison</TableHead>
                                    <TableHead className="text-lg font-mono text-muted-foreground p-6">Traditional Hiring</TableHead>
                                    <TableHead className="text-lg font-bold font-mono text-neon-primary p-6 bg-neon-primary/5">Kracked Devs</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {comparisons.map((item, index) => (
                                    <TableRow key={index} className="hover:bg-muted/5 border-b border-border/50">
                                        <TableCell className="font-medium p-6 font-mono text-foreground/80">{item.feature}</TableCell>
                                        <TableCell className="p-6 text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <X className="w-4 h-4 text-destructive shrink-0" />
                                                {item.traditional}
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-6 bg-neon-primary/5">
                                            <div className="flex items-center gap-2 font-bold text-foreground">
                                                <Check className="w-4 h-4 text-neon-primary shrink-0" />
                                                {item.kracked}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile View - Cards */}
                    <div className="md:hidden space-y-4">
                        {comparisons.map((item, index) => (
                            <div key={index} className="rounded-xl border border-border bg-card/50 backdrop-blur-sm shadow-md overflow-hidden">
                                <div className="bg-muted/10 p-4 border-b border-border/50">
                                    <h3 className="text-lg font-bold font-mono text-foreground">{item.feature}</h3>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div>
                                        <p className="text-xs font-mono text-muted-foreground mb-1 uppercase tracking-wider">Traditional</p>
                                        <div className="flex items-start gap-2 text-muted-foreground">
                                            <X className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                                            <span>{item.traditional}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-mono text-neon-primary mb-1 uppercase tracking-wider">Kracked Devs</p>
                                        <div className="flex items-start gap-2 font-medium text-foreground">
                                            <Check className="w-4 h-4 text-neon-primary shrink-0 mt-0.5" />
                                            <span>{item.kracked}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
