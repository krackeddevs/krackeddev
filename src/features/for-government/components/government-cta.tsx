"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, FileText, Briefcase, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { GovernmentContactForm } from "./government-contact-form";

const ctas = [
    {
        icon: Mail,
        title: "For Policy Makers",
        description: "Schedule a partnership discussion to explore official recognition, program alignment, and impact measurement.",
        action: "Schedule Discussion",
        inquiryType: "policy_maker" as const,
        color: "neon-cyan"
    },
    {
        icon: FileText,
        title: "For MDEC & Ministry Officials",
        description: "Request our full impact proposal including detailed metrics, case studies, and regulatory requirements.",
        action: "Request Proposal",
        inquiryType: "mdec_ministry" as const,
        color: "neon-primary"
    },
    {
        icon: Briefcase,
        title: "For GLCs & Government-Linked Companies",
        description: "Pilot hiring junior developers from Kracked Devs. Receive dedicated account management and first access to top talent.",
        action: "Start Pilot Program",
        inquiryType: "glc_company" as const,
        color: "neon-secondary"
    }
];

export function GovernmentCTA() {
    const [userCount, setUserCount] = useState<number | null>(null);
    const [openDialog, setOpenDialog] = useState<string | null>(null);

    useEffect(() => {
        // Fetch user count
        fetch('/api/stats/user-count')
            .then(res => res.json())
            .then(data => setUserCount(data.count))
            .catch(err => console.error('Error fetching user count:', err));
    }, []);

    const displayCount = userCount ? `${userCount}+` : '300+';

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-cyan/10 rounded-full blur-[120px]" />

            <div className="container px-4 mx-auto relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-sm font-mono text-neon-cyan tracking-widest uppercase mb-4">Call to Action</h2>
                        <h3 className="text-3xl md:text-5xl font-bold font-mono text-foreground mb-6 uppercase">
                            Let's Build Malaysia's <br />
                            <span className="text-neon-cyan">Tech Future Together</span>
                        </h3>
                    </motion.div>
                </div>

                <div id="contact-forms" className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                    {ctas.map((cta, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full bg-card/40 backdrop-blur-md border-border hover:border-neon-cyan/50 transition-all duration-300 group">
                                <CardContent className="p-6 flex flex-col h-full">
                                    <div className={`p-3 rounded-xl bg-${cta.color}/10 border border-${cta.color}/30 w-fit mb-4`}>
                                        <cta.icon className={`w-6 h-6 text-${cta.color}`} />
                                    </div>
                                    <h4 className="text-xl font-bold font-mono text-foreground mb-3 uppercase">
                                        {cta.title}
                                    </h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">
                                        {cta.description}
                                    </p>
                                    <Dialog open={openDialog === cta.inquiryType} onOpenChange={(open) => setOpenDialog(open ? cta.inquiryType : null)}>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10 group-hover:border-neon-cyan transition-all duration-300"
                                            >
                                                {cta.action}
                                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle className="text-2xl font-mono uppercase">
                                                    {cta.title}
                                                </DialogTitle>
                                            </DialogHeader>
                                            <GovernmentContactForm
                                                inquiryType={cta.inquiryType}
                                                title={cta.action}
                                                description={cta.description}
                                            />
                                        </DialogContent>
                                    </Dialog>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Final CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-center max-w-3xl mx-auto"
                >
                    <div className="bg-gradient-to-r from-neon-cyan/10 via-transparent to-neon-cyan/10 border border-neon-cyan/30 rounded-xl p-8">
                        <h4 className="text-2xl font-bold font-mono text-foreground mb-4 uppercase">
                            Join {displayCount} Senior and Junior Developers
                        </h4>
                        <p className="text-lg text-muted-foreground mb-6">
                            Already Building the Future
                        </p>
                        <Button
                            size="lg"
                            className="bg-neon-cyan text-primary-foreground hover:bg-neon-cyan/90 font-bold text-lg px-8 py-6 h-auto shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] transition-all duration-300"
                            asChild
                        >
                            <a href="/">
                                Explore Kracked Devs
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </a>
                        </Button>
                        <p className="text-sm text-muted-foreground mt-4 font-mono">
                            Build. Learn. Earn. Together.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
