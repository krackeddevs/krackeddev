import { useState, useEffect, useCallback } from "react";

export function useLandingSequence() {
    const [showAnimation, setShowAnimation] = useState(true);
    const [audioUnlocked, setAudioUnlocked] = useState(false);
    const [animationDone, setAnimationDone] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            // Check if we should skip animation (e.g., coming from back to town)
            const skipAnimation =
                sessionStorage.getItem("skipWelcomeAnimation") === "true";
            if (skipAnimation) {
                setShowAnimation(false);
                setAnimationDone(true);
                sessionStorage.removeItem("skipWelcomeAnimation");
                return;
            }

            // Check 12-hour localStorage logic
            const LAST_WELCOME_KEY = "krackedDevs_lastWelcomeTime";
            const ONE_HOUR_MS = 1 * 60 * 60 * 1000; // 1 hour in milliseconds, though variable name says hour, logic was 1hr in original file (1 * 60 * 60 * 1000)

            const lastWelcomeTime = localStorage.getItem(LAST_WELCOME_KEY);
            const now = Date.now();

            if (lastWelcomeTime) {
                const timeSinceLastWelcome = now - parseInt(lastWelcomeTime, 10);
                // If less than 1 hour have passed, skip animation (matching original logic)
                if (timeSinceLastWelcome < ONE_HOUR_MS) {
                    setShowAnimation(false);
                    setAnimationDone(true);
                    return;
                }
            }

            // If we get here, either it's the first time or enough time has passed
            // Animation will show
        }
    }, []);

    const handleAnimationComplete = useCallback(() => {
        // Save the current timestamp when animation completes
        if (typeof window !== "undefined") {
            const LAST_WELCOME_KEY = "krackedDevs_lastWelcomeTime";
            localStorage.setItem(LAST_WELCOME_KEY, Date.now().toString());
        }
        setShowAnimation(false);
        setAnimationDone(true);
        // Trigger audio unlock event for global MusicPlayer
        setAudioUnlocked(true);
        window.dispatchEvent(new CustomEvent("unlockAudio"));
    }, []);

    // Capture first user interaction to unlock audio
    useEffect(() => {
        const handleFirstInteraction = () => {
            if (!audioUnlocked) {
                setAudioUnlocked(true);
                window.dispatchEvent(new CustomEvent("unlockAudio"));
            }
        };

        const events = [
            "click",
            "touchstart",
            "mousedown",
            "keydown",
            "mousemove",
            "touchmove",
        ];

        if (typeof window !== "undefined") {
            events.forEach((event) => {
                window.addEventListener(event, handleFirstInteraction, {
                    once: true,
                    passive: true,
                });
            });

            return () => {
                events.forEach((event) => {
                    window.removeEventListener(event, handleFirstInteraction);
                });
            };
        }
    }, [audioUnlocked]);

    return {
        showAnimation,
        animationDone,
        audioUnlocked,
        handleAnimationComplete
    };
}
