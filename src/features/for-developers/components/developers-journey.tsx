"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, User, Code, ArrowRight } from "lucide-react";
import { useSupabase } from "@/context/SupabaseContext";
import { useRouter } from "next/navigation";

const steps = [
    {
        icon: UserPlus,
        step: "Step 1",
        title: "Join Beta",
        description: "Sign up for free. Takes 2 minutes.",
        color: "neon-primary"
    },
    {
        icon: User,
        step: "Step 2",
        title: "Create Your Profile",
        description: "Tell us about yourself. Link your GitHub. Join our Discord.",
        color: "neon-cyan"
    },
    {
        icon: Code,
        step: "Step 3",
        title: "Start Building",
        description: "Browse bounties. Ask questions. Win projects. Build your portfolio.",
        color: "neon-secondary"
    }
];

export function DevelopersJourney() {
    const { isAuthenticated, openLoginModal, profile } = useSupabase();
    const router = useRouter();
    const [userCount, setUserCount] = useState<number | null>(null);

    useEffect(() => {
        fetch('/api/stats/user-count')
            .then(res => res.json())
            .then(data => setUserCount(data.count))
            .catch(err => console.error('Error fetching user count:', err));
    }, []);

    const displayCount = userCount ? `${userCount}+` : '400+';

    const handleJoinClick = () => {
        if (isAuthenticated) {
            if (profile?.onboarding_completed) {
                router.push("/dashboard");
            } else {
                router.push("/onboarding/form");
            }
        } else {
            openLoginModal(true);
        }
    };

    return (
        <section className="py-24 bg-muted/30 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />

            <div className="container px-4 mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-sm font-mono text-neon-primary tracking-widest uppercase mb-4">Get Started</h2>
                    <h3 className="text-3xl md:text-5xl font-bold font-mono text-foreground mb-6 uppercase">
                        Your Journey Starts <br />
                        <span className="text-neon-primary">In 3 Simple Steps</span>
                    </h3>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full bg-card/40 backdrop-blur-md border-border hover:border-neon-primary/50 transition-all duration-300 relative">
                                <CardContent className="p-6 text-center">
                                    <div className={`p-4 rounded-xl bg-${step.color}/10 border border-${step.color}/30 w-fit mx-auto mb-4`}>
                                        <step.icon className={`w-8 h-8 text-${step.color}`} />
                                    </div>
                                    <div className="text-xs font-mono text-neon-primary mb-2 uppercase tracking-wider">
                                        {step.step}
                                    </div>
                                    <h4 className="text-xl font-bold font-mono text-foreground mb-3 uppercase">
                                        {step.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {step.description}
                                    </p>
                                </CardContent>
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                                        <ArrowRight className="w-8 h-8 text-neon-primary/30" />
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-center max-w-3xl mx-auto"
                >
                    <div className="bg-gradient-to-r from-neon-primary/10 via-transparent to-neon-primary/10 border border-neon-primary/30 rounded-xl p-8">
                        <h4 className="text-2xl font-bold font-mono text-foreground mb-4 uppercase">
                            {isAuthenticated && profile?.onboarding_completed
                                ? "Welcome Back, Developer"
                                : `Join ${displayCount} Developers Today`}
                        </h4>
                        <p className="text-lg text-muted-foreground mb-6">
                            Your next opportunity is waiting. The community is ready. <br />
                            All you have to do is show up.
                        </p>
                        <Button
                            size="lg"
                            className="bg-neon-primary text-primary-foreground hover:bg-neon-primary/90 font-bold text-lg px-8 py-6 h-auto shadow-[0_0_20px_rgba(0,255,65,0.5)] hover:shadow-[0_0_30px_rgba(0,255,65,0.7)] transition-all duration-300"
                            onClick={handleJoinClick}
                        >
                            {isAuthenticated && profile?.onboarding_completed
                                ? "Enter Dashboard"
                                : "Join Beta Now"}
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        <p className="text-sm text-muted-foreground mt-6 font-mono">
                            Questions? Drop by our <a href="https://discord.gg/krackeddevs" className="text-neon-primary hover:underline">Discord</a> or email <a href="mailto:hello@krackeddevs.com" className="text-neon-primary hover:underline">hello@krackeddevs.com</a>
                        </p>
                        <p className="text-xs text-muted-foreground mt-4 font-mono uppercase tracking-wider">
                            Kracked Devs - Build. Learn. Earn. Together.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
