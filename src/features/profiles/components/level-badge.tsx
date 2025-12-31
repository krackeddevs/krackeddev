
interface LevelBadgeProps {
    level: number;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export function LevelBadge({ level, size = 'md', showLabel = true }: LevelBadgeProps) {
    const sizeClasses = {
        xs: 'w-6 h-6 text-[10px]',
        sm: 'w-8 h-8 text-xs',
        md: 'w-12 h-12 text-sm',
        lg: 'w-16 h-16 text-xl'
    };

    return (
        <div className="flex items-center gap-2">
            <div
                className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-white border-2 border-cyan-400 neon-glow`}
                style={{
                    boxShadow: '0 0 5px rgba(34, 211, 238, 0.8), 0 0 10px rgba(34, 211, 238, 0.5)'
                }}
            >
                {level}
            </div>
            {showLabel && <span className="text-sm text-gray-400">LVL</span>}
        </div>
    );
}
