import React from 'react';

export function MedalIcon({ rank, className }: { rank: number; className?: string }) {
    if (rank === 1) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                className={className}
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="12" cy="14" r="6" fill="#FFD700" stroke="#FFA500" strokeWidth="1.5" />
                <path
                    d="M8 8L10 14M16 8L14 14"
                    stroke="#FFA500"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
                <text
                    x="12"
                    y="17"
                    textAnchor="middle"
                    fill="#8B4513"
                    fontSize="8"
                    fontWeight="bold"
                >
                    1
                </text>
            </svg>
        );
    }

    if (rank === 2) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                className={className}
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="12" cy="14" r="6" fill="#C0C0C0" stroke="#A9A9A9" strokeWidth="1.5" />
                <path
                    d="M8 8L10 14M16 8L14 14"
                    stroke="#A9A9A9"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
                <text
                    x="12"
                    y="17"
                    textAnchor="middle"
                    fill="#4A4A4A"
                    fontSize="8"
                    fontWeight="bold"
                >
                    2
                </text>
            </svg>
        );
    }

    if (rank === 3) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                className={className}
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="12" cy="14" r="6" fill="#CD7F32" stroke="#8B4513" strokeWidth="1.5" />
                <path
                    d="M8 8L10 14M16 8L14 14"
                    stroke="#8B4513"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
                <text
                    x="12"
                    y="17"
                    textAnchor="middle"
                    fill="#4A2511"
                    fontSize="8"
                    fontWeight="bold"
                >
                    3
                </text>
            </svg>
        );
    }

    // For rank 4 and below, return a numbered badge
    return null;
}
