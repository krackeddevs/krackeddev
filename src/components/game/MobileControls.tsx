"use client";

import React, { useState, useCallback } from 'react';
import { DPad } from './DPad';

interface MobileControlsProps {
  onDirectionChange: (dir: string | null) => void;
  onInteract: () => void;
  onConfirm: () => void;
  canInteract: boolean;
  canConfirm: boolean;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onDirectionChange,
  onInteract,
  onConfirm,
  canInteract,
  canConfirm,
}) => {
  const [interactPressed, setInteractPressed] = useState(false);
  const [confirmPressed, setConfirmPressed] = useState(false);

  const handleInteract = useCallback(() => {
    setInteractPressed(true);
    onInteract();
    setTimeout(() => setInteractPressed(false), 150);
  }, [onInteract]);

  const handleConfirm = useCallback(() => {
    setConfirmPressed(true);
    onConfirm();
    setTimeout(() => setConfirmPressed(false), 150);
  }, [onConfirm]);

  const buttonClass = (pressed: boolean, enabled: boolean) =>
    `px-6 py-3 rounded-xl flex items-center justify-center text-sm font-bold select-none transition-all touch-none ${
      enabled
        ? pressed
          ? "bg-green-500/90 scale-95"
          : "bg-green-500/70 active:bg-green-500/90"
        : "bg-gray-600/50 opacity-50"
    }`;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-30 flex items-end justify-between px-4 pointer-events-none">
      {/* D-Pad on the left */}
      <div className="pointer-events-auto bg-black/50 backdrop-blur-sm p-2 rounded-lg">
        <DPad onDirectionChange={onDirectionChange} />
      </div>

      {/* Action buttons on the right */}
      <div className="flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={handleInteract}
          disabled={!canInteract}
          className={buttonClass(interactPressed, canInteract)}
        >
          <span className="text-white font-mono text-xs">E</span>
          <span className="text-white/70 ml-1 text-xs">Interact</span>
        </button>
        <button
          onClick={handleConfirm}
          disabled={!canConfirm}
          className={buttonClass(confirmPressed, canConfirm)}
        >
          <span className="text-white font-mono text-xs">ENTER</span>
          <span className="text-white/70 ml-1 text-xs">Confirm</span>
        </button>
      </div>
    </div>
  );
};

