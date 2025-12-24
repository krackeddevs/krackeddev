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
                className="fixed inset-0 z-50 overflow-hidden"
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
                        {/* Parallax Background Layers */}
                        <ParallaxBanner className="h-full w-full">
                            {/* Sky layer - moves slowest */}
                            <ParallaxBannerLayer
                                image="/parallax/sky.png"
                                speed={-20}
                                style={{
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            />

                            {/* Back layer */}
                            <ParallaxBannerLayer
                                image="/parallax/background.png"
                                speed={-15}
                                style={{
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            />

                            {/* Middle layer */}
                            <ParallaxBannerLayer
                                image="/parallax/midground.png"
                                speed={-10}
                                style={{
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            />

                            {/* Front layer - moves faster */}
                            <ParallaxBannerLayer
                                image="/parallax/foreground.png"
                                speed={-5}
                                style={{
                                    backgroundSize: "cover",
                                    backgroundPosition: "center bottom",
                                }}
                            />
                        </ParallaxBanner>

                        <div className="absolute inset-0 flex flex-col items-center justify-start pointer-events-none z-20 pt-40 md:pt-48 lg:pt-56">
                            <div className="flex flex-col items-center justify-center w-full">
                                {/* Title Image */}
                                <motion.div
                                    className="flex justify-center w-full"
                                    initial={{ opacity: 0, y: -30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                >
                                    <img
                                        src="/parallax/title.png"
                                        alt="Kracked Devs"
                                        className="w-[360px] md:w-[680px] lg:w-[840px] xl:w-[960px] h-auto object-contain drop-shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                                    />
                                </motion.div>

                                {/* Subtitle Image */}
                                <motion.div
                                    className="flex justify-center w-full -mt-48 md:-mt-[28rem] lg:-mt-[28rem] xl:-mt-[34rem]"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    <img
                                        src="/parallax/subtitle.png"
                                        alt="Where Developers Unite"
                                        className="w-[360px] md:w-[750px] lg:w-[950px] xl:w-[1100px] h-auto object-contain drop-shadow-[0_0_20px_rgba(34,197,94,0.3)] relative z-10"

                                    />
                                </motion.div>
                            </div>

                            {/* Start Button */}
                            <motion.div
                                className="absolute bottom-[15%] md:bottom-[18%] left-1/2 -translate-x-1/2 pointer-events-auto"
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
                                    className="px-10 py-3 md:px-12 md:py-4 bg-green-600/90 hover:bg-green-500 text-white font-bold text-lg md:text-xl rounded-lg shadow-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] border-2 border-green-400/50 hover:border-green-300 cursor-pointer"
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
