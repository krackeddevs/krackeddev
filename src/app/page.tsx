'use client';

import React from 'react';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import InfoPanel from '@/components/InfoPanel';
import StatCard from '@/components/StatCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { ArrowRight, Terminal, CheckCircle2, XCircle } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen pb-20 overflow-hidden">
      {/* Hero Section */}
      <PageHero 
        title="Want to be a Kracked Dev?" 
        subtitle="A community of cracked developers who want to level up together."
      >
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 pt-6 w-full">
          <Button size="lg" variant="cyberpunk" asChild className="h-12 md:h-14 text-sm md:text-base px-6 md:px-8 w-full sm:w-auto">
            <Link href="https://x.com/i/communities/1983062242292822298" target="_blank" rel="noopener noreferrer">
              Join Community <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="lg" asChild className="h-12 md:h-14 text-sm md:text-base px-6 md:px-8 border border-white/10 hover:bg-white/5 w-full sm:w-auto">
            <Link href="https://x.com/i/communities/1983062242292822298" target="_blank" rel="noopener noreferrer">Explore Bootcamps</Link>
          </Button>
        </div>
      </PageHero>

      {/* Bootcamp Section */}
      <div className="container mx-auto px-4 mt-0 md:mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Program Info */}
          <InfoPanel title="Vibe Code Bootcamp">
            <p className="text-base md:text-lg mb-6 text-muted-foreground leading-relaxed">Turn random vibes into real output in 28 days. No CS degree, just cracked execution.</p>
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center gap-3 group">
                 <div className="h-2 w-2 rounded-full bg-neon-primary shadow-[0_0_10px_var(--neon-primary)] group-hover:scale-150 transition-transform" />
                 <span className="text-sm md:text-base text-foreground group-hover:text-neon-primary transition-colors">Real-world projects</span>
              </div>
              <div className="flex items-center gap-3 group">
                 <div className="h-2 w-2 rounded-full bg-neon-secondary shadow-[0_0_10px_var(--neon-secondary)] group-hover:scale-150 transition-transform" />
                 <span className="text-sm md:text-base text-foreground group-hover:text-neon-secondary transition-colors">Mentorship from industry leaders</span>
              </div>
              <div className="flex items-center gap-3 group">
                 <div className="h-2 w-2 rounded-full bg-neon-accent shadow-[0_0_10px_var(--neon-accent)] group-hover:scale-150 transition-transform" />
                 <span className="text-sm md:text-base text-foreground group-hover:text-neon-accent transition-colors">Earn "Cracked Dev" status</span>
              </div>
            </div>
            <div className="mt-auto">
              <Link href="https://x.com/i/communities/1983062242292822298" target="_blank" rel="noopener noreferrer">
                <Badge className="text-base md:text-lg py-2 px-4 md:px-6 cursor-pointer bg-gradient-to-r from-neon-secondary to-neon-primary hover:opacity-90 transition-opacity border-0 shadow-[0_0_15px_rgba(0,255,65,0.4)] text-black font-bold w-full justify-center sm:w-auto">
                  RM 999 / 28 days
                </Badge>
              </Link>
            </div>
          </InfoPanel>

          {/* Before/After Vibe Check */}
          <div className="flex flex-col gap-6">
             {/* Before Card - Glitch/Error Vibe */}
             <Card className="border-red-500/30 bg-red-950/10 backdrop-blur-sm hover:border-red-500/50 transition-colors group">
                <CardHeader className="pb-2">
                  <CardTitle className="text-red-500 flex items-center gap-2 text-lg">
                    <XCircle className="w-5 h-5" />
                    <span className="font-mono tracking-tighter">SYSTEM_STATUS: OFFLINE</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="opacity-70 mb-4 text-sm font-mono">Struggling with tutorials. No real projects. 0 income.</p>
                  <div className="rounded border border-red-500/20 bg-black/40 p-4 font-mono text-xs text-red-400 group-hover:animate-pulse overflow-x-auto">
                    <pre className="opacity-70">Error: Skills not found</pre>
                    <pre className="opacity-70">Warning: Bank account empty</pre>
                    <pre>{`const skills = [];`}</pre>
                    <pre>{`const income = 0;`}</pre>
                  </div>
                </CardContent>
             </Card>

             {/* After Card - Success/Online Vibe */}
             <Card className="border-neon-primary/30 bg-black/60 backdrop-blur-sm hover:border-neon-primary/50 transition-colors relative overflow-hidden group">
                <div className="absolute inset-0 bg-neon-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-neon-primary flex items-center gap-2 text-lg">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-mono tracking-tighter">SYSTEM_STATUS: ONLINE</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="opacity-90 mb-4 text-sm font-mono">Shipping apps. Solving problems. Getting paid.</p>
                  <div className="rounded border border-neon-primary/20 bg-black/40 p-4 font-mono text-xs text-neon-primary shadow-[0_0_10px_rgba(0,255,65,0.05)] overflow-x-auto">
                    <pre className="text-neon-primary">Success: Deployment complete</pre>
                    <pre>{`const skills = ['Fullstack', 'AI', 'Auto'];`}</pre>
                    <pre>{`const income = 5000; // MYR`}</pre>
                  </div>
                </CardContent>
             </Card>
          </div>
        </div>

        {/* Stats/Proof */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
           <StatCard 
             label="Operatives" 
             value="500+" 
             desc="Active cracked devs" 
             icon={<Terminal className="w-4 h-4" />}
             index={0}
           />
           <StatCard 
             label="Deployments" 
             value="120+" 
             desc="Shipped to production" 
             icon={<ArrowRight className="w-4 h-4 -rotate-45" />}
             index={1}
           />
           <StatCard 
             label="Total Bounty" 
             value="RM 50k+" 
             desc="Community total this month" 
             icon={<span className="text-neon-primary">$</span>}
             index={2}
           />
        </div>
      </div>
    </main>
  );
}
