import { ReactNode } from "react";

interface RetroContainerProps {
  children: ReactNode;
  speaker?: string;
  className?: string;
  contentClassName?: string;
}

export function RetroContainer({
  children,
  speaker,
  className = "",
  contentClassName = "",
}: RetroContainerProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="bg-gray-800 p-1.5 rounded-md">
        <div className="bg-white p-1 rounded-md">
          <div className="bg-white border-4 border-gray-800 rounded-md relative">
            {speaker && (
              <div className="absolute -top-5 left-8 z-10">
                <div className="bg-gray-800 p-0.5 rounded-md">
                  <div className="bg-white px-5 py-2 rounded-md">
                    <span
                      className="text-gray-800 text-base font-bold uppercase tracking-wider block leading-none"
                      style={{ fontFamily: "'Press Start 2P', monospace" }}
                    >
                      {speaker}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className={`px-6 py-6 ${contentClassName}`}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
