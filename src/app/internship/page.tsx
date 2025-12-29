import { Metadata } from "next";
import {
    ArrowLeft,
    Briefcase,
    Code,
    Video,
    MessageCircle,
    CheckCircle,
    Gift,
    Target,
    Clock,
    Send,
    Instagram,
    Twitter,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Internship Program | Kracked Devs",
    description:
        "Join KrackedDevs as a Developer Intern. Code, create content, and grow with our kracked developer community. RM1,000/month stipend.",
};

export default function InternshipPage() {
    return (
        <main className="min-h-screen">
            <div className="scanlines fixed inset-0 pointer-events-none z-50"></div>
            <div className="relative z-10">
                {/* Header */}
                <div className="bg-gray-800/50 border-b border-gray-700">
                    <div className="container mx-auto px-4 py-6 max-w-5xl">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-mono text-sm mb-6"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>

                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-neon-primary/20 border-2 border-neon-primary flex items-center justify-center">
                                <Briefcase className="w-7 h-7 text-neon-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold font-mono text-white">
                                    INTERNSHIP PROGRAM
                                </h1>
                                <p className="text-gray-400 font-mono text-sm">
                                    We&apos;re Hiring 5 Developer Interns
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8 max-w-5xl space-y-12">
                    {/* Position Details */}
                    <section className="bg-gray-800/30 border border-gray-700 p-6 md:p-8">
                        <h2 className="text-xl font-bold font-mono text-neon-primary mb-6 flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            POSITION DETAILS
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-900/50 border border-gray-700 p-4 text-center">
                                <p className="text-gray-400 text-xs font-mono mb-1">ROLE</p>
                                <p className="text-white font-mono text-sm">
                                    Developer Intern
                                </p>
                                <p className="text-gray-400 text-xs font-mono">
                                    (Coding + Content)
                                </p>
                            </div>
                            <div className="bg-gray-900/50 border border-gray-700 p-4 text-center">
                                <p className="text-gray-400 text-xs font-mono mb-1">POSITIONS</p>
                                <p className="text-neon-primary font-mono text-2xl font-bold">
                                    5
                                </p>
                            </div>
                            <div className="bg-gray-900/50 border border-gray-700 p-4 text-center">
                                <p className="text-gray-400 text-xs font-mono mb-1">STIPEND</p>
                                <p className="text-emerald-400 font-mono text-lg font-bold">
                                    RM1,000
                                </p>
                                <p className="text-gray-400 text-xs font-mono">/month</p>
                            </div>
                            <div className="bg-gray-900/50 border border-gray-700 p-4 text-center">
                                <p className="text-gray-400 text-xs font-mono mb-1">LOCATION</p>
                                <p className="text-white font-mono text-sm">Remote</p>
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <p className="text-gray-400 font-mono text-sm">
                                <span className="text-amber-500">Duration:</span> Immediate –
                                Ongoing |{" "}
                                <span className="text-amber-500">Launch:</span> January 1, 2026
                            </p>
                        </div>
                    </section>

                    {/* About */}
                    <section className="bg-gray-800/30 border border-gray-700 p-6 md:p-8">
                        <h2 className="text-xl font-bold font-mono text-neon-primary mb-4">
                            ABOUT THIS OPPORTUNITY
                        </h2>
                        <p className="text-gray-300 font-mono leading-relaxed">
                            KrackedDevs launches Jan 1, 2026. We need 5 hungry interns who
                            code and build in public. Whether you&apos;re a student or
                            passionate vibecoder—if you want to ship real projects and grow
                            with a kracked developer community, this is your moment.
                        </p>
                    </section>

                    {/* Core Responsibilities */}
                    <section className="space-y-6">
                        <h2 className="text-xl font-bold font-mono text-neon-primary flex items-center gap-2">
                            YOUR 3 CORE RESPONSIBILITIES
                        </h2>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Code & Ship */}
                            <div className="bg-gray-800/30 border border-gray-700 p-6 hover:border-neon-primary/50 transition-colors">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-blue-500/20 border border-blue-500 flex items-center justify-center">
                                        <Code className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-mono font-bold text-white">
                                            CODE & SHIP
                                        </h3>
                                        <p className="text-gray-400 text-xs font-mono">
                                            4-6 hours/day
                                        </p>
                                    </div>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-300 font-mono">
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500 mt-1">→</span>
                                        Work on assigned projects or self-directed challenges
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500 mt-1">→</span>
                                        Push to GitHub daily (even small commits count)
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500 mt-1">→</span>
                                        Ship at least 1 feature/fix per week
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500 mt-1">→</span>
                                        Participate in code reviews
                                    </li>
                                </ul>
                            </div>

                            {/* Create Content */}
                            <div className="bg-gray-800/30 border border-gray-700 p-6 hover:border-neon-primary/50 transition-colors">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-purple-500/20 border border-purple-500 flex items-center justify-center">
                                        <Video className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-mono font-bold text-white">
                                            CREATE CONTENT
                                        </h3>
                                        <p className="text-gray-400 text-xs font-mono">
                                            1-2 hours/day
                                        </p>
                                    </div>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-300 font-mono">
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-500 mt-1">→</span>
                                        Film 10-15 min of your coding session daily
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-500 mt-1">→</span>
                                        Post to TikTok, Instagram, Twitter/X, Threads, LinkedIn
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-500 mt-1">→</span>
                                        Tag @krackeddevs in EVERY post
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-500 mt-1">→</span>
                                        Write authentic captions about your grind
                                    </li>
                                </ul>
                            </div>

                            {/* Engage & Report */}
                            <div className="bg-gray-800/30 border border-gray-700 p-6 hover:border-neon-primary/50 transition-colors">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-amber-500/20 border border-amber-500 flex items-center justify-center">
                                        <MessageCircle className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-mono font-bold text-white">
                                            ENGAGE & REPORT
                                        </h3>
                                        <p className="text-gray-400 text-xs font-mono">
                                            30 min/day + weekly
                                        </p>
                                    </div>
                                </div>
                                <ul className="space-y-2 text-sm text-gray-300 font-mono">
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-500 mt-1">→</span>
                                        Reply to comments on your posts
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-500 mt-1">→</span>
                                        Engage with other interns&apos; content
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-500 mt-1">→</span>
                                        Weekly syncs (2 hours/week)
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-500 mt-1">→</span>
                                        Submit weekly progress report + social metrics
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Critical Requirements */}
                    <section className="bg-red-950/20 border border-red-900/50 p-6 md:p-8">
                        <h2 className="text-xl font-bold font-mono text-red-400 mb-4">
                            ⚠️ CRITICAL REQUIREMENTS
                        </h2>
                        <div className="grid md:grid-cols-2 gap-3">
                            {[
                                "@krackeddevs must be in your bio on ALL platforms",
                                "Post daily (minimum 5-6 days/week)",
                                "Tag @krackeddevs in every post",
                                "Keep content authentic (real grind, real growth)",
                                "Consistent daily activity—this is non-negotiable",
                            ].map((req, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 text-gray-300 font-mono text-sm"
                                >
                                    <CheckCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                    {req}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* What You Get */}
                    <section className="bg-gray-800/30 border border-gray-700 p-6 md:p-8">
                        <h2 className="text-xl font-bold font-mono text-neon-primary mb-4 flex items-center gap-2">
                            <Gift className="w-5 h-5" />
                            WHAT YOU GET
                        </h2>
                        <div className="grid md:grid-cols-2 gap-3">
                            {[
                                "RM1,000/month stipend",
                                "Shipped projects for your portfolio",
                                "Content creation + branding skills",
                                "Early access to KrackedDevs community",
                                "First dibs on opportunities post-launch",
                                "Network with hungry developers",
                            ].map((benefit, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 text-gray-300 font-mono text-sm"
                                >
                                    <CheckCircle className="w-4 h-4 text-neon-primary flex-shrink-0" />
                                    {benefit}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Who We Want */}
                    <section className="bg-gray-800/30 border border-gray-700 p-6 md:p-8">
                        <h2 className="text-xl font-bold font-mono text-neon-primary mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            WHO WE WANT
                        </h2>
                        <div className="grid md:grid-cols-2 gap-3">
                            {[
                                "Laptop/PC with dev environment",
                                "Basic coding skills (any stack—we care about hunger)",
                                "Active on social media (or willing to be)",
                                "Self-motivated and ready to grind daily",
                                "Student? Self-taught? Recent grad? All welcome",
                                "Vibe: Excited, consistent, authentic",
                            ].map((trait, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 text-gray-300 font-mono text-sm"
                                >
                                    <span className="text-neon-primary">✓</span>
                                    {trait}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Application Process */}
                    <section className="space-y-6">
                        <h2 className="text-xl font-bold font-mono text-neon-primary flex items-center gap-2">
                            <Send className="w-5 h-5" />
                            THE APPLICATION PROCESS
                        </h2>

                        {/* Step 1 */}
                        <div className="bg-gray-800/30 border border-gray-700 p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-8 h-8 bg-neon-primary text-black font-mono font-bold flex items-center justify-center">
                                    1
                                </span>
                                <h3 className="text-lg font-mono font-bold text-white">
                                    LIGHTWEIGHT SKILL TEST
                                </h3>
                            </div>
                            <p className="text-gray-400 font-mono text-sm mb-4">
                                Build ONE small project to show us you can execute:
                            </p>

                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                                <div className="bg-gray-900/50 border border-gray-600 p-4">
                                    <p className="text-emerald-400 font-mono font-bold text-sm mb-1">
                                        OPTION A: Simple Tool
                                    </p>
                                    <p className="text-gray-400 font-mono text-xs mb-2">
                                        2-6 hours
                                    </p>
                                    <p className="text-gray-300 font-mono text-xs">
                                        Todo, weather app, calculator, habit tracker—anything
                                        functional
                                    </p>
                                </div>
                                <div className="bg-gray-900/50 border border-gray-600 p-4">
                                    <p className="text-emerald-400 font-mono font-bold text-sm mb-1">
                                        OPTION B: Open Source
                                    </p>
                                    <p className="text-gray-400 font-mono text-xs mb-2">
                                        2-8 hours
                                    </p>
                                    <p className="text-gray-300 font-mono text-xs">
                                        Find a project, make a meaningful contribution, submit a PR
                                    </p>
                                </div>
                                <div className="bg-gray-900/50 border border-gray-600 p-4">
                                    <p className="text-emerald-400 font-mono font-bold text-sm mb-1">
                                        OPTION C: Game / Interactive
                                    </p>
                                    <p className="text-gray-400 font-mono text-xs mb-2">
                                        3-8 hours
                                    </p>
                                    <p className="text-gray-300 font-mono text-xs">
                                        Snake, Pong, memory game, or creative coding project
                                    </p>
                                </div>
                            </div>

                            <p className="text-gray-400 font-mono text-sm">
                                <span className="text-white">Submit:</span> GitHub link + 1-2
                                sentence explanation
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-gray-800/30 border border-gray-700 p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-8 h-8 bg-neon-primary text-black font-mono font-bold flex items-center justify-center">
                                    2
                                </span>
                                <h3 className="text-lg font-mono font-bold text-white">
                                    SUBMIT YOUR APPLICATION
                                </h3>
                            </div>
                            <p className="text-gray-400 font-mono text-sm mb-4">
                                DM us with:
                            </p>
                            <ol className="space-y-2 text-gray-300 font-mono text-sm list-decimal list-inside">
                                <li>
                                    Social media handles (TikTok, Instagram, Twitter/X, LinkedIn)
                                </li>
                                <li>
                                    Screenshot proof of @krackeddevs in your bio (all platforms)
                                </li>
                                <li>
                                    Short intro: Why you want to be a KrackedDev (2-3 sentences)
                                </li>
                                <li>Your skill test submission (GitHub link + explanation)</li>
                                <li>Links to your recent posts (showing consistency)</li>
                            </ol>
                            <p className="text-gray-400 font-mono text-xs mt-4 italic">
                                No perfect portfolio needed. We want hungry, consistent
                                builders.
                            </p>
                        </div>
                    </section>

                    {/* How We Choose */}
                    <section className="bg-gray-800/30 border border-gray-700 p-6 md:p-8">
                        <h2 className="text-xl font-bold font-mono text-neon-primary mb-4">
                            HOW WE&apos;LL CHOOSE YOU
                        </h2>
                        <div className="grid md:grid-cols-3 gap-4 text-center">
                            <div className="p-4">
                                <p className="text-2xl mb-2">💻</p>
                                <p className="text-white font-mono font-bold">CAN YOU CODE?</p>
                                <p className="text-gray-400 font-mono text-xs">
                                    Your skill test proves this
                                </p>
                            </div>
                            <div className="p-4">
                                <p className="text-2xl mb-2">📅</p>
                                <p className="text-white font-mono font-bold">
                                    ARE YOU CONSISTENT?
                                </p>
                                <p className="text-gray-400 font-mono text-xs">
                                    Your social media shows this
                                </p>
                            </div>
                            <div className="p-4">
                                <p className="text-2xl mb-2">⚡</p>
                                <p className="text-white font-mono font-bold">
                                    DO YOU HAVE THE VIBE?
                                </p>
                                <p className="text-gray-400 font-mono text-xs">
                                    Your energy shows this
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Timeline */}
                    <section className="bg-gray-800/30 border border-gray-700 p-6 md:p-8">
                        <h2 className="text-xl font-bold font-mono text-neon-primary mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            TIMELINE
                        </h2>
                        <div className="space-y-3 font-mono text-sm">
                            <div className="flex items-center gap-4">
                                <span className="text-amber-500 w-36">Now – Dec 31, 2025</span>
                                <span className="text-gray-300">
                                    Recruiting + onboarding
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-emerald-400 w-36 font-bold">
                                    Jan 1, 2026
                                </span>
                                <span className="text-white font-bold">
                                    Official KrackedDevs Launch 🚀
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-gray-400 w-36">Ongoing</span>
                                <span className="text-gray-400">
                                    Your content & projects fuel our growth
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Contact */}
                    <section className="bg-neon-primary/10 border border-neon-primary p-6 md:p-8 text-center">
                        <h2 className="text-xl font-bold font-mono text-white mb-4">
                            QUESTIONS? FIND US ON:
                        </h2>
                        <div className="flex flex-wrap justify-center gap-4 mb-6">
                            <a
                                href="https://instagram.com/kddevs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-gray-900 border border-gray-700 px-4 py-2 font-mono text-sm text-gray-300 hover:text-white hover:border-neon-primary transition-colors"
                            >
                                <Instagram className="w-4 h-4" />
                                @kddevs
                            </a>
                            <a
                                href="https://twitter.com/krackeddevs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-gray-900 border border-gray-700 px-4 py-2 font-mono text-sm text-gray-300 hover:text-white hover:border-neon-primary transition-colors"
                            >
                                <Twitter className="w-4 h-4" />
                                @krackeddevs
                            </a>
                            <a
                                href="https://threads.net/@kddevs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-gray-900 border border-gray-700 px-4 py-2 font-mono text-sm text-gray-300 hover:text-white hover:border-neon-primary transition-colors"
                            >
                                @kddevs (Threads)
                            </a>
                        </div>
                        <p className="text-emerald-400 font-mono font-bold text-lg">
                            LET&apos;S GET KRACKED. BUILD IN PUBLIC. SHIP PROJECTS. GROW
                            TOGETHER.
                        </p>
                        <p className="text-gray-400 font-mono text-sm mt-2">
                            KrackedDevs – Official Launch January 1, 2026
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
