"use client";

interface ChallengeProgressBarProps {
  levelOrder: number;
  levelTitle: string;
  currentIndex: number;
  totalChallenges: number;
  xpEarned: number;
  totalXp: number;
}

/**
 * Progress bar showing level info, current challenge, and XP earned
 */
export function ChallengeProgressBar({
  levelOrder,
  levelTitle,
  currentIndex,
  totalChallenges,
  xpEarned,
  totalXp,
}: ChallengeProgressBarProps) {
  const progressPercent = totalChallenges > 0 
    ? Math.round((currentIndex / totalChallenges) * 100) 
    : 0;
  
  return (
    <div className="absolute top-4 left-0 right-0 z-50 flex justify-center px-4">
      <div className="w-full max-w-2xl">
        <div className="bg-gray-900/90 border-2 border-gray-700 rounded-md p-3">
          {/* Level header */}
          <div className="text-center mb-2">
            <span
              className="text-yellow-400 text-sm uppercase tracking-wider"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              Level {levelOrder}: {levelTitle}
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            {/* Challenge counter */}
            <span
              className="text-gray-300 text-xs uppercase"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              Challenge {Math.min(currentIndex + 1, totalChallenges)}/{totalChallenges}
            </span>
            
            {/* XP counter */}
            <span
              className="text-yellow-400 text-xs"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              {xpEarned}/{totalXp} XP
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="h-3 bg-gray-800 rounded-full border border-gray-600 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
