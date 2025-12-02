"use client";

import { useEffect, useRef, useState } from "react";

export default function MusicPlayer() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isMuted, setIsMuted] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('soundMuted') === 'true';
        }
        return false;
    });

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        // Listen for sound toggle events
        const handleSoundToggle = (e: CustomEvent) => {
            const newMuted = e.detail.muted;
            setIsMuted(newMuted);
            
            // Immediately update audio
            if (newMuted) {
                audio.volume = 0;
                audio.pause();
            } else {
                audio.volume = 0.4;
                audio.play().catch(() => { });
            }
        };

        window.addEventListener('soundToggle', handleSoundToggle as EventListener);

        // Initialize based on current mute state
        const currentMuted = localStorage.getItem('soundMuted') === 'true';
        if (!currentMuted) {
            audio.volume = 0.4;

            // Try to autoplay, but handle browsers that block it
            const tryPlay = () => {
                audio
                    .play()
                    .then(() => {
                        // playing 👍
                    })
                    .catch(() => {
                        // Autoplay blocked – start on first user click
                        const unlock = () => {
                            const stillMuted = localStorage.getItem('soundMuted') === 'true';
                            if (!stillMuted) {
                                audio.play().catch(() => { });
                            }
                            window.removeEventListener("click", unlock);
                        };
                        window.addEventListener("click", unlock);
                    });
            };

            tryPlay();
        } else {
            audio.volume = 0;
        }

        return () => {
            window.removeEventListener('soundToggle', handleSoundToggle as EventListener);
        };
    }, []);

    return (
        <audio
            ref={audioRef}
            src="/audio/Pixelmusic.mp3"
            loop
            preload="auto"
            className="hidden"
        />
    );
}
