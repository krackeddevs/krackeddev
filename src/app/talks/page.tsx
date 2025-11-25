'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PageHero from '@/components/PageHero';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Mic2, Calendar, Radio } from 'lucide-react';

export default function TalksPage() {
  const speakers = [
    {
      date: "Oct 12",
      name: "Sarah Jenkins",
      role: 'Senior Engineer',
      desc: "Engineering maths into profit. How I used simple calculus to optimize logistics for a Grab competitor.",
      color: "neon-accent"
    },
    {
      date: "Oct 26",
      name: "Ahmad Razak",
      role: 'Tech Lead',
      desc: "Automation is not just scripts. Building enterprise workflows with zero-code and low-code solutions.",
      color: "neon-primary"
    },
    {
      date: "Nov 15",
      name: "Jessica Lee",
      role: 'Founder',
      desc: 'The "Vibe Code" philosophy. Selling the feeling, not just the functionality.',
      color: "neon-secondary"
    },
  ];

  return (
    <main className="min-h-screen pb-20 overflow-hidden">
      <PageHero 
        title="Kracked Talks" 
        subtitle="Hear from key figures in the industry."
      />

      <div className="container mx-auto px-4 py-10 relative z-10">
        {/* Value Prop Section */}
        <Card className="mb-16 border-white/10 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-md overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,143,17,0.15)_0%,transparent_70%)] pointer-events-none" />
          <CardContent className="text-center pt-12 pb-12 relative z-10">
             <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">Vibe Code & Value</h2>
               <p className="text-xl opacity-80 max-w-2xl mx-auto mb-8 font-light text-blue-100">How non-coders can produce value with code.</p>
               <div className="flex flex-wrap justify-center gap-4 mt-6">
                  <Badge variant="outline" className="text-lg py-2 px-4 border-neon-primary text-neon-primary shadow-[0_0_10px_rgba(0,255,65,0.2)] hover:bg-neon-primary/10 transition-colors">Math & Engineering</Badge>
                  <Badge variant="outline" className="text-lg py-2 px-4 border-neon-accent text-neon-accent shadow-[0_0_10px_rgba(240,240,240,0.2)] hover:bg-neon-accent/10 transition-colors">Automation</Badge>
                  <Badge variant="outline" className="text-lg py-2 px-4 border-neon-secondary text-neon-secondary shadow-[0_0_10px_rgba(0,143,17,0.2)] hover:bg-neon-secondary/10 transition-colors">Business Value</Badge>
               </div>
               <div className="mt-10">
                 <Button size="lg" variant="cyberpunk" asChild className="h-14 px-8 text-lg">
                   <Link href="/signup/talks">Sign Up for Community Talks</Link>
                 </Button>
               </div>
            </CardContent>
        </Card>

        {/* Speakers List */}
        <h3 className="text-3xl font-bold mb-12 text-center font-mono uppercase tracking-widest text-white/80 flex items-center justify-center gap-3">
          <Radio className="w-6 h-6 text-red-500 animate-pulse" />
          Featured Speakers
        </h3>
        
        <div className="flex flex-col gap-12 max-w-4xl mx-auto relative">
           {/* Vertical Line */}
           <div className="absolute left-[19px] md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
           
           {speakers.map((speaker, index) => (
             <motion.div 
               key={index} 
               className="relative flex flex-col md:flex-row gap-6 md:pl-24 pl-12"
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.4, delay: index * 0.1 }}
             >
               {/* Dot */}
               <div className={`absolute left-[15px] md:left-[27px] top-8 h-2 w-2 rounded-full bg-${speaker.color === 'neon-accent' ? 'neon-accent' : speaker.color === 'neon-primary' ? 'neon-primary' : 'neon-secondary'} shadow-[0_0_10px_var(--${speaker.color})] ring-4 ring-black`} />
               
               <div className="md:w-32 flex-shrink-0 pt-1 md:text-right">
                  <div className={`font-mono font-bold text-lg text-${speaker.color === 'neon-accent' ? 'neon-accent' : speaker.color === 'neon-primary' ? 'neon-primary' : 'neon-secondary'} flex items-center md:justify-end gap-2`}>
                    <Calendar className="w-4 h-4 md:hidden" />
                    {speaker.date}
                  </div>
               </div>
               
               <Card className="flex-grow group hover:bg-white/5 transition-all duration-300 border-white/5 hover:border-white/20">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                       <div>
                          <CardTitle className="text-2xl flex items-center gap-2">
                            {speaker.name}
                            <Mic2 className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                          </CardTitle>
                          <div className="text-sm font-semibold text-white/60 mt-1 uppercase tracking-wider">{speaker.role}</div>
                       </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-muted-foreground group-hover:text-white/90 transition-colors leading-relaxed">
                      {speaker.desc}
                    </p>
                  </CardContent>
               </Card>
             </motion.div>
           ))}
        </div>
      </div>
    </main>
  );
}
