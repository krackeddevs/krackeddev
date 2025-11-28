'use client';

import React, { useState, useMemo } from 'react';
import PageHero from '@/components/PageHero';
import { JobBoardProvider, useJobBoard } from '@/app/context/JobBoardContext';
import { UserStats } from '@/app/components/UserStats';
import { Leaderboard } from '@/app/components/Leaderboard';
import { JobCard, Job } from '@/app/components/JobCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, X, Trophy, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior Full Stack Developer',
    company: 'TechCorp',
    location: 'Kuala Lumpur, Malaysia',
    type: 'Full-time',
    salary: 'RM 8,000 - RM 12,000',
    techStack: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
    description: 'Join our team to build cutting-edge web applications using modern technologies. We are looking for an experienced developer who loves solving complex problems.',
    applyUrl: 'https://example.com/apply/1',
    postedDate: '2 days ago',
  },
  {
    id: '2',
    title: 'Frontend Engineer',
    company: 'StartupXYZ',
    location: 'Remote',
    type: 'Remote',
    salary: 'RM 6,000 - RM 9,000',
    techStack: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript'],
    description: 'We are seeking a talented frontend engineer to help us build beautiful and performant user interfaces. Experience with modern React patterns is essential.',
    applyUrl: 'https://example.com/apply/2',
    postedDate: '1 day ago',
  },
  {
    id: '3',
    title: 'Backend Developer',
    company: 'DataFlow Inc',
    location: 'Penang, Malaysia',
    type: 'Full-time',
    salary: 'RM 7,000 - RM 10,000',
    techStack: ['Python', 'Django', 'PostgreSQL', 'Docker', 'Kubernetes'],
    description: 'Looking for a backend developer to design and implement scalable APIs and microservices. Strong knowledge of Python and database design required.',
    applyUrl: 'https://example.com/apply/3',
    postedDate: '3 days ago',
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'CloudTech Solutions',
    location: 'Remote',
    type: 'Contract',
    salary: 'RM 9,000 - RM 13,000',
    techStack: ['AWS', 'Terraform', 'Kubernetes', 'CI/CD', 'Linux'],
    description: 'Join our DevOps team to manage cloud infrastructure and automate deployment pipelines. Experience with AWS and containerization is a must.',
    applyUrl: 'https://example.com/apply/4',
    postedDate: '5 days ago',
  },
  {
    id: '5',
    title: 'Mobile App Developer',
    company: 'AppVenture',
    location: 'Selangor, Malaysia',
    type: 'Full-time',
    salary: 'RM 6,500 - RM 9,500',
    techStack: ['React Native', 'TypeScript', 'Firebase', 'Redux'],
    description: 'We need a mobile developer to build cross-platform apps. Experience with React Native and mobile UI/UX design principles required.',
    applyUrl: 'https://example.com/apply/5',
    postedDate: '1 week ago',
  },
  {
    id: '6',
    title: 'AI/ML Engineer',
    company: 'IntelliTech',
    location: 'Kuala Lumpur, Malaysia',
    type: 'Full-time',
    salary: 'RM 10,000 - RM 15,000',
    techStack: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'Docker'],
    description: 'Work on cutting-edge AI projects. We are looking for someone with strong ML background and experience deploying models to production.',
    applyUrl: 'https://example.com/apply/6',
    postedDate: '4 days ago',
  },
  {
    id: '7',
    title: 'UI/UX Designer',
    company: 'DesignStudio',
    location: 'Remote',
    type: 'Part-time',
    salary: 'RM 4,000 - RM 6,000',
    techStack: ['Figma', 'Adobe XD', 'Prototyping', 'Design Systems'],
    description: 'Create beautiful and intuitive user interfaces. Strong portfolio and experience with modern design tools required.',
    applyUrl: 'https://example.com/apply/7',
    postedDate: '2 days ago',
  },
  {
    id: '8',
    title: 'Blockchain Developer',
    company: 'CryptoVault',
    location: 'Remote',
    type: 'Full-time',
    salary: 'RM 11,000 - RM 16,000',
    techStack: ['Solidity', 'Web3', 'Ethereum', 'Smart Contracts', 'TypeScript'],
    description: 'Build decentralized applications on blockchain. Experience with Solidity and Web3 technologies is essential.',
    applyUrl: 'https://example.com/apply/8',
    postedDate: '6 days ago',
  },
];

