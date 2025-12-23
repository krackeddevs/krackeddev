"use client";

import { useState } from "react";
import Image from "next/image";
import { DialogueBox, DialogueLine } from "./dialogue-box";

const DOJO_DIALOGUES: DialogueLine[] = [
  {
    speaker: "Botak Guy",
    text: "Welcome, young developer...",
  },
  {
    speaker: "Botak Guy",
    text: "I have been expecting you. This dojo is where we set you up to be a legendary vibe coder.",
  },
  {
    speaker: "Botak Guy",
    text: "The path of the developer is not easy. But with discipline and practice, you will become strong.",
  },
  {
    speaker: "Botak Guy",
    text: "Here, we value clean code, elegant solutions, and the spirit of open source.",
  },
  {
    speaker: "Botak Guy",
    text: "Are you ready to begin your training?",
  },
  {
    speaker: "Botak Guy",
    text: "Very well. Your first lesson: The best code is the code you don't write.",
  },
  {
    speaker: "Botak Guy",
    text: "Now go forth, and may your builds always pass.",
  },
];

interface DojoSceneProps {
  onComplete?: () => void;
}

export function DojoScene({ onComplete }: DojoSceneProps) {
  const [dialogueComplete, setDialogueComplete] = useState(false);

  const handleDialogueComplete = () => {
    setDialogueComplete(true);
    onComplete?.();
  };

  const handleRestart = () => {
    setDialogueComplete(false);
  };

  return (
    <div className="relative w-full h-full min-h-screen bg-black overflow-hidden flex items-center justify-center">
      <div className="relative w-full max-w-5xl aspect-video">
        <Image
          src="/map/dojo.png"
          alt="Dojo"
          fill
          priority
          className="object-contain"
          style={{
            imageRendering: "pixelated",
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
          }}
        />

        {!dialogueComplete && (
          <DialogueBox
            dialogues={DOJO_DIALOGUES}
            onComplete={handleDialogueComplete}
            typingSpeed={35}
          />
        )}
      </div>

      {dialogueComplete && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center p-8">
            <p
              className="text-white text-sm mb-6"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              Training complete.
            </p>
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-gray-800 text-white text-xs border-2 border-white hover:bg-gray-700 transition-colors"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              Train Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
