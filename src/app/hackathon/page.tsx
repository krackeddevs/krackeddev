'use client';

import React, { useState } from 'react';
import PageHero from '@/components/PageHero';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Trophy, Bug, Star, Code2 } from 'lucide-react';

export default function HackathonPage() {
  const [isScopeOpen, setIsScopeOpen] = useState(false);

  return (
    <main className="min-h-screen pb-20 overflow-hidden">
      <PageHero 
        title="Kracked Hackathon" 
        subtitle="Go crazy. Win AI credits."
      >
        <div className="relative inline-flex items-center justify-center text-lg py-3 px-8 rounded-none border border-neon-primary text-neon-primary bg-neon-primary/5 shadow-[0_0_20px_rgba(0,255,65,0.3)] animate-pulse hover:bg-neon-primary/10 hover:shadow-[0_0_30px_rgba(0,255,65,0.5)] transition-all cursor-default font-mono uppercase tracking-widest group">
          <span className="mr-2 animate-spin-slow"><Trophy className="w-5 h-5" /></span>
          Grand Prize: RM 1,200 in AI Credits
          <div className="absolute top-0 right-0 w-2 h-2 bg-neon-primary shadow-[0_0_5px_var(--neon-primary)]" />
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-neon-primary shadow-[0_0_5px_var(--neon-primary)]" />
        </div>
      </PageHero>

      <div className="container mx-auto px-4 relative z-10">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="border-neon-accent/30 bg-black/60 hover:border-neon-accent/50 group">
            <CardHeader>
               <CardTitle className="text-neon-accent flex items-center gap-2">
                 <Bug className="w-5 h-5" />
                 Bug Bounty Integrated
               </CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-muted-foreground group-hover:text-foreground transition-colors">First winner gets sponsored credits. Increase likelihood of getting hired.</p>
            </CardContent>
            <CardFooter className="justify-end">
               <Button variant="cyberpunk" size="sm" onClick={() => setIsScopeOpen(true)} className="border-neon-accent text-neon-accent hover:bg-neon-accent/10 hover:shadow-[0_0_15px_var(--neon-accent)]">View Scope</Button>
            </CardFooter>
          </Card>

          <Card className="border-neon-secondary/30 bg-black/60 hover:border-neon-secondary/50 group">
            <CardHeader>
               <CardTitle className="text-neon-secondary flex items-center gap-2">
                 <Star className="w-5 h-5" />
                 Point System
               </CardTitle>
            </CardHeader>
            <CardContent>
               <p className="mb-6 text-muted-foreground group-hover:text-foreground transition-colors">Earn points for submissions, bug reports, and community help. Top 10 get interviewed automatically.</p>
               <div className="flex gap-3 flex-wrap font-mono text-xs">
                  <Badge variant="outline" className="border-neon-accent text-neon-accent shadow-[0_0_5px_rgba(240,240,240,0.2)]">+10 Bug</Badge>
                  <Badge variant="outline" className="border-neon-primary text-neon-primary shadow-[0_0_5px_rgba(0,255,65,0.2)]">+50 Feature</Badge>
                  <Badge variant="outline" className="border-neon-secondary text-neon-secondary shadow-[0_0_5px_rgba(0,143,17,0.2)]">+5 Help</Badge>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard */}
        <Card className="border-white/10 bg-black/80 backdrop-blur-xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-primary via-neon-secondary to-neon-accent" />
          <CardHeader>
            <CardTitle className="text-center text-2xl font-mono uppercase tracking-widest flex items-center justify-center gap-3">
              <Code2 className="w-6 h-6 text-neon-primary" />
              Leaderboard
              <Code2 className="w-6 h-6 text-neon-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="border-b border-white/10 hover:bg-white/5">
                    <TableHead className="w-[100px] text-neon-primary font-mono">Rank</TableHead>
                    <TableHead className="text-neon-primary font-mono">Name</TableHead>
                    <TableHead className="text-neon-primary font-mono">Project</TableHead>
                    <TableHead className="text-neon-primary font-mono">Focus</TableHead>
                    <TableHead className="text-right text-neon-primary font-mono">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { rank: 1, name: "Ali Z.", project: "Auto-Receipt AI", focus: "Automation", points: "1,250" },
                    { rank: 2, name: "Sarah M.", project: "VibeMatch", focus: "Social", points: "980" },
                    { rank: 3, name: "Ken T.", project: "CryptoTracker MY", focus: "Finance", points: "850" },
                    { rank: 4, name: "Mei Ling", project: "Pasar Malam Maps", focus: "Geo", points: "720" },
                    { rank: 5, name: "Rajiv K.", project: "Math Solver Bot", focus: "Education", points: "690" },
                  ].map((row) => (
                    <TableRow key={row.rank} className="border-b border-white/5 hover:bg-white/5 transition-colors font-mono text-sm">
                      <TableCell className="font-bold text-neon-secondary">#{row.rank}</TableCell>
                      <TableCell className="font-bold text-foreground">{row.name}</TableCell>
                      <TableCell className="text-muted-foreground">{row.project}</TableCell>
                      <TableCell className="text-muted-foreground"><Badge variant="secondary" className="bg-white/5 text-xs hover:bg-white/10">{row.focus}</Badge></TableCell>
                      <TableCell className="text-right font-bold text-neon-accent">{row.points}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bug Bounty Scope Dialog */}
      <Dialog open={isScopeOpen} onOpenChange={setIsScopeOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-[#050505] border-neon-accent/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-mono text-neon-accent uppercase tracking-tight">Target: Web Dev & Design Feedback</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Find web development issues, design improvements, and business opportunities. All submissions are reviewed by our team.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4 font-mono text-sm">
            {/* Rewards Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-white border-b border-white/10 pb-1">Rewards & Payouts</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-none border-l-2 border-red-500">
                  <span className="font-medium text-white">Critical / Major</span>
                  <span className="text-red-400 font-bold">RM 500 - RM 1,200</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-none border-l-2 border-neon-secondary">
                  <span className="font-medium text-white">High Impact</span>
                  <span className="text-neon-secondary font-bold">RM 200 - RM 500</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-none border-l-2 border-neon-primary">
                  <span className="font-medium text-white">Medium Impact</span>
                  <span className="text-neon-primary font-bold">RM 50 - RM 200</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-none border-l-2 border-white/50">
                  <span className="font-medium text-white">Low Impact</span>
                  <span className="text-muted-foreground font-bold">RM 10 - RM 50</span>
                </div>
              </div>
            </div>

            {/* Scope Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-white border-b border-white/10 pb-1">In Scope</h3>
              <ul className="space-y-2 list-none text-muted-foreground pl-4 border-l border-neon-primary/20">
                <li>+ Web application (kracked-dev.com and subdomains)</li>
                <li>+ Frontend bugs and functionality issues</li>
                <li>+ Performance optimization opportunities</li>
                <li>+ Responsive design and mobile compatibility issues</li>
                <li>+ Accessibility (a11y) improvements</li>
                <li>+ User experience (UX) and user interface (UI) problems</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                <strong>System Note:</strong> Rewards are paid in AI credits or cash equivalent. Verification required.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
