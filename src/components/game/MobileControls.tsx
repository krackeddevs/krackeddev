"use client";

import React, { useState, useCallback } from 'react';
import { Joystick } from './Joystick';

interface MobileControlsProps {
  onDirectionChange: (dir: string | null) => void;
  onInteract: () => void;
  canInteract: boolean;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onDirectionChange,
  onInteract,
  canInteract,
}) => {
  const [interactPressed, setInteractPressed] = useState(false);

  const handleInteract = useCallback(() => {
    setInteractPressed(true);
    onInteract();
    setTimeout(() => setInteractPressed(false), 150);
  }, [onInteract]);

  const buttonClass = (pressed: boolean, enabled: boolean) =>
    `px-6 py-3 rounded-xl flex items-center justify-center text-sm font-bold select-none transition-all touch-none ${
      enabled
        ? pressed
          ? "bg-green-500/90 scale-95"
          : "bg-green-500/70 active:bg-green-500/90"
        : "bg-gray-600/50 opacity-50"
    }`;

  return (
    <div className="relative z-30 flex items-center justify-center gap-8 pointer-events-none">
      {/* Joystick */}
      <div className="pointer-events-auto">
        <Joystick onDirectionChange={onDirectionChange} />
      </div>

      {/* Action button */}
      <div className="pointer-events-auto">
        <button
          onClick={handleInteract}
          disabled={!canInteract}
          className={buttonClass(interactPressed, canInteract)}
        >
          <span className="text-white font-mono text-xs">E</span>
          <span className="text-white/70 ml-1 text-xs">Enter</span>
        </button>
      </div>
    </div>
  );
};

