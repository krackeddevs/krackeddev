"use client";

import { motion } from "framer-motion";
import { Award, Building2, Database, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const partnerships = [
    {
        icon: Award,
        title: "Official Recognition & Endorsement",
        items: [
            "List Kracked Devs as recognized skills training pathway under MDEC or Ministry of Higher Education",
            "Include platform in national digital skills initiatives and youth employment campaigns",
            "Provide accreditation or certification pathways for bootcamp graduates",
            "Feature success stories in government communications"
        ]
    },
    {
        icon: Building2,
        title: "Access to Existing Programs",
        items: [
            "Allow members to qualify for existing tech training grants or subsidies",
            "Connect with MDEC-registered companies looking to hire junior developers",
            "Include job board in national employment portals like MYFutureJobs",
            "Facilitate partnerships with polytechnics, universities, and TVET institutions"
        ]
    },
    {
        icon: Database,
        title: "Data Sharing & Impact Measurement",
        items: [
            "Collaborate on tracking employment outcomes, salary data, and skills development metrics",
            "Share anonymized data to improve national workforce planning",
            "Provide government endorsement for impact reports to attract corporate partners",
            "Quarterly reporting on key performance indicators"
        ]
    },
    {
        icon: Scale,
        title: "Regulatory Support",
        items: [
            "Streamline licensing or certification requirements for skills training platforms",
            "Support cross-border expansion to ASEAN markets through trade agreements",
            "Facilitate partnerships with GLC companies to pilot hiring from talent pool",
            "Provide regulatory clarity for platform operations"
        ]
    }
];

export function GovernmentPartnership() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container px-4 mx-auto">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-sm font-mono text-neon-cyan tracking-widest uppercase mb-4">How Government Can Partner</h2>
                        <h3 className="text-3xl md:text-5xl font-bold font-mono text-foreground mb-6 uppercase">
                            We Don't Need Funding<br />
                            <span className="text-neon-cyan">We Need Visibility and Alignment</span>
                        </h3>
                        <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
                            Government partnership provides credibility, visibility, and regulatory alignment—not funding.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {partnerships.map((partnership, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full bg-card/40 backdrop-blur-md border-border hover:border-neon-cyan/50 transition-all duration-300">
                                <CardHeader>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30">
                                            <partnership.icon className="w-6 h-6 text-neon-cyan" />
                                        </div>
                                        <CardTitle className="text-xl font-bold font-mono uppercase flex-1">
                                            {partnership.title}
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {partnership.items.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <span className="text-neon-cyan mt-1 flex-shrink-0">✓</span>
                                                <span className="text-muted-foreground text-sm leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
