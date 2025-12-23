"use client";

import React, { useState, useMemo } from 'react';

interface DirectorySceneProps {
  onBack: () => void;
}

interface Resource {
  name: string;
  url: string;
  desc: string;
  tags: string[];
}

const resources: Record<string, Resource[]> = {
  learning: [
    { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org/', desc: '100% free interactive coding lessons with certificates. Start from zero and build real projects.', tags: ['Free', 'Interactive', 'Beginner'] },
    { name: 'Scrimba', url: 'https://scrimba.com/', desc: 'Interactive screencasts where you can pause and code along with the instructor.', tags: ['Interactive', 'Visual'] },
    { name: 'The Odin Project', url: 'https://www.theodinproject.com/', desc: 'Free full-stack curriculum. Learn by building real projects from day one.', tags: ['Free', 'Project-Based'] },
    { name: 'JavaScript.info', url: 'https://javascript.info/', desc: 'Modern JavaScript tutorial - from basics to advanced. Clean and beginner-friendly.', tags: ['Free', 'JavaScript'] },
    { name: 'Learn Python', url: 'https://www.learnpython.org/', desc: 'Interactive Python tutorials. Type code directly in browser and see results.', tags: ['Free', 'Interactive', 'Python'] },
    { name: 'FutureCoder', url: 'https://futurecoder.io/', desc: 'Free interactive Python course with AI hints. Perfect for absolute beginners.', tags: ['Free', 'Interactive', 'Beginner'] },
    { name: 'web.dev Learn', url: 'https://web.dev/learn', desc: 'Google\'s free web development courses. Modern best practices explained simply.', tags: ['Free', 'Web Dev'] },
    { name: 'Roadmap.sh', url: 'https://roadmap.sh/', desc: 'Visual roadmaps showing what to learn for different developer paths.', tags: ['Free', 'Roadmaps'] },
    { name: 'GeeksforGeeks', url: 'https://www.geeksforgeeks.org/', desc: 'Massive library of coding tutorials, examples, and practice problems.', tags: ['Free', 'Tutorials'] },
    { name: 'Learn Git Branching', url: 'https://learngitbranching.js.org/', desc: 'Visual and interactive way to learn Git. See branches form in real-time!', tags: ['Free', 'Interactive', 'Git'] },
  ],
  tools: [
    { name: 'DevToolTips', url: 'https://devtoolstips.org/', desc: 'Quick tips for browser DevTools. Level up your debugging skills fast.', tags: ['Free', 'Tips'] },
    { name: 'Git Cheatsheet', url: 'https://www.ndpsoftware.com/git-cheatsheet.html', desc: 'Visual interactive Git cheatsheet. See how commands move code between areas.', tags: ['Free', 'Cheatsheet', 'Git'] },
    { name: 'Oh Shit, Git!?!', url: 'https://ohshitgit.com/', desc: 'Git gone wrong? This site shows how to fix common Git mistakes. Lifesaver!', tags: ['Free', 'Tips', 'Git'] },
    { name: 'Regex101', url: 'https://regex101.com/', desc: 'Build and test regex patterns with real-time explanations. Never guess again.', tags: ['Free', 'Tool'] },
    { name: 'Can I Use', url: 'https://caniuse.com/', desc: 'Check browser support for any web feature instantly.', tags: ['Free', 'Reference'] },
    { name: 'CSS-Tricks', url: 'https://css-tricks.com/', desc: 'CSS tips, tricks, and techniques. Quick reads for daily CSS wins.', tags: ['Free', 'Tips', 'CSS'] },
    { name: 'Vim Cheat Sheet', url: 'https://vim.rtorr.com/', desc: 'Clean visual Vim reference. Print it, bookmark it, master Vim.', tags: ['Free', 'Cheatsheet', 'Vim'] },
    { name: 'Beej\'s Guides', url: 'https://www.beej.us/guide/', desc: 'Free programming guides for C, networking, and more. Classic dev resources.', tags: ['Free', 'Guides'] },
    { name: 'Eloquent JavaScript', url: 'https://eloquentjavascript.net/', desc: 'Free online book to learn JavaScript. Interactive code examples throughout.', tags: ['Free', 'Book', 'JavaScript'] },
    { name: 'Python Tutor', url: 'https://pythontutor.com/', desc: 'Visualize code execution step-by-step. See exactly what your code does.', tags: ['Free', 'Visual', 'Python'] },
  ],
  practice: [
    { name: 'CSS Diner', url: 'https://flukeout.github.io/', desc: 'Learn CSS selectors by playing a fun restaurant game. 32 levels!', tags: ['Free', 'Game', 'CSS'] },
    { name: 'Flexbox Froggy', url: 'https://flexboxfroggy.com/', desc: 'Help Froggy reach the lily pad by writing CSS flexbox code. Adorable & educational.', tags: ['Free', 'Game', 'CSS'] },
    { name: 'Grid Garden', url: 'https://cssgridgarden.com/', desc: 'Grow your carrot garden while learning CSS Grid. 28 levels of grid mastery.', tags: ['Free', 'Game', 'CSS'] },
    { name: 'Flexbox Zombies', url: 'https://mastery.games/flexboxzombies', desc: 'Master flexbox by fighting zombies with your crossbow. Story-driven learning!', tags: ['Free', 'Game', 'CSS'] },
    { name: 'CodinGame', url: 'https://www.codingame.com/', desc: 'Learn 25+ languages by coding games. Compete with other devs worldwide.', tags: ['Free', 'Games', 'Multi-Lang'] },
    { name: 'CheckiO', url: 'https://checkio.org/', desc: 'Coding games for Python and JavaScript. Level up by solving puzzles.', tags: ['Free', 'Game', 'Python'] },
    { name: 'Vim Adventures', url: 'https://vim-adventures.com/', desc: 'Learn Vim commands by playing an RPG adventure game.', tags: ['Game', 'Vim'] },
    { name: 'Oh My Git!', url: 'https://ohmygit.org/', desc: 'Open source game to learn Git visually. See your repo as a playing card game.', tags: ['Free', 'Game', 'Git'] },
    { name: 'SQL Murder Mystery', url: 'https://mystery.knightlab.com/', desc: 'Solve a murder mystery using SQL queries. Detective + coding = fun!', tags: ['Free', 'Game', 'SQL'] },
    { name: 'Untrusted', url: 'https://untrustedgame.com/', desc: 'Meta-JavaScript adventure game. Edit the game\'s code to escape each level!', tags: ['Free', 'Game', 'JavaScript'] },
  ]
};

const categoryInfo = {
  all: { title: 'All Resources', desc: 'Browse through our curated collection of developer tools and learning materials' },
  learning: { title: '📚 Learn', desc: 'Free interactive tutorials perfect for beginners. Build projects from day one.' },
  tools: { title: '🛠️ Tools & Cheatsheets', desc: 'Quick references, debugging tips, and utilities for daily dev work' },
  practice: { title: '🎮 Practice & Games', desc: 'Learn by playing! Interactive games to master coding skills.' }
};

export const DirectoryScene: React.FC<DirectorySceneProps> = ({ onBack }) => {
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredResources = useMemo(() => {
    let itemsToRender: Resource[] = [];

    if (currentCategory === 'all') {
      Object.keys(resources).forEach(cat => {
        itemsToRender.push(...resources[cat]);
      });
    } else {
      itemsToRender = resources[currentCategory] || [];
    }

    if (searchTerm) {
      itemsToRender = itemsToRender.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return itemsToRender;
  }, [currentCategory, searchTerm]);

  const currentInfo = categoryInfo[currentCategory as keyof typeof categoryInfo] || categoryInfo.all;

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ backgroundColor: '#0a1a0a', color: '#e8f5e9' }}>
      {/* Header */}
      <div 
        className="w-full py-6 px-6 text-center border-b"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 255, 65, 0.15) 0%, rgba(102, 187, 106, 0.15) 100%)',
          borderColor: 'rgba(0, 255, 65, 0.3)'
        }}
      >
        <h1 
          className="text-3xl font-bold mb-2"
          style={{
            background: 'linear-gradient(135deg, #00ff41, #66bb6a)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          ⚡ KRACKED DEVS DIRECTORY
        </h1>
        <p style={{ color: '#81c784', fontSize: '14px' }}>
          Essential Tools & Learning Resources for Developers
        </p>
      </div>

      {/* Container */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden gap-5 p-5">
        {/* Sidebar */}
        <div 
          className="w-full lg:w-56 bg-opacity-100 border rounded-lg overflow-y-auto p-4 lg:max-h-full max-h-24 flex lg:flex-col flex-row gap-2 overflow-x-auto"
          style={{
            backgroundColor: '#0f2612',
            borderColor: 'rgba(0, 255, 65, 0.2)'
          }}
        >
          {Object.entries(categoryInfo).map(([key, info]) => (
            <button
              key={key}
              onClick={() => setCurrentCategory(key)}
              className={`w-full lg:w-full py-3 px-4 mb-0 lg:mb-2 rounded-lg text-sm font-medium text-left transition-all duration-200 flex-shrink-0 lg:flex-shrink min-w-[150px] ${
                currentCategory === key
                  ? 'bg-opacity-15 border'
                  : 'bg-transparent border'
              }`}
              style={{
                backgroundColor: currentCategory === key 
                  ? 'rgba(0, 255, 65, 0.15)' 
                  : 'transparent',
                borderColor: currentCategory === key 
                  ? '#00ff41' 
                  : 'rgba(0, 255, 65, 0.25)',
                color: currentCategory === key 
                  ? '#00ff41' 
                  : '#81c784'
              }}
              onMouseEnter={(e) => {
                if (currentCategory !== key) {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 255, 65, 0.1)';
                  e.currentTarget.style.borderColor = '#00ff41';
                  e.currentTarget.style.color = '#e8f5e9';
                }
              }}
              onMouseLeave={(e) => {
                if (currentCategory !== key) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(0, 255, 65, 0.25)';
                  e.currentTarget.style.color = '#81c784';
                }
              }}
            >
              {info.title}
            </button>
          ))}
        </div>

        {/* Content */}
        <div 
          className="flex-1 bg-opacity-100 border rounded-lg p-6 overflow-y-auto flex flex-col"
          style={{
            backgroundColor: '#0f2612',
            borderColor: 'rgba(0, 255, 65, 0.2)'
          }}
        >
          {/* Search Box */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search resources..."
            className="w-full py-3 px-4 mb-6 rounded-lg text-sm border transition-all duration-200 focus:outline-none"
            style={{
              backgroundColor: 'rgba(0, 255, 65, 0.05)',
              borderColor: 'rgba(0, 255, 65, 0.2)',
              color: '#e8f5e9'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#00ff41';
              e.target.style.backgroundColor = 'rgba(0, 255, 65, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(0, 255, 65, 0.2)';
              e.target.style.backgroundColor = 'rgba(0, 255, 65, 0.05)';
            }}
          />

          {/* Content Header */}
          <div className="mb-6 pb-4 border-b" style={{ borderColor: 'rgba(0, 255, 65, 0.2)' }}>
            <h2 className="text-2xl mb-2" style={{ color: '#00ff41' }}>
              {currentInfo.title}
            </h2>
            <p style={{ color: '#81c784', fontSize: '14px' }}>
              {currentInfo.desc}
            </p>
          </div>

          {/* Items Grid */}
          {filteredResources.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-center" style={{ color: '#81c784' }}>
              No resources found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
              {filteredResources.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="rounded-lg p-5 transition-all duration-200 cursor-pointer flex flex-col h-full"
                  style={{
                    backgroundColor: 'rgba(0, 255, 65, 0.05)',
                    border: '1px solid rgba(0, 255, 65, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 255, 65, 0.12)';
                    e.currentTarget.style.borderColor = '#00ff41';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 255, 65, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 255, 65, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(0, 255, 65, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <h3 className="text-base mb-2" style={{ color: '#00ff41' }}>
                    {item.name}
                  </h3>
                  <p className="text-sm mb-4 flex-1 leading-relaxed" style={{ color: '#81c784' }}>
                    {item.desc}
                  </p>
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {item.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="inline-block px-2.5 py-1 rounded-xl text-xs font-medium"
                        style={{
                          backgroundColor: tag === 'Free' 
                            ? 'rgba(0, 208, 132, 0.1)' 
                            : 'rgba(255, 0, 110, 0.1)',
                          border: `1px solid ${tag === 'Free' 
                            ? 'rgba(0, 208, 132, 0.3)' 
                            : 'rgba(255, 0, 110, 0.3)'}`,
                          color: tag === 'Free' ? '#4caf50' : '#66bb6a'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full py-2.5 px-4 rounded-lg font-semibold text-sm text-center transition-all duration-200"
                    style={{
                      backgroundColor: '#00ff41',
                      color: '#0a1a0a'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#66bb6a';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#00ff41';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    Open Resource →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
