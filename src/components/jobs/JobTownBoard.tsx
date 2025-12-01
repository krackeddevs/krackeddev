"use client";

import React, { useRef, useEffect, useCallback, useState } from 'react';

// ============================================================================
// GAME CONSTANTS
// ============================================================================
const TILE_SIZE = 40;
const MAP_WIDTH = 15;
const MAP_HEIGHT = 9;
const PLAYER_SPEED = 2.5;

// Map tile types
const TILE_EMPTY = 0;
const TILE_WALL = 1;
const TILE_JOBS = 2;
const TILE_BLOG = 3;
const TILE_HACKATHON = 4;

// Generate a simple overworld map
function generateMap(): number[][] {
  const map: number[][] = [];

  for (let y = 0; y < MAP_HEIGHT; y++) {
    const row: number[] = [];
    for (let x = 0; x < MAP_WIDTH; x++) {
      // Border walls
      if (x === 0 || x === MAP_WIDTH - 1 || y === 0 || y === MAP_HEIGHT - 1) {
        row.push(TILE_WALL);
      } else {
        row.push(TILE_EMPTY);
      }
    }
    map.push(row);
  }

  // Place special buildings
  // Jobs (top-left area)
  map[2][3] = TILE_JOBS;
  map[2][4] = TILE_JOBS;
  map[3][3] = TILE_JOBS;
  map[3][4] = TILE_JOBS;

  // Blog (top-right area)
  map[2][MAP_WIDTH - 5] = TILE_BLOG;
  map[2][MAP_WIDTH - 4] = TILE_BLOG;
  map[3][MAP_WIDTH - 5] = TILE_BLOG;
  map[3][MAP_WIDTH - 4] = TILE_BLOG;

  // Hackathon (bottom-center)
  map[MAP_HEIGHT - 3][Math.floor(MAP_WIDTH / 2) - 1] = TILE_HACKATHON;
  map[MAP_HEIGHT - 3][Math.floor(MAP_WIDTH / 2)] = TILE_HACKATHON;
  map[MAP_HEIGHT - 4][Math.floor(MAP_WIDTH / 2) - 1] = TILE_HACKATHON;
  map[MAP_HEIGHT - 4][Math.floor(MAP_WIDTH / 2)] = TILE_HACKATHON;

  return map;
}

// ============================================================================
// TILE RENDERER
// ============================================================================
function renderTile(
  ctx: CanvasRenderingContext2D,
  tile: number,
  x: number,
  y: number
) {
  const px = x * TILE_SIZE;
  const py = y * TILE_SIZE;

  switch (tile) {
    case TILE_EMPTY:
      // Ground - green grass
      ctx.fillStyle = "#22c55e"; // green-500
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.strokeStyle = "#16a34a"; // green-600
      ctx.lineWidth = 1;
      ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);
      // Add some grass texture
      ctx.fillStyle = "#15803d"; // green-700
      ctx.fillRect(px + 5, py + 5, 3, 3);
      ctx.fillRect(px + 15, py + 12, 2, 2);
      ctx.fillRect(px + 25, py + 8, 3, 3);
      ctx.fillRect(px + 32, py + 15, 2, 2);
      break;

    case TILE_WALL:
      // Wall - dark gray stone
      ctx.fillStyle = "#374151"; // gray-700
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = "#4b5563"; // gray-600
      ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
      ctx.fillStyle = "#1f2937"; // gray-800
      ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
      ctx.strokeStyle = "#111827"; // gray-900
      ctx.lineWidth = 1;
      ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);
      break;

    case TILE_JOBS:
      // Jobs - blue building with label
      ctx.fillStyle = "#22c55e"; // green ground
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = "#3b82f6"; // blue-500
      ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
      ctx.fillStyle = "#2563eb"; // blue-600
      ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
      // Draw text label with outline for visibility
      const jobsTextX = px + TILE_SIZE / 2;
      const jobsTextY = py + TILE_SIZE / 2;
      ctx.font = "bold 8px 'Press Start 2P', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      // Draw black outline
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.strokeText("JOBS", jobsTextX, jobsTextY);
      // Draw white text
      ctx.fillStyle = "#ffffff";
      ctx.fillText("JOBS", jobsTextX, jobsTextY);
      break;

    case TILE_BLOG:
      // Blog - purple building with label
      ctx.fillStyle = "#22c55e"; // green ground
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = "#a855f7"; // purple-500
      ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
      ctx.fillStyle = "#9333ea"; // purple-600
      ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
      // Draw text label with outline for visibility
      const blogTextX = px + TILE_SIZE / 2;
      const blogTextY = py + TILE_SIZE / 2;
      ctx.font = "bold 8px 'Press Start 2P', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      // Draw black outline
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.strokeText("BLOG", blogTextX, blogTextY);
      // Draw white text
      ctx.fillStyle = "#ffffff";
      ctx.fillText("BLOG", blogTextX, blogTextY);
      break;

    case TILE_HACKATHON:
      // Hackathon - orange building with label
      ctx.fillStyle = "#22c55e"; // green ground
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = "#f97316"; // orange-500
      ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
      ctx.fillStyle = "#ea580c"; // orange-600
      ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
      // Draw text label (smaller font for longer word) with outline
      const hackTextX = px + TILE_SIZE / 2;
      const hackTextY1 = py + TILE_SIZE / 2 - 3;
      const hackTextY2 = py + TILE_SIZE / 2 + 3;
      ctx.font = "bold 6px 'Press Start 2P', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      // Draw black outline
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.strokeText("HACK", hackTextX, hackTextY1);
      ctx.strokeText("ATHON", hackTextX, hackTextY2);
      // Draw white text
      ctx.fillStyle = "#ffffff";
      ctx.fillText("HACK", hackTextX, hackTextY1);
      ctx.fillText("ATHON", hackTextX, hackTextY2);
      break;
  }
}

