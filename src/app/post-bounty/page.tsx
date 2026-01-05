"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Terminal, Send, DollarSign, Briefcase, User, Building2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { submitBountyInquiry } from "@/features/landingpage/actions/submit-bounty-inquiry";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function PostBountyPage() {
    const router = useRouter();
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Form State
    const [submitterType, setSubmitterType] = useState<'individual' | 'company'>('individual');
    const [formData, setFormData] = useState({
        company: "",
        email: "",
        budget: "",
        title: "",
        difficulty: "intermediate",
        deadline: "",
        skills: "",
        description: "",
    });

    // Check Auth & Fetch Profile
    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                // Not logged in - redirect logic or show login state
                setIsLoading(false);
                setIsAuthenticated(false);
                return;
            }

            setIsAuthenticated(true);

            // Pre-fill email
            setFormData(prev => ({ ...prev, email: user.email || "" }));

            // Check if user is a member of any company
            const { data: member } = await supabase
                .from('company_members')
                .select('company_id')
                .eq('user_id', user.id)
                .limit(1)
                .maybeSingle();

            if (member?.company_id) {
                const { data: company } = await supabase
                    .from('companies')
                    .select('name')
                    .eq('id', member.company_id)
                    .single();

                if (company) {
                    setSubmitterType('company');
                    setFormData(prev => ({ ...prev, company: company.name, email: user.email || "" }));
                }
            }

            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated) {
            router.push("/login?next=/post-bounty");
            return;
        }

        try {
            const result = await submitBountyInquiry({
                ...formData,
                company: submitterType === 'company' ? formData.company : 'Individual', // Logic: If individual, maybe clear or set generic
                submitter_type: submitterType
            });

            if (result.data) {
                setSubmitted(true);
            } else {
                console.error("Submission failed:", result.error);
                alert("Failed to submit inquiry. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An unexpected error occurred.");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-neon-primary animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <main className="min-h-screen bg-background text-neon-primary font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden">
                <div className="scanlines fixed inset-0 pointer-events-none z-50 opacity-50" />
                <div className="max-w-md w-full border border-neon-primary/50 p-8 bg-background/80 backdrop-blur relative z-10 text-center">
                    <div className="absolute top-0 left-0 w-full h-1 bg-neon-primary shadow-[0_0_10px_var(--neon-primary)]" />
                    <Terminal className="w-16 h-16 mx-auto mb-6 text-neon-primary" />
                    <h1 className="text-2xl font-bold mb-4 tracking-wider">ACCESS DENIED</h1>
                    <p className="text-sm mb-6 text-neon-primary/80">
                        Top level security clearance required. Please verify your identity to deploy missions.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button
                            variant="outline"
                            onClick={() => router.push("/")}
                            className="border-neon-primary/50 text-neon-primary hover:bg-neon-primary/10"
                        >
                            Return Home
                        </Button>
                        <Button
                            onClick={() => router.push("/login?next=/post-bounty")}
                            className="bg-neon-primary/90 text-black hover:bg-neon-primary font-bold"
                        >
                            Login / Register
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    if (submitted) {
        return (
            <main className="min-h-screen bg-background text-neon-primary font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden">
                <div className="scanlines fixed inset-0 pointer-events-none z-50 opacity-50" />
                <div className="max-w-md w-full border border-neon-primary/50 p-8 bg-background/80 backdrop-blur relative z-10 text-center">
                    <div className="absolute top-0 left-0 w-full h-1 bg-neon-primary shadow-[0_0_10px_var(--neon-primary)]" />
                    <Terminal className="w-16 h-16 mx-auto mb-6 text-neon-primary" />
                    <h1 className="text-2xl font-bold mb-4 tracking-wider">PROTOCOL INITIATED</h1>
                    <p className="text-sm mb-6 text-neon-primary/80">
                        Transmission received. Our agents will analyze your mission parameters and assign a handler shortly.
                        <br /><br />
                        Track status in your <strong>Dashboard &gt; {submitterType === 'company' ? 'Company' : 'Personal'} &gt; Bounty Inquiries</strong>.
                    </p>
                    <button
                        onClick={() => router.push(submitterType === 'company' ? "/dashboard/company" : "/dashboard/profile")}
                        className="text-xs uppercase tracking-[0.2em] hover:text-foreground transition-colors"
                    >
                        [ Return to Dashboard ]
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

                    {/* Submitter Type Toggle */}
                    <div className="grid grid-cols-2 gap-4 p-1 bg-background/50 rounded-lg border border-border/50">
                        <button
                            type="button"
                            onClick={() => setSubmitterType('individual')}
                            className={`flex items-center justify-center gap-2 py-3 rounded-md transition-all font-bold uppercase tracking-wider text-sm ${submitterType === 'individual' ? 'bg-neon-primary text-black shadow-lg shadow-neon-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
                        >
                            <User className="w-4 h-4" />
                            Individual
                        </button>
                        <button
                            type="button"
                            onClick={() => setSubmitterType('company')}
                            className={`flex items-center justify-center gap-2 py-3 rounded-md transition-all font-bold uppercase tracking-wider text-sm ${submitterType === 'company' ? 'bg-neon-primary text-black shadow-lg shadow-neon-primary/20' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
                        >
                            <Building2 className="w-4 h-4" />
                            Company
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Company Name - Conditional */}
                        {submitterType === 'company' && (
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-neon-primary font-bold">Target Organization</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Company Name"
                                    value={formData.company}
                                    className="w-full bg-background/80 border border-border focus:border-neon-primary text-foreground px-4 py-3 outline-none transition-all placeholder:text-muted-foreground focus:shadow-[0_0_15px_rgba(34,197,94,0.1)] rounded-sm"
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                />
                            </div>
                        )}

                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-neon-primary font-bold">Mission Codename (Title)</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Protocol Omega Frontend Refactor"
                                className="w-full bg-background/80 border border-border focus:border-neon-primary text-foreground px-4 py-3 outline-none transition-all placeholder:text-muted-foreground focus:shadow-[0_0_15px_rgba(34,197,94,0.1)] font-bold text-lg rounded-sm"
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        {/* Complexity & Deadline */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-neon-primary font-bold">Complexity (Difficulty)</label>
                                <select
                                    className="w-full bg-background/80 border border-border focus:border-neon-primary text-foreground px-4 py-3 outline-none transition-all appearance-none cursor-pointer focus:shadow-[0_0_15px_rgba(34,197,94,0.1)] rounded-sm"
                                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                    defaultValue="intermediate"
                                >
                                    <option value="beginner">Beginner (Level 1)</option>
                                    <option value="intermediate">Intermediate (Level 2)</option>
                                    <option value="advanced">Advanced (Level 3)</option>
                                    <option value="expert">Expert (Level 4)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-neon-primary font-bold">Deadline (Date)</label>
                                <input
                                    type="date"
                                    className="w-full bg-background/80 border border-border focus:border-neon-primary text-foreground px-4 py-3 outline-none transition-all placeholder:text-muted-foreground focus:shadow-[0_0_15px_rgba(34,197,94,0.1)] rounded-sm [color-scheme:dark]"
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-neon-primary font-bold">Required Protocols (Skills)</label>
                            <input
                                type="text"
                                placeholder="e.g. React, Nextjs, Rust (comma separated)"
                                className="w-full bg-background/80 border border-border focus:border-neon-primary text-foreground px-4 py-3 outline-none transition-all placeholder:text-muted-foreground focus:shadow-[0_0_15px_rgba(34,197,94,0.1)] rounded-sm"
                                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                            />
                        </div>

                        {/* Budget (RM) */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-neon-primary font-bold">Bounty Allocation (MYR)</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-3.5 text-neon-primary font-bold">RM</span>
                                <input
                                    required
                                    type="number"
                                    min="0"
                                    step="100"
                                    placeholder="5000"
                                    className="w-full bg-background/80 border border-border focus:border-neon-primary text-foreground pl-12 pr-4 py-3 outline-none transition-all placeholder:text-muted-foreground focus:shadow-[0_0_15px_rgba(34,197,94,0.1)] font-mono text-lg rounded-sm"
                                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
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
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    readOnly={!!formData.email}
                                    className="w-full bg-background/80 border border-border focus:border-neon-primary text-foreground pl-12 pr-4 py-3 outline-none transition-all placeholder:text-muted-foreground focus:shadow-[0_0_15px_rgba(34,197,94,0.1)] opacity-80 cursor-not-allowed rounded-sm"
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-neon-primary font-bold">Mission Parameters</label>
                        <textarea
                            required
                            rows={6}
                            placeholder="Describe the objective, technical requirements, and acceptance criteria..."
                            className="w-full bg-background/80 border border-border focus:border-neon-primary text-foreground p-4 outline-none transition-all placeholder:text-muted-foreground resize-none focus:shadow-[0_0_15px_rgba(34,197,94,0.1)] rounded-sm"
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-neon-primary hover:bg-neon-secondary text-primary-foreground font-bold text-lg py-4 uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] flex items-center justify-center gap-3 rounded-sm"
                    >
                        <Terminal className="w-5 h-5" />
                        Upload Mission Data
                        {submitterType === 'company' && <span className="text-xs opacity-70 normal-case ml-1">(as Company)</span>}
                    </button>
                </form>

                <p className="text-center mt-8 text-xs text-gray-600">
                    Encrypted via SSL. Agents are standing by.
                </p>
            </div>
        </main>
    );
}
