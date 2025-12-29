"use client";

import { useState, useEffect } from "react";

interface LevelCompleteProps {
  levelOrder: number;
  levelTitle: string;
  xpEarned: number;
  onReplay?: () => void;
  onContinue?: () => void;
  hasNextLevel?: boolean;
}

/**
 * Level completion celebration screen
 */
export function LevelComplete({
  levelOrder,
  levelTitle,
  xpEarned,
  onReplay,
  onContinue,
  hasNextLevel = false,
}: LevelCompleteProps) {
  const [showContent, setShowContent] = useState(false);
  const [xpCount, setXpCount] = useState(0);
  
  // Animate in
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);
  
  // Animate XP counter
  useEffect(() => {
    if (!showContent) return;
    
    const duration = 1500; // 1.5 seconds
    const steps = 30;
    const increment = xpEarned / steps;
    let current = 0;
    let step = 0;
    
    const interval = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), xpEarned);
      setXpCount(current);
      
      if (step >= steps) {
        clearInterval(interval);
        setXpCount(xpEarned);
      }
    }, duration / steps);
    
    return () => clearInterval(interval);
  }, [showContent, xpEarned]);
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
      <div
        className={`text-center p-8 transition-all duration-500 ${
          showContent ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        {/* Stars decoration */}
        <div className="mb-4 text-4xl animate-pulse">
          &#11088; &#11088; &#11088;
        </div>
        
        {/* Title */}
        <h2
          className="text-white text-xl mb-2"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          LEVEL {levelOrder} COMPLETE!
        </h2>
        
        <p
          className="text-yellow-400 text-sm mb-6"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          {levelTitle}
        </p>
        
        {/* XP Earned */}
        <div className="mb-8">
          <div
            className="text-yellow-400 text-3xl font-bold"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            +{xpCount} XP
          </div>
          <p
            className="text-gray-500 text-xs mt-2"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            TOTAL EARNED
          </p>
        </div>
        
        {/* Buttons */}
        <div className="flex flex-col gap-3 items-center">
          {hasNextLevel && onContinue ? (
            <button
              onClick={onContinue}
              className="px-8 py-4 bg-green-600 text-white text-sm border-4 border-green-400 hover:bg-green-500 hover:scale-105 transition-all duration-200 shadow-lg"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              CONTINUE TO NEXT LEVEL
            </button>
          ) : (
            <div
              className="px-8 py-4 bg-gray-700 text-gray-400 text-sm border-4 border-gray-600 cursor-not-allowed"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              NEXT LEVEL COMING SOON
            </div>
          )}
          
          {onReplay && (
            <button
              onClick={onReplay}
              className="px-6 py-3 bg-gray-800 text-white text-xs border-2 border-gray-600 hover:bg-gray-700 transition-colors"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              REPLAY LEVEL
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
