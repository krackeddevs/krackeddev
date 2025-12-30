"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Terminal, Send, DollarSign, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { submitBountyInquiry } from "@/features/landingpage/actions/submit-bounty-inquiry";

export default function PostBountyPage() {
    const router = useRouter();
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        company: "",
        email: "",
        budget: "",
        description: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const result = await submitBountyInquiry(formData);

            if (result.data) {
                setSubmitted(true);
            } else {
                console.error("Submission failed:", result.error);
                // Ideally show a toast or error message here
                alert("Failed to submit inquiry. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An unexpected error occurred.");
        }
    };

    if (submitted) {
        return (
            <main className="min-h-screen bg-background text-neon-primary font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden">
                <div className="scanlines fixed inset-0 pointer-events-none z-50 opacity-50" />
                <div className="max-w-md w-full border border-neon-primary/50 p-8 bg-background/80 backdrop-blur relative z-10 text-center">
                    <div className="absolute top-0 left-0 w-full h-1 bg-neon-primary shadow-[0_0_10px_var(--neon-primary)]" />
                    <Terminal className="w-16 h-16 mx-auto mb-6 text-neon-primary" />
                    <h1 className="text-2xl font-bold mb-4 tracking-wider">PROTOCOL INITIATED</h1>
                    <p className="text-sm mb-6 text-neon-primary/80">
                        Transmission received. Our agents will analyze your mission parameters and establish an encrypted uplink shortly.
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="text-xs uppercase tracking-[0.2em] hover:text-foreground transition-colors"
                    >
                        [ Return to Base ]
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background text-muted-foreground font-mono relative overflow-hidden">
            {/* CRT Overlay */}
            <div className="scanlines fixed inset-0 pointer-events-none z-50 opacity-30 h-screen" />

            {/* Background Grid - Reduced Opacity */}
            <div className="fixed inset-0 pointer-events-none opacity-10"
                style={{
                    backgroundImage: 'linear-gradient(var(--neon-primary) 1px, transparent 1px), linear-gradient(90deg, var(--neon-primary) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
                }}
            />

            <div className="container mx-auto px-4 py-12 relative z-10 max-w-3xl">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-sm text-neon-primary hover:text-neon-secondary mb-8 group transition-colors font-bold tracking-widest uppercase"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    ABORT MISSION
                </button>

                <header className="mb-12 border-l-4 border-neon-primary pl-6">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 tracking-tighter drop-shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                        DEPLOY MISSION
                    </h1>
                    <p className="text-neon-primary text-lg font-medium">
                        Initialize a new bounty protocol for the Kracked agent network.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8 bg-card/60 p-8 border border-neon-primary/30 rounded-sm backdrop-blur-xl shadow-[0_0_20px_rgba(34,197,94,0.05)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Company Name */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-neon-primary font-bold">Target Organization</label>
                            <div className="relative group">
                                <Briefcase className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-neon-primary transition-colors" />
                                <input
                                    required
                                    type="text"
                                    placeholder="Company Name"
                                    className="w-full bg-background/80 border border-border focus:border-neon-primary text-foreground pl-12 pr-4 py-3 outline-none transition-all placeholder:text-muted-foreground focus:shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-neon-primary font-bold">Secure Comms Channel</label>
                            <div className="relative group">
                                <Send className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-neon-primary transition-colors" />
                                <input
                                    required
                                    type="email"
                                    placeholder="hiring@company.com"
                                    className="w-full bg-background/80 border border-border focus:border-neon-primary text-foreground pl-12 pr-4 py-3 outline-none transition-all placeholder:text-muted-foreground focus:shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Budget */}
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-neon-primary font-bold">Bounty Allocation (USD)</label>
                        <div className="relative group">
                            <DollarSign className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground group-focus-within:text-neon-primary transition-colors" />
                            <select
                                className="w-full bg-background/80 border border-border focus:border-neon-primary text-foreground pl-12 pr-4 py-3 outline-none transition-all appearance-none cursor-pointer focus:shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                defaultValue=""
                            >
                                <option value="" disabled className="text-muted-foreground">Select Range</option>
                                <option value="500-1000">&lt; $1,000 (Micro-Task)</option>
                                <option value="1000-5000">$1,000 - $5,000 (Feature)</option>
                                <option value="5000-10000">$5,000 - $10,000 (Module)</option>
                                <option value="10000+">$10,000+ (Major System)</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-neon-primary font-bold">Mission Parameters</label>
                        <textarea
                            required
                            rows={6}
                            placeholder="Describe the objective, technical requirements, and acceptance criteria..."
                            className="w-full bg-background/80 border border-border focus:border-neon-primary text-foreground p-4 outline-none transition-all placeholder:text-muted-foreground resize-none focus:shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-neon-primary hover:bg-neon-secondary text-primary-foreground font-bold text-lg py-4 uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] flex items-center justify-center gap-3"
                    >
                        <Terminal className="w-5 h-5" />
                        Upload Mission Data
                    </button>
                </form>

                <p className="text-center mt-8 text-xs text-gray-600">
                    Encrypted via SSL. Agents are standing by.
                </p>
            </div>
        </main>
    );
}
