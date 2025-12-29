"use client";

import { RetroContainer } from "./retro-container";

interface MobileWarningModalProps {
  isOpen: boolean;
}

/**
 * Non-dismissible modal warning that the game is not optimized for mobile devices.
 * Uses the retro game styling to match the dojo scene aesthetic.
 */
export function MobileWarningModal({ isOpen }: MobileWarningModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="w-full max-w-md">
        <RetroContainer speaker="SYSTEM">
          <div className="flex flex-col items-center gap-6 text-center">
            {/* Warning Icon */}
            <div
              className="text-4xl"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              ⚠️
            </div>

            {/* Title */}
            <h2
              className="text-lg text-gray-800 uppercase tracking-wider leading-relaxed"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              Desktop Required
            </h2>

            {/* Message */}
            <p
              className="text-xs text-gray-600 leading-relaxed"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              This game is not optimized for mobile devices. For the best
              experience, please use a desktop or laptop computer.
            </p>

            {/* Decorative pixel divider */}
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-gray-800"
                  style={{ imageRendering: "pixelated" }}
                />
              ))}
            </div>

            {/* Instruction */}
            <p
              className="text-xs text-gray-500"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              Switch to desktop to continue your journey.
            </p>
          </div>
        </RetroContainer>
      </div>
    </div>
  );
}