function JobsPageContent() {
  const { stats } = useJobBoard();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const allTechStack = useMemo(() => {
    const techSet = new Set<string>();
    MOCK_JOBS.forEach(job => {
      job.techStack.forEach(tech => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  }, []);

  const filteredJobs = useMemo(() => {
    return MOCK_JOBS.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = !selectedType || job.type === selectedType;
      const matchesTech = !selectedTech || job.techStack.includes(selectedTech);

      return matchesSearch && matchesType && matchesTech;
    });
  }, [searchQuery, selectedType, selectedTech]);

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Remote'];

  return (
    <main className="min-h-screen pb-20 overflow-hidden">
      <PageHero 
        title="Gamified Tech Job Board" 
        subtitle="Level up your career. Earn XP, unlock badges, and climb the leaderboard!"
      />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20 relative z-10">
        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 md:mb-12"
        >
          <Card className="border-neon-primary/30 bg-gradient-to-r from-black/80 to-black/40 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neon-primary font-mono">{stats.level}</div>
                    <div className="text-xs text-muted-foreground uppercase">Level</div>
                  </div>
                  <div className="h-12 w-px bg-neon-primary/30" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neon-secondary font-mono">{stats.xp}</div>
                    <div className="text-xs text-muted-foreground uppercase">Total XP</div>
                  </div>
                  <div className="h-12 w-px bg-neon-primary/30" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 font-mono">{stats.currentStreak}</div>
                    <div className="text-xs text-muted-foreground uppercase">Day Streak</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="cyberpunk" className="text-sm">
                      <Trophy className="w-4 h-4 mr-1" />
                      {stats.badges.filter(b => b.unlocked).length} Badges
                    </Badge>
                    <Badge variant="cyberpunk" className="text-sm">
                      <Zap className="w-4 h-4 mr-1" />
                      {stats.jobsViewed} Views
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono border-t border-neon-primary/20 pt-2 mt-2">
                    🎉 Bug Bounty 001 Completed! <a href="https://x.com/i/communities/1983062242292822298" target="_blank" rel="noopener noreferrer" className="text-neon-primary hover:underline">View Bug Bounty #001 Details</a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6 md:space-y-8">
            <UserStats />
            <Leaderboard />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6 md:space-y-8">
            {/* Search and Filters */}
            <Card className="border-neon-primary/30 bg-black/60 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search jobs, companies, or keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-black/50 border border-neon-primary/20 text-zinc-50 placeholder:text-muted-foreground focus:outline-none focus:border-neon-primary font-mono"
                    />
                  </div>

                  {/* Filter Toggle */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2"
                    >
                      <Filter className="w-4 h-4" />
                      Filters
                    </Button>
                    {(selectedType || selectedTech) && (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSelectedType(null);
                          setSelectedTech(null);
                        }}
                        className="text-xs"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Clear Filters
                      </Button>
                    )}
                  </div>

                  {/* Filters */}
                  <AnimatePresence>
                    {showFilters && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-4"
                      >
                        <div>
                          <div className="text-sm font-semibold mb-2 text-muted-foreground">Job Type</div>
                          <div className="flex flex-wrap gap-2">
                            {jobTypes.map((type) => (
                              <Badge
                                key={type}
                                variant={selectedType === type ? 'cyberpunk' : 'outline'}
                                className="cursor-pointer"
                                onClick={() => setSelectedType(selectedType === type ? null : type)}
                              >
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold mb-2 text-muted-foreground">Tech Stack</div>
                          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                            {allTechStack.map((tech) => (
                              <Badge
                                key={tech}
                                variant={selectedTech === tech ? 'cyberpunk' : 'outline'}
                                className="cursor-pointer"
                                onClick={() => setSelectedTech(selectedTech === tech ? null : tech)}
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground font-mono">
              Found {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
            </div>

            {/* Job Listings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="wait">
                {filteredJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <JobCard job={job} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredJobs.length === 0 && (
              <Card className="border-neon-primary/30 bg-black/60 backdrop-blur-md">
                <CardContent className="p-12 text-center">
                  <div className="text-4xl mb-4">🔍</div>
                  <div className="text-xl font-bold mb-2">No jobs found</div>
                  <div className="text-muted-foreground">
                    Try adjusting your filters or search query
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function JobsPage() {
  return (
    <JobBoardProvider>
      <JobsPageContent />
    </JobBoardProvider>
  );
}
