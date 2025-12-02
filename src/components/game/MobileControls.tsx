"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Joystick } from './Joystick';
import { GameBoyButtonX } from './GameBoyButtonX';
import { GameBoyButtonY } from './GameBoyButtonY';

interface MobileControlsProps {
  onDirectionChange: (dir: string | null) => void;
  onInteract: () => void;
  canInteract: boolean;
  onClose?: () => void;
  canClose?: boolean;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onDirectionChange,
  onInteract,
  canInteract,
  onClose,
  canClose = false,
}) => {
  const [interactPressed, setInteractPressed] = useState(false);
  const [closePressed, setClosePressed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [mutePressed, setMutePressed] = useState(false);

  const handleInteract = useCallback(() => {
    setInteractPressed(true);
    onInteract();
    setTimeout(() => setInteractPressed(false), 150);
  }, [onInteract]);

  const handleClose = useCallback(() => {
    if (onClose && canClose) {
      setClosePressed(true);
      onClose();
      setTimeout(() => setClosePressed(false), 150);
    }
  }, [onClose, canClose]);

  // Load mute state from localStorage
  useEffect(() => {
    const muted = localStorage.getItem('soundMuted') === 'true';
    setIsMuted(muted);

    const handleStorageChange = () => {
      const muted = localStorage.getItem('soundMuted') === 'true';
      setIsMuted(muted);
    };

    const handleSoundToggle = (e: CustomEvent) => {
      setIsMuted(e.detail.muted);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('soundToggle', handleSoundToggle as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('soundToggle', handleSoundToggle as EventListener);
    };
  }, []);

  const handleMute = useCallback(() => {
    setMutePressed(true);
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem('soundMuted', newMuted.toString());
    window.dispatchEvent(new CustomEvent('soundToggle', { detail: { muted: newMuted } }));
    setTimeout(() => setMutePressed(false), 150);
  }, [isMuted]);

  const buttonClass = (pressed: boolean, enabled: boolean) =>
    `w-20 h-20 rounded-full flex items-center justify-center font-bold select-none transition-all touch-none ${
      enabled
        ? pressed
          ? "bg-green-500 scale-95"
          : "bg-green-500 active:bg-green-600"
        : "bg-green-500 opacity-50"
    }`;

  return (
    <div className="relative flex items-center justify-between w-full pointer-events-none">
      {/* Joystick - Leftmost */}
      <div className="pointer-events-auto">
        <Joystick onDirectionChange={onDirectionChange} />
      </div>

      {/* Action buttons - Right side */}
      <div className="pointer-events-auto flex items-center gap-3">
        {/* Y button for closing dialogs */}
        {onClose && (
          <button
            onClick={handleClose}
            disabled={!canClose}
            className={`${buttonClass(closePressed, canClose)} relative top-4`}
            aria-label="Close dialog (Y button)"
          >
            <span className="text-white font-mono text-2xl font-bold">Y</span>
          </button>
        )}

        {/* X button for interaction */}
        <button
          onClick={handleInteract}
          disabled={!canInteract}
          className={`${buttonClass(interactPressed, canInteract)} relative -top-4`}
          aria-label="Interact (X button)"
        >
          <span className="text-white font-mono text-2xl font-bold">X</span>
        </button>

        {/* Mute button */}
        <button
          onClick={handleMute}
          className={`${buttonClass(mutePressed, true)} relative top-0`}
          aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
        >
          {isMuted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-white"
            >
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-white"
            >
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

