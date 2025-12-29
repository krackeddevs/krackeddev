"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ParallaxBanner, ParallaxBannerLayer } from "react-scroll-parallax";

type IntroPhase = "loading" | "ready" | "transitioning" | "complete";

interface ParallaxIntroProps {
    onComplete: () => void;
}

// Preload images and track progress
function useImagePreloader(imagePaths: string[]) {
    const [progress, setProgress] = useState(0);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let loadedCount = 0;
        const totalImages = imagePaths.length;

        const loadImage = (src: string) => {
            return new Promise<void>((resolve) => {
                const img = new Image();
                img.onload = () => {
                    loadedCount++;
                    setProgress(Math.round((loadedCount / totalImages) * 100));
                    resolve();
                };
                img.onerror = () => {
                    loadedCount++;
                    setProgress(Math.round((loadedCount / totalImages) * 100));
                    resolve();
                };
                img.src = src;
            });
        };

        Promise.all(imagePaths.map(loadImage)).then(() => {
            setLoaded(true);
        });
    }, [imagePaths]);

    return { progress, loaded };
}

export function ParallaxIntro({ onComplete }: ParallaxIntroProps) {
    const [phase, setPhase] = useState<IntroPhase>("loading");

    const imagePaths = [
        "/parallax/sky.png",
        "/parallax/background.png",
        "/parallax/midground.png",
        "/parallax/foreground.png",
        "/parallax/title.png",
        "/parallax/subtitle.png",
    ];

    const { progress, loaded } = useImagePreloader(imagePaths);

    // Transition to ready when images are loaded
    useEffect(() => {
        if (loaded && phase === "loading") {
            const timer = setTimeout(() => setPhase("ready"), 300);
            return () => clearTimeout(timer);
        }
    }, [loaded, phase]);

    // Handle Start button click
    const handleStart = useCallback(() => {
        if (phase !== "ready") return;

        // Trigger audio unlock on interaction
        window.dispatchEvent(new CustomEvent("unlockAudio"));

        setPhase("transitioning");

        // Complete after transition animation
        setTimeout(() => {
            setPhase("complete");
            onComplete();
        }, 1200);
    }, [phase, onComplete]);

    // Phase: Complete - render nothing
    if (phase === "complete") {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 overflow-hidden w-screen h-screen"
                initial={{ opacity: 1 }}
                animate={{
                    opacity: phase === "transitioning" ? 0 : 1,
                    y: phase === "transitioning" ? -100 : 0,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            >
                {/* Phase: Loading */}
                <AnimatePresence mode="wait">
                    {phase === "loading" && (
                        <motion.div
                            key="loading"
                            className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 z-20"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="text-center space-y-6">
                                <motion.div
                                    className="text-green-400 font-mono text-lg"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    Loading...
                                </motion.div>

                                {/* Progress Bar */}
                                <div className="w-64 h-3 bg-gray-800 rounded-full overflow-hidden border border-green-900/50">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-green-600 to-green-400"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>

                                <div className="text-green-500/70 font-mono text-sm">
                                    {progress}%
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Phases: Ready & Transitioning - Parallax Scene */}
                {(phase === "ready" || phase === "transitioning") && (
                    <motion.div
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <ParallaxBanner className="h-full w-full bg-[#0a0f0a]">
                            {/* 1. SKY - Base layer (Static) */}
                            <ParallaxBannerLayer
                                image="/parallax/sky.png"
                                speed={0}
                                style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
                            />

                            {/* 2. CLOUDS - Background (Moves slightly) */}
                            <ParallaxBannerLayer
                                image="/parallax/background.png"
                                speed={-10}
                                style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
                            />

                            {/* 3. CITY & RIVER - Midground */}
                            <ParallaxBannerLayer
                                image="/parallax/midground.png"
                                speed={-5}
                                style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
                            />

                            {/* 4. CLIFF, CHARACTER & MONKEY - Foreground (The most important alignment) */}
                            <ParallaxBannerLayer
                                image="/parallax/foreground.png"
                                speed={0} // Keep this at 0 or very low (-2) so it stays anchored to the UI
                                style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
                            />
                        </ParallaxBanner>

                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30">
                            <motion.div
                                className="relative w-[100vw] sm:w-[800px] md:w-[1000px] lg:w-[1300px] aspect-[16/9] flex flex-col items-center justify-center -mt-16 sm:-mt-24"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                {/* Title Image - The Anchor */}
                                <img
                                    src="/parallax/title.png"
                                    alt="Kracked Devs"
                                    className="w-full h-auto object-contain drop-shadow-[0_0_30px_rgba(34,197,94,0.4)] relative z-20"
                                />

                                {/* Subtitle Image - Rigidly Locked & Aggressively Tucked */}
                                <img
                                    src="/parallax/subtitle.png"
                                    alt="Where Developers Unite"
                                    className="absolute top-[23%] w-[90%] h-auto object-contain drop-shadow-[0_0_20px_rgba(34,197,94,0.3)] z-30"
                                />
                            </motion.div>

                            {/* Start Button */}
                            <motion.div
                                className="absolute bottom-[20%] pointer-events-auto"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: phase === "ready" ? 1 : 0.5,
                                    y: 0,
                                    scale: phase === "transitioning" ? 0.9 : 1,
                                }}
                                transition={{ duration: 0.5, delay: 1.5 }}
                            >
                                <button
                                    onClick={handleStart}
                                    className="px-12 py-4 bg-[#15803d] hover:bg-[#16a34a] text-white font-bold text-xl rounded-sm border-b-4 border-green-900 active:border-b-0 active:translate-y-1 transition-all uppercase tracking-widest disabled:opacity-50"
                                    disabled={phase !== "ready"}
                                >
                                    {phase === "transitioning" ? "Starting..." : "Start"}
                                </button>
                            </motion.div>
                        </div>



                        {/* CRT Scanline Effect */}
                        <div className="scanlines absolute inset-0 pointer-events-none opacity-30" />
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence >
    );
}
