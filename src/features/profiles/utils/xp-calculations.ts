export const XP_CONFIG = {
    BASE_MULTIPLIER: 100,
    MAX_LEVEL: 100
};

export interface XPProgress {
    currentXP: number;
    currentLevel: number;
    xpForCurrentLevel: number;
    xpForNextLevel: number;
    xpInCurrentLevel: number;
    xpNeededForNext: number;
    progressPercentage: number;
}

export function calculateLevelFromXP(xp: number): number {
    if (xp < 0) return 1;
    const level = Math.floor(Math.sqrt(xp / XP_CONFIG.BASE_MULTIPLIER)) + 1;
    return Math.min(level, XP_CONFIG.MAX_LEVEL);
}

export function calculateXPForLevel(level: number): number {
    if (level <= 1) return 0;
    if (level > XP_CONFIG.MAX_LEVEL) return Infinity;
    return Math.pow(level - 1, 2) * XP_CONFIG.BASE_MULTIPLIER;
}

export function calculateXPForNextLevel(currentLevel: number): number {
    if (currentLevel >= XP_CONFIG.MAX_LEVEL) return Infinity;
    return calculateXPForLevel(currentLevel + 1);
}

export function calculateXPProgress(totalXP: number): XPProgress {
    const currentLevel = calculateLevelFromXP(totalXP);
    const xpForCurrentLevel = calculateXPForLevel(currentLevel);

    let xpForNextLevel: number;
    let progressPercentage: number;

    if (currentLevel >= XP_CONFIG.MAX_LEVEL) {
        xpForNextLevel = xpForCurrentLevel;
        progressPercentage = 100;
    } else {
        xpForNextLevel = calculateXPForNextLevel(currentLevel);
        const xpInCurrentLevel = totalXP - xpForCurrentLevel;
        const totalXPNeededForLevel = xpForNextLevel - xpForCurrentLevel;
        progressPercentage = totalXPNeededForLevel <= 0 ? 100 : (xpInCurrentLevel / totalXPNeededForLevel) * 100;
    }

    return {
        currentXP: totalXP,
        currentLevel,
        xpForCurrentLevel,
        xpForNextLevel,
        xpInCurrentLevel: Math.max(0, totalXP - xpForCurrentLevel),
        xpNeededForNext: Math.max(0, xpForNextLevel - totalXP),
        progressPercentage: Math.min(100, Math.max(0, progressPercentage))
    };
}