// ============================================================================
// PLAYER RENDERER
// ============================================================================
function renderPlayer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  direction: number,
  frame: number
) {
  ctx.save();
  ctx.translate(x, y);

  // Walking animation bounce
  const bounce = Math.abs(Math.sin(frame * 0.3)) * 2;

  // Shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.beginPath();
  ctx.ellipse(0, 14, 8, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body (simple rectangle)
  ctx.fillStyle = "#3b82f6"; // blue-500
  ctx.fillRect(-6, -2 - bounce, 12, 10);

  // Head
  ctx.fillStyle = "#fbbf24"; // yellow-400 (hair/hat)
  ctx.beginPath();
  ctx.arc(0, -8 - bounce, 6, 0, Math.PI * 2);
  ctx.fill();

  // Face based on direction
  if (direction === 0) {
    // Down - facing camera
    ctx.fillStyle = "#fef3c7"; // yellow-100 (skin)
    ctx.beginPath();
    ctx.arc(0, -8 - bounce, 5, 0, Math.PI * 2);
    ctx.fill();
    // Eyes
    ctx.fillStyle = "#000";
    ctx.fillRect(-3, -10 - bounce, 2, 2);
    ctx.fillRect(1, -10 - bounce, 2, 2);
  } else if (direction === 1) {
    // Up - back of head
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.arc(0, -8 - bounce, 6, 0, Math.PI * 2);
    ctx.fill();
  } else if (direction === 2) {
    // Left - profile
    ctx.fillStyle = "#fef3c7";
    ctx.beginPath();
    ctx.arc(-2, -8 - bounce, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.fillRect(-4, -10 - bounce, 2, 2);
  } else {
    // Right - profile
    ctx.fillStyle = "#fef3c7";
    ctx.beginPath();
    ctx.arc(2, -8 - bounce, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.fillRect(2, -10 - bounce, 2, 2);
  }

  // Legs with walking animation
  const legOffset = Math.sin(frame * 0.4) * 2;
  ctx.fillStyle = "#1e40af"; // blue-800
  ctx.fillRect(-5, 6 - bounce + legOffset, 4, 6);
  ctx.fillRect(1, 6 - bounce - legOffset, 4, 6);

  ctx.restore();
}

// ============================================================================
// D-PAD COMPONENT (for mobile)
// ============================================================================
function DPad({
  onDirectionChange,
}: {
  onDirectionChange: (dir: string | null) => void;
}) {
  const [activeDir, setActiveDir] = useState<string | null>(null);

  const handleDirection = useCallback(
    (dir: string | null) => {
      setActiveDir(dir);
      onDirectionChange(dir);
    },
    [onDirectionChange]
  );

  const buttonClass = (dir: string) =>
    `w-12 h-12 rounded-xl flex items-center justify-center text-xl select-none transition-all touch-none ${
      activeDir === dir
        ? "bg-blue-500/80 scale-95"
        : "bg-white/20 active:bg-blue-500/60"
    }`;

  return (
    <div className="grid grid-cols-3 gap-1">
      <div />
      <button
        className={buttonClass("up")}
        onTouchStart={(e) => {
          e.preventDefault();
          handleDirection("up");
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          handleDirection(null);
        }}
        onMouseDown={() => handleDirection("up")}
        onMouseUp={() => handleDirection(null)}
        onMouseLeave={() => activeDir === "up" && handleDirection(null)}
      >
        ▲
      </button>
      <div />
      <button
        className={buttonClass("left")}
        onTouchStart={(e) => {
          e.preventDefault();
          handleDirection("left");
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          handleDirection(null);
        }}
        onMouseDown={() => handleDirection("left")}
        onMouseUp={() => handleDirection(null)}
        onMouseLeave={() => activeDir === "left" && handleDirection(null)}
      >
        ◀
      </button>
      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/20" />
      <button
        className={buttonClass("right")}
        onTouchStart={(e) => {
          e.preventDefault();
          handleDirection("right");
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          handleDirection(null);
        }}
        onMouseDown={() => handleDirection("right")}
        onMouseUp={() => handleDirection(null)}
        onMouseLeave={() => activeDir === "right" && handleDirection(null)}
      >
        ▶
      </button>
      <div />
      <button
        className={buttonClass("down")}
        onTouchStart={(e) => {
          e.preventDefault();
          handleDirection("down");
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          handleDirection(null);
        }}
        onMouseDown={() => handleDirection("down")}
        onMouseUp={() => handleDirection(null)}
        onMouseLeave={() => activeDir === "down" && handleDirection(null)}
      >
        ▼
      </button>
      <div />
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
interface JobTownBoardProps {
  onVisitJobs: () => void;
  onVisitBlog: () => void;
  onVisitHackathon: () => void;
}

const JobTownBoard: React.FC<JobTownBoardProps> = ({
  onVisitJobs,
  onVisitBlog,
  onVisitHackathon,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [map] = useState(() => generateMap());
  const [isMobile, setIsMobile] = useState(false);

  // Player state
  const playerRef = useRef({
    x: 2.5 * TILE_SIZE,
    y: 2.5 * TILE_SIZE,
    direction: 0, // 0=down, 1=up, 2=left, 3=right
    frame: 0,
    isMoving: false,
  });

  // Input state
  const currentDirRef = useRef<string | null>(null);
  const lastTileRef = useRef<{ x: number; y: number } | null>(null);

  // Check if position is walkable
  const isWalkable = useCallback(
    (x: number, y: number, padding: number = 10) => {
      const corners = [
        { x: x - padding, y: y - padding },
        { x: x + padding, y: y - padding },
        { x: x - padding, y: y + padding },
        { x: x + padding, y: y + padding },
      ];

      for (const corner of corners) {
        const tileX = Math.floor(corner.x / TILE_SIZE);
        const tileY = Math.floor(corner.y / TILE_SIZE);

        if (
          tileX < 0 ||
          tileX >= MAP_WIDTH ||
          tileY < 0 ||
          tileY >= MAP_HEIGHT
        ) {
          return false;
        }

        const tile = map[tileY]?.[tileX];
        // Only block walls, allow all other tiles
        if (tile === TILE_WALL) {
          return false;
        }
      }

      return true;
    },
    [map]
  );

  // Handle direction input
  const handleDirectionInput = useCallback((dir: string | null) => {
    currentDirRef.current = dir;
  }, []);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768;
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      let dir: string | null = null;

      if (key === "w" || key === "arrowup") {
        e.preventDefault();
        dir = "up";
      } else if (key === "s" || key === "arrowdown") {
        e.preventDefault();
        dir = "down";
      } else if (key === "a" || key === "arrowleft") {
        e.preventDefault();
        dir = "left";
      } else if (key === "d" || key === "arrowright") {
        e.preventDefault();
        dir = "right";
      }

      if (dir) {
        handleDirectionInput(dir);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const currentDir = currentDirRef.current;

      if (
        ((key === "w" || key === "arrowup") && currentDir === "up") ||
        ((key === "s" || key === "arrowdown") && currentDir === "down") ||
        ((key === "a" || key === "arrowleft") && currentDir === "left") ||
        ((key === "d" || key === "arrowright") && currentDir === "right")
      ) {
        handleDirectionInput(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleDirectionInput]);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let frameCount = 0;

    const gameLoop = () => {
      frameCount++;
      const player = playerRef.current;

      // Movement directions
      const dirVectors = [
        { dx: 0, dy: 1 }, // down
        { dx: 0, dy: -1 }, // up
        { dx: -1, dy: 0 }, // left
        { dx: 1, dy: 0 }, // right
      ];

      // Player movement
      if (currentDirRef.current) {
        const dirMap: Record<string, number> = {
          down: 0,
          up: 1,
          left: 2,
          right: 3,
        };
        const inputDir = dirMap[currentDirRef.current];
        const vec = dirVectors[inputDir];
        const newX = player.x + vec.dx * PLAYER_SPEED;
        const newY = player.y + vec.dy * PLAYER_SPEED;

        if (isWalkable(newX, newY, 10)) {
          player.x = newX;
          player.y = newY;
          player.direction = inputDir;
          player.isMoving = true;
          player.frame++;
        } else {
          player.isMoving = false;
        }
      } else {
        player.isMoving = false;
      }

      // Detect special tiles and trigger callbacks
      const tileX = Math.floor(player.x / TILE_SIZE);
      const tileY = Math.floor(player.y / TILE_SIZE);
      const tile = map[tileY]?.[tileX];

      // Only trigger callback when entering a new tile (not every frame)
      const currentTile = { x: tileX, y: tileY };
      const lastTile = lastTileRef.current;
      const tileChanged =
        !lastTile ||
        lastTile.x !== currentTile.x ||
        lastTile.y !== currentTile.y;

      if (tileChanged && tile !== undefined) {
        lastTileRef.current = currentTile;

        if (tile === TILE_JOBS) {
          onVisitJobs();
        } else if (tile === TILE_BLOG) {
          onVisitBlog();
        } else if (tile === TILE_HACKATHON) {
          onVisitHackathon();
        }
      }

      // Render
      ctx.fillStyle = "#0f172a"; // slate-900 background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render map
      for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
          renderTile(ctx, map[y][x], x, y);
        }
      }

      // Render player
      renderPlayer(
        ctx,
        player.x,
        player.y,
        player.direction,
        player.isMoving ? player.frame : 0
      );

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [map, isWalkable, onVisitJobs, onVisitBlog, onVisitHackathon]);

  return (
    <div className="w-full bg-gray-900 text-white jobs-container relative overflow-hidden flex items-center justify-center pt-20 pb-8 px-2 md:px-4">
      {/* Canvas Container - Hero section with gaps on left and right, centered under header */}
      <div className="w-full max-w-5xl border-4 border-gray-700 mx-auto" style={{ aspectRatio: `${MAP_WIDTH}/${MAP_HEIGHT}` }}>
        <canvas
          ref={canvasRef}
          width={MAP_WIDTH * TILE_SIZE}
          height={MAP_HEIGHT * TILE_SIZE}
          className="block w-full h-full"
          style={{ 
            imageRendering: "pixelated"
          }}
        />
      </div>

      {/* Mobile Controls */}
      {isMobile && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <DPad onDirectionChange={handleDirectionInput} />
        </div>
      )}
    </div>
  );
};

export default JobTownBoard;

