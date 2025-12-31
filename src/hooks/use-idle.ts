import { useState, useEffect } from 'react';

export function useIdle(timeout: number) {
    const [isIdle, setIsIdle] = useState(false);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const handleActivity = () => {
            setIsIdle(false);

            clearTimeout(timeoutId);

            timeoutId = setTimeout(() => {
                setIsIdle(true);
            }, timeout);
        };

        // Initial timer
        timeoutId = setTimeout(() => {
            setIsIdle(true);
        }, timeout);

        // Event listeners for activity
        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('mousedown', handleActivity);
        window.addEventListener('keydown', handleActivity);
        window.addEventListener('touchstart', handleActivity);
        window.addEventListener('scroll', handleActivity);
        window.addEventListener('visible', handleActivity); // Custom or document visibility?
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) handleActivity();
        });

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('mousedown', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            window.removeEventListener('touchstart', handleActivity);
            window.removeEventListener('scroll', handleActivity);
            document.removeEventListener('visibilitychange', handleActivity);
        };
    }, [timeout]);

    return isIdle;
}
