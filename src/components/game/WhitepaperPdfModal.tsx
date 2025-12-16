"use client";

import React from "react";

export function WhitepaperPdfModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-3 md:p-6">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-5xl bg-gray-900 border-4 border-yellow-500">
        <div className="flex items-center justify-between gap-3 p-4 border-b border-yellow-500/50">
          <h2 className="text-xl md:text-2xl text-yellow-400 font-bold">
            WHITEPAPER
          </h2>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 border-2 border-yellow-500/60 text-yellow-200 font-bold uppercase tracking-wider hover:bg-yellow-500/10 transition-all"
          >
            Close
          </button>
        </div>

        <div className="h-[70vh] bg-black">
          <iframe
            title="Kracked Devs Whitepaper"
            src="/whitepaper.pdf"
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}



