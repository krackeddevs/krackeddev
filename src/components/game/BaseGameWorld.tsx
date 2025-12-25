"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import {
  TILE_SIZE,
  MAP_WIDTH,
  MAP_HEIGHT,
  PLAYER_SPEED,
  TILE_EMPTY,
  TILE_WALL,
} from "@/lib/game/constants";
import {
  renderTile,
  renderPlayer,
  renderCat,
  renderChicken,
  renderCow,
} from "@/lib/game/renderers";
import {
  isWalkable,
  isNearBuilding,
  isOnBuildingTile,
  type WalkableRect,
} from "@/lib/game/utils";
import { BuildingConfig } from "@/lib/game/types";
import { MobileControls } from "./MobileControls";
import { ControlLegend } from "./ControlLegend";
import {
  preloadCharacterSprites,
  preloadAnimalSprites,
  spriteCache,
  loadSprite,
} from "@/lib/game/sprites";
import { toast } from "sonner";

// Create a single shared Audio instance for click sound (only in browser)
let clickSound: HTMLAudioElement | null = null;
if (typeof Audio !== "undefined") {
  clickSound = new Audio("/audio/click.mp3");
  clickSound.volume = 0.6;
}

const playClickSound = () => {
  if (clickSound) {
    try {
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {
        // ignore autoplay / user gesture issues
      });
    } catch {
      // fail silently
    }
  }
};

interface BaseGameWorldProps {
  map: number[][];
  buildings: BuildingConfig[];
  onBuildingEnter: (route: string) => void;
  initialPlayerX?: number;
  initialPlayerY?: number;
  onCloseDialog?: () => void;
  canCloseDialog?: boolean;
  backgroundImagePath?: string;
  backgroundFit?: "cover" | "contain";
  showDebugHud?: boolean;
  walkableRectangles?: WalkableRect[];
  triggerZones?: Array<{
    id: string;
    rect: WalkableRect;
    message?: string;
    modal?: {
      title?: string;
      body: string;
      confirmText?: string;
      cancelText?: string;
      actions?: Array<{
        label: string;
        href: string;
        newTab?: boolean;
      }>;
    };
    onConfirm?: () => void;
    onCancel?: () => void;
    once?: boolean; // if true, only triggers once per page load
  }>;
}

export const BaseGameWorld: React.FC<BaseGameWorldProps> = ({
  map,
  buildings,
  onBuildingEnter,
  initialPlayerX = (MAP_WIDTH / 2) * TILE_SIZE,
  initialPlayerY = (MAP_HEIGHT / 2) * TILE_SIZE,
  onCloseDialog,
  canCloseDialog = false,
  backgroundImagePath,
  backgroundFit = "cover",
  showDebugHud = false,
  walkableRectangles = [],
  triggerZones = [],
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [nearBuilding, setNearBuilding] = useState<BuildingConfig | null>(null);
  const [debugHud, setDebugHud] = useState<{
    x: number;
    y: number;
    tileX: number;
    tileY: number;
    direction: number;
    isMoving: boolean;
  } | null>(null);
  const [activeModal, setActiveModal] = useState<{
    zoneId: string;
    title?: string;
    body: string;
    confirmText?: string;
    cancelText?: string;
    actions?: Array<{
      label: string;
      href: string;
      newTab?: boolean;
    }>;
    onConfirm?: () => void;
    onCancel?: () => void;
  } | null>(null);
  const activeModalRef = useRef<typeof activeModal>(null);
  const insideZoneIdsRef = useRef<Set<string>>(new Set());
  const triggeredOnceZoneIdsRef = useRef<Set<string>>(new Set());
  const hasNavigatedRef = useRef(false);
  const toastIdRef = useRef<string | number | null>(null);
  const buildingNameToastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    activeModalRef.current = activeModal;
  }, [activeModal]);

  // Player state
  const playerRef = useRef({
    x: initialPlayerX,
    y: initialPlayerY,
    direction: 0, // 0=down, 1=up, 2=left, 3=right
    frame: 0,
    isMoving: false,
  });

  // Cat state - follows the player
  const catRef = useRef({
    x: initialPlayerX,
    y: initialPlayerY + TILE_SIZE, // Start behind player
    direction: 0,
    frame: 0,
    targetX: initialPlayerX,
    targetY: initialPlayerY + TILE_SIZE,
  });

  // Animal state - random movement
  const getRandomWalkablePosition = useCallback((map: number[][]) => {
    const attempts = 50;
    for (let i = 0; i < attempts; i++) {
      const x = Math.random() * (MAP_WIDTH - 2) * TILE_SIZE + TILE_SIZE;
      const y = Math.random() * (MAP_HEIGHT - 2) * TILE_SIZE + TILE_SIZE;
      if (isWalkable(x, y, map, 8)) {
        return { x, y };
      }
    }
    // Fallback to center area
    return { x: (MAP_WIDTH / 2) * TILE_SIZE, y: (MAP_HEIGHT / 2) * TILE_SIZE };
  }, []);

  const chickensRef = useRef(
    Array.from({ length: 3 }, () => ({
      x: 0,
      y: 0,
      direction: Math.floor(Math.random() * 4),
      frame: Math.floor(Math.random() * 100),
      moveTimer: Math.floor(Math.random() * 60) + 30,
      targetX: 0,
      targetY: 0,
    }))
  );

  const cowsRef = useRef(
    Array.from({ length: 2 }, () => ({
      x: 0,
      y: 0,
      direction: Math.floor(Math.random() * 4),
      frame: Math.floor(Math.random() * 100),
      moveTimer: Math.floor(Math.random() * 80) + 40,
      targetX: 0,
      targetY: 0,
    }))
  );

  // Input state
  const currentDirRef = useRef<string | null>(null);
  const lastTileRef = useRef<{ x: number; y: number } | null>(null);

  // Handle direction input
  const handleDirectionInput = useCallback((dir: string | null) => {
    currentDirRef.current = dir;
  }, []);

  // Preload character and animal sprites
  useEffect(() => {
    preloadCharacterSprites().catch(console.error);
    preloadAnimalSprites().catch(console.error);
  }, []);

  // Preload background image (if any)
  useEffect(() => {
    if (!backgroundImagePath) return;
    loadSprite(backgroundImagePath).catch(() => { });
  }, [backgroundImagePath]);

  // Debug HUD updater (throttled)
  useEffect(() => {
    if (!showDebugHud) return;
    const interval = window.setInterval(() => {
      const p = playerRef.current;
      setDebugHud({
        x: p.x,
        y: p.y,
        tileX: Math.floor(p.x / TILE_SIZE),
        tileY: Math.floor(p.y / TILE_SIZE),
        direction: p.direction,
        isMoving: p.isMoving,
      });
    }, 100);
    return () => window.clearInterval(interval);
  }, [showDebugHud]);

  // Initialize animal positions
  useEffect(() => {
    chickensRef.current.forEach((chicken) => {
      const pos = getRandomWalkablePosition(map);
      chicken.x = pos.x;
      chicken.y = pos.y;
      chicken.targetX = pos.x;
      chicken.targetY = pos.y;
    });
    cowsRef.current.forEach((cow) => {
      const pos = getRandomWalkablePosition(map);
      cow.x = pos.x;
      cow.y = pos.y;
      cow.targetX = pos.x;
      cow.targetY = pos.y;
    });
  }, [map, getRandomWalkablePosition]);

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
      } else if (key === " " || key === "x") {
        // Space or X to enter building directly
        e.preventDefault();
        if (nearBuilding) {
          playClickSound();
          onBuildingEnter(nearBuilding.route);
        }
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
  }, [handleDirectionInput, nearBuilding, onBuildingEnter]);

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

        if (isWalkable(newX, newY, map, 10, walkableRectangles)) {
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

      // Trigger zones (pixel-based): show modal when entering a zone
      if (triggerZones.length > 0) {
        const insideNow = new Set<string>();

        for (const zone of triggerZones) {
          const left = Math.min(zone.rect.x1, zone.rect.x2);
          const right = Math.max(zone.rect.x1, zone.rect.x2);
          const top = Math.min(zone.rect.y1, zone.rect.y2);
          const bottom = Math.max(zone.rect.y1, zone.rect.y2);

          const inside =
            player.x >= left &&
            player.x <= right &&
            player.y >= top &&
            player.y <= bottom;

          if (inside) {
            insideNow.add(zone.id);
          }

          const wasInside = insideZoneIdsRef.current.has(zone.id);
          const isEntering = inside && !wasInside;

          if (!isEntering) continue;

          if (
            zone.once === true &&
            triggeredOnceZoneIdsRef.current.has(zone.id)
          ) {
            continue;
          }

          // Don't interrupt an open modal; next enter will show again.
          if (!activeModalRef.current) {
            if (zone.once === true) {
              triggeredOnceZoneIdsRef.current.add(zone.id);
            }
            const modal = zone.modal ?? {
              title: undefined,
              body: zone.message ?? "",
              confirmText: "OK",
            };

            setActiveModal({
              zoneId: zone.id,
              title: modal.title,
              body: modal.body,
              confirmText: modal.confirmText ?? "OK",
              cancelText: modal.cancelText,
              actions: modal.actions,
              onConfirm: zone.onConfirm,
              onCancel: zone.onCancel,
            });
          }
        }

        // Update inside tracking
        insideZoneIdsRef.current = insideNow;
      }

      // Check if near any building
      let foundBuilding: BuildingConfig | null = null;

      for (const building of buildings) {
        if (isNearBuilding(player.x, player.y, building.positions)) {
          foundBuilding = building;

          // Check if player is standing on any tile of the building and it has autoNavigate
          if (
            isOnBuildingTile(player.x, player.y, building.positions) &&
            building.autoNavigate &&
            !hasNavigatedRef.current
          ) {
            // Auto-navigate immediately (only once)
            hasNavigatedRef.current = true;
            onBuildingEnter(building.route);
            return; // Exit early to prevent further rendering
          }

          break;
        }
      }

      // Reset navigation flag if player moves away from auto-navigate building
      if (!foundBuilding || !foundBuilding.autoNavigate) {
        hasNavigatedRef.current = false;
      }

      if (foundBuilding !== nearBuilding) {
        setNearBuilding(foundBuilding);
      }

      // Render
      ctx.fillStyle = "#000000"; // pure black background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Optional background image (drawn behind map/buildings)
      if (backgroundImagePath) {
        const bg = spriteCache.get(backgroundImagePath);
        if (bg && bg.complete) {
          const canvasW = canvas.width;
          const canvasH = canvas.height;
          const imgW = bg.width || 1;
          const imgH = bg.height || 1;

          const scale =
            backgroundFit === "contain"
              ? Math.min(canvasW / imgW, canvasH / imgH)
              : Math.max(canvasW / imgW, canvasH / imgH);

          const drawW = imgW * scale;
          const drawH = imgH * scale;
          const drawX = (canvasW - drawW) / 2;
          const drawY = (canvasH - drawH) / 2;

          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(bg, drawX, drawY, drawW, drawH);
          ctx.imageSmoothingEnabled = true;
        }
      }

      // Create a set of building tile positions to skip during map rendering
      const buildingTilePositions = new Set<string>();
      buildings.forEach((building) => {
        building.positions.forEach((pos) => {
          buildingTilePositions.add(`${pos.x},${pos.y}`);
        });
      });

      // Render map (skip building tiles - they'll be rendered as big boxes)
      // If a background image is provided, we skip drawing the tile grid so the image can be the base map.
      if (!backgroundImagePath) {
        for (let y = 0; y < MAP_HEIGHT; y++) {
          for (let x = 0; x < MAP_WIDTH; x++) {
            const tileKey = `${x},${y}`;
            if (buildingTilePositions.has(tileKey)) {
              // Render as empty ground instead of building tile
              renderTile(ctx, TILE_EMPTY, x, y);
            } else {
              renderTile(ctx, map[y][x], x, y);
            }
          }
        }
      }

      // Render buildings as one big box each
      for (const building of buildings) {
        if (building.positions.length > 0) {
          // Find the bounding box of all building positions
          const minX = Math.min(...building.positions.map((p) => p.x));
          const minY = Math.min(...building.positions.map((p) => p.y));
          const maxX = Math.max(...building.positions.map((p) => p.x));
          const maxY = Math.max(...building.positions.map((p) => p.y));

          const px = minX * TILE_SIZE;
          const py = minY * TILE_SIZE;
          const width = (maxX - minX + 1) * TILE_SIZE;
          const height = (maxY - minY + 1) * TILE_SIZE;

          // Render ground under building
          ctx.fillStyle = "#22c55e"; // green ground
          ctx.fillRect(px, py, width, height);

          // If building has an image path, render the image instead of colored box
          if (building.imagePath) {
            const buildingImage = spriteCache.get(building.imagePath);
            if (buildingImage && buildingImage.complete) {
              // Render image, maintaining aspect ratio and fitting within building bounds
              const imageAspect = buildingImage.width / buildingImage.height;
              const buildingAspect = width / height;

              let drawWidth = width - 4;
              let drawHeight = height - 4;
              let drawX = px + 2;
              let drawY = py + 2;

              if (imageAspect > buildingAspect) {
                // Image is wider - fit to width
                drawHeight = drawWidth / imageAspect;
                drawY = py + (height - drawHeight) / 2;
              } else {
                // Image is taller - fit to height
                drawWidth = drawHeight * imageAspect;
                drawX = px + (width - drawWidth) / 2;
              }

              ctx.imageSmoothingEnabled = false; // Pixelated rendering
              ctx.drawImage(buildingImage, drawX, drawY, drawWidth, drawHeight);
              ctx.imageSmoothingEnabled = true;
            } else {
              // Image not loaded yet, render placeholder colored box
              ctx.fillStyle = building.color || "#9333ea";
              ctx.fillRect(px + 2, py + 2, width - 4, height - 4);
            }
          } else {
            // Render building as one big box
            ctx.fillStyle = building.color || "#9333ea"; // Use building's color
            ctx.fillRect(px + 2, py + 2, width - 4, height - 4);
            ctx.fillStyle = building.colorDark || "#9333ea"; // Use building's dark color
            ctx.fillRect(px + 4, py + 4, width - 8, height - 8);

            // Calculate center of the building for text placement
            const centerX = px + width / 2;
            const centerY = py + height / 2;

            // Render label with big font (smaller for certain buildings)
            const labelText = building.customLabel || building.label;
            const isVerySmallFontBuilding =
              building.id === "members" ||
              building.id === "levels" ||
              building.id === "system" ||
              building.id === "founding-members";
            const isSmallFontBuilding =
              building.id === "back-to-town" ||
              building.id === "whitepaper" ||
              building.id === "opensource" ||
              building.id === "bounty";
            let fontSize = 16;
            let lineSpacing = 18;
            if (isVerySmallFontBuilding) {
              fontSize = 10;
              lineSpacing = 12;
            } else if (isSmallFontBuilding) {
              fontSize = 12;
              lineSpacing = 14;
            }
            ctx.font = `bold ${fontSize}px 'Press Start 2P', monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 3;
            ctx.fillStyle = "#ffffff";

            // Split label into lines if needed
            const lines = labelText.split("\n");
            lines.forEach((line, idx) => {
              const textY =
                centerY + (idx - (lines.length - 1) / 2) * lineSpacing;
              ctx.strokeText(line, centerX, textY);
              ctx.fillText(line, centerX, textY);
            });
          }
        }
      }

      // Update cat to follow player
      const cat = catRef.current;
      const CAT_FOLLOW_SPEED = PLAYER_SPEED * 0.7; // Cat moves slightly slower
      const FOLLOW_DISTANCE = TILE_SIZE * 0.8; // Distance behind player

      // Calculate target position (behind player based on direction)
      const catDirVectors = [
        { dx: 0, dy: FOLLOW_DISTANCE }, // down - cat follows behind
        { dx: 0, dy: -FOLLOW_DISTANCE }, // up - cat follows behind
        { dx: FOLLOW_DISTANCE, dy: 0 }, // left - cat follows behind
        { dx: -FOLLOW_DISTANCE, dy: 0 }, // right - cat follows behind
      ];

      const vec = catDirVectors[player.direction];
      cat.targetX = player.x + vec.dx;
      cat.targetY = player.y + vec.dy;

      // Smoothly move cat towards target
      const dx = cat.targetX - cat.x;
      const dy = cat.targetY - cat.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 2) {
        // Move cat towards target
        const moveX = (dx / distance) * CAT_FOLLOW_SPEED;
        const moveY = (dy / distance) * CAT_FOLLOW_SPEED;
        const newCatX = cat.x + moveX;
        const newCatY = cat.y + moveY;

        // Check if cat can move there (same walkability as player)
        if (isWalkable(newCatX, newCatY, map, 8)) {
          cat.x = newCatX;
          cat.y = newCatY;
          cat.frame++;

          // Update cat direction based on movement
          if (Math.abs(dx) > Math.abs(dy)) {
            cat.direction = dx > 0 ? 3 : 2; // right or left
          } else {
            cat.direction = dy > 0 ? 0 : 1; // down or up
          }
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

      // Render cat
      renderCat(ctx, cat.x, cat.y, cat.direction, cat.frame);

      // Update and render chickens
      const ANIMAL_SPEED = PLAYER_SPEED * 0.15; // Much slower than player
      chickensRef.current.forEach((chicken) => {
        chicken.frame++;
        chicken.moveTimer--;

        // Choose new random direction when timer expires
        if (chicken.moveTimer <= 0) {
          const dirVectors = [
            { dx: 0, dy: 1 }, // down
            { dx: 0, dy: -1 }, // up
            { dx: -1, dy: 0 }, // left
            { dx: 1, dy: 0 }, // right
          ];
          chicken.direction = Math.floor(Math.random() * 4);
          const vec = dirVectors[chicken.direction];
          const moveDistance = TILE_SIZE * (Math.random() * 3 + 1); // 1-4 tiles
          chicken.targetX = chicken.x + vec.dx * moveDistance;
          chicken.targetY = chicken.y + vec.dy * moveDistance;
          chicken.moveTimer = Math.floor(Math.random() * 60) + 30; // 30-90 frames
        }

        // Move towards target
        const dx = chicken.targetX - chicken.x;
        const dy = chicken.targetY - chicken.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 2) {
          const moveX = (dx / distance) * ANIMAL_SPEED;
          const moveY = (dy / distance) * ANIMAL_SPEED;
          const newX = chicken.x + moveX;
          const newY = chicken.y + moveY;

          if (isWalkable(newX, newY, map, 6)) {
            chicken.x = newX;
            chicken.y = newY;
          } else {
            // Hit obstacle, choose new direction
            chicken.moveTimer = 0;
          }
        } else {
          // Reached target, choose new direction soon
          if (chicken.moveTimer > 10) {
            chicken.moveTimer = 10;
          }
        }

        renderChicken(
          ctx,
          chicken.x,
          chicken.y,
          chicken.direction,
          chicken.frame
        );
      });

      // Update and render cows
      cowsRef.current.forEach((cow) => {
        cow.frame++;
        cow.moveTimer--;

        // Choose new random direction when timer expires
        if (cow.moveTimer <= 0) {
          const dirVectors = [
            { dx: 0, dy: 1 }, // down
            { dx: 0, dy: -1 }, // up
            { dx: -1, dy: 0 }, // left
            { dx: 1, dy: 0 }, // right
          ];
          cow.direction = Math.floor(Math.random() * 4);
          const vec = dirVectors[cow.direction];
          const moveDistance = TILE_SIZE * (Math.random() * 2 + 1); // 1-3 tiles (slower)
          cow.targetX = cow.x + vec.dx * moveDistance;
          cow.targetY = cow.y + vec.dy * moveDistance;
          cow.moveTimer = Math.floor(Math.random() * 80) + 40; // 40-120 frames
        }

        // Move towards target
        const dx = cow.targetX - cow.x;
        const dy = cow.targetY - cow.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 2) {
          const moveX = (dx / distance) * ANIMAL_SPEED * 0.5; // Cows slower than chickens
          const moveY = (dy / distance) * ANIMAL_SPEED * 0.5;
          const newX = cow.x + moveX;
          const newY = cow.y + moveY;

          if (isWalkable(newX, newY, map, 8)) {
            cow.x = newX;
            cow.y = newY;
          } else {
            // Hit obstacle, choose new direction
            cow.moveTimer = 0;
          }
        } else {
          // Reached target, choose new direction soon
          if (cow.moveTimer > 10) {
            cow.moveTimer = 10;
          }
        }

        renderCow(ctx, cow.x, cow.y, cow.direction, cow.frame);
      });

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [
    map,
    buildings,
    nearBuilding,
    backgroundImagePath,
    backgroundFit,
    walkableRectangles,
    triggerZones,
  ]);

  // Handle sonner toast for interaction hints
  useEffect(() => {
    if (nearBuilding) {
      // Dismiss any existing toasts
      if (toastIdRef.current !== null) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
      if (buildingNameToastIdRef.current !== null) {
        toast.dismiss(buildingNameToastIdRef.current);
        buildingNameToastIdRef.current = null;
      }

      // Show first toast: building name with building color
      buildingNameToastIdRef.current = toast(nearBuilding.label, {
        duration: 1000,
        className: "sonner-toast-building-name",
        description: undefined,
      });

      // Apply building color styles directly to the toast element after it renders
      const applyStyles = () => {
        const toastElements = document.querySelectorAll(
          ".sonner-toast-building-name[data-sonner-toast]"
        );
        const latestToast = Array.from(toastElements).pop() as HTMLElement;
        if (latestToast) {
          latestToast.style.setProperty(
            "background-color",
            nearBuilding.color,
            "important"
          );
          latestToast.style.setProperty("color", "#ffffff", "important");
          latestToast.style.setProperty(
            "border",
            `2px solid ${nearBuilding.colorDark || nearBuilding.color}`,
            "important"
          );
          latestToast.style.setProperty(
            "border-color",
            nearBuilding.colorDark || nearBuilding.color,
            "important"
          );

          // Also style the title text
          const titleElement = latestToast.querySelector(
            "[data-title]"
          ) as HTMLElement;
          if (titleElement) {
            titleElement.style.setProperty("color", "#ffffff", "important");
          }
        }
      };

      // Try immediately and after a short delay to ensure element is rendered
      applyStyles();
      setTimeout(applyStyles, 10);

      // After 1 second, dismiss building name toast and show enter prompt
      const timer = setTimeout(() => {
        if (buildingNameToastIdRef.current !== null) {
          toast.dismiss(buildingNameToastIdRef.current);
          buildingNameToastIdRef.current = null;
        }

        // Show second toast: enter prompt
        const message = isMobile
          ? "Tap X button to enter"
          : "Press X or Space to enter";
        toastIdRef.current = toast.info(message, {
          duration: 5000,
        });
      }, 1000);

      return () => {
        clearTimeout(timer);
        if (toastIdRef.current !== null) {
          toast.dismiss(toastIdRef.current);
          toastIdRef.current = null;
        }
        if (buildingNameToastIdRef.current !== null) {
          toast.dismiss(buildingNameToastIdRef.current);
          buildingNameToastIdRef.current = null;
        }
      };
    } else {
      // Dismiss toasts when not near building
      if (toastIdRef.current !== null) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
      if (buildingNameToastIdRef.current !== null) {
        toast.dismiss(buildingNameToastIdRef.current);
        buildingNameToastIdRef.current = null;
      }
    }

    return () => {
      if (toastIdRef.current !== null) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
      if (buildingNameToastIdRef.current !== null) {
        toast.dismiss(buildingNameToastIdRef.current);
        buildingNameToastIdRef.current = null;
      }
    };
  }, [nearBuilding, isMobile]);

  return (
    <div className="w-full h-[85vh] bg-black text-white jobs-container relative overflow-hidden flex flex-col items-center justify-center">
      {/* Canvas Container with relative positioning for dialogs */}
      <div
        className={`relative w-full mx-auto flex flex-col items-center gap-4 ${isMobile ? "max-w-full" : "max-w-5xl"
          }`}
      >
        {/* Modal popup (trigger zones, etc.) */}
        {activeModal && (
          <div className="absolute inset-0 z-140 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setActiveModal(null)}
            />
            <div className="relative bg-gray-900 border-4 border-emerald-500 p-16 max-w-sm w-full pointer-events-auto">
              <button
                type="button"
                aria-label="Close"
                onClick={() => setActiveModal(null)}
                className="absolute top-2 right-2 w-9 h-9 flex items-center justify-center bg-gray-800 border-2 border-emerald-500/60 text-emerald-200 font-bold hover:bg-emerald-500/10 transition-all"
              >
                X
              </button>

              <h2 className="text-lg text-emerald-300 font-bold mb-3 text-center">
                {activeModal.title ?? "Notice"}
              </h2>
              <p className="text-gray-200 text-center mb-6">
                {activeModal.body}
              </p>
              <div className="flex justify-center gap-3">
                {activeModal.actions?.length ? (
                  activeModal.actions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => {
                        const target =
                          action.newTab === false ? "_self" : "_blank";
                        window.open(action.href, target, "noopener,noreferrer");
                        setActiveModal(null);
                      }}
                      className="px-6 py-2 bg-emerald-900/40 border-2 border-emerald-500 text-emerald-200 font-bold uppercase tracking-wider hover:bg-emerald-500/20 transition-all"
                    >
                      {action.label}
                    </button>
                  ))
                ) : (
                  <>
                    {activeModal.cancelText && (
                      <button
                        onClick={() => {
                          try {
                            activeModal.onCancel?.();
                          } finally {
                            setActiveModal(null);
                          }
                        }}
                        className="px-6 py-2 bg-gray-700 border-2 border-gray-500 text-gray-200 font-bold uppercase tracking-wider hover:bg-gray-600 hover:border-gray-400 transition-all"
                      >
                        {activeModal.cancelText}
                      </button>
                    )}
                    {activeModal.confirmText && (
                      <button
                        onClick={() => {
                          try {
                            activeModal.onConfirm?.();
                          } finally {
                            setActiveModal(null);
                          }
                        }}
                        className="px-6 py-2 bg-emerald-900/40 border-2 border-emerald-500 text-emerald-200 font-bold uppercase tracking-wider hover:bg-emerald-500/20 transition-all"
                      >
                        {activeModal.confirmText}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {showDebugHud && debugHud && (
          <div className="absolute top-2 left-2 z-120 pointer-events-none">
            <div className="bg-black/80 border border-emerald-400/60 text-emerald-200 font-mono text-xs px-3 py-2 rounded">
              <div>
                <span className="text-emerald-400">pos</span> x:
                {debugHud.x.toFixed(1)} y:{debugHud.y.toFixed(1)}
              </div>
              <div>
                <span className="text-emerald-400">tile</span> x:
                {debugHud.tileX} y:{debugHud.tileY}
              </div>
              <div>
                <span className="text-emerald-400">dir</span>{" "}
                {debugHud.direction}{" "}
                <span className="text-emerald-400">moving</span>{" "}
                {debugHud.isMoving ? "1" : "0"}
              </div>
            </div>
          </div>
        )}
        <div
          className="relative w-full border-4 border-gray-700 canvas-container max-w-[100vw] max-h-[100vh] lg:max-w-[85vw] lg:max-h-[85vw]"
          style={{ aspectRatio: `${MAP_WIDTH}/${MAP_HEIGHT}` }}
        >
          <canvas
            ref={canvasRef}
            width={MAP_WIDTH * TILE_SIZE}
            height={MAP_HEIGHT * TILE_SIZE}
            className="block w-full h-full"
            style={{
              imageRendering: "pixelated",
            }}
          />
        </div>

        {/* Control Legend - Desktop only, below canvas */}
        <div className="absolute bottom-2 left-2">
          <ControlLegend isMobile={isMobile} />
        </div>
      </div>

      {/* Mobile Controls - Fixed at bottom of screen */}
      {isMobile && (
        <div
          className={`fixed bottom-0 left-0 right-0 w-full flex items-center px-4 pb-6 pointer-events-none ${canCloseDialog ? "z-50" : "z-30"
            }`}
        >
          <MobileControls
            onDirectionChange={handleDirectionInput}
            onInteract={() => {
              if (nearBuilding) {
                playClickSound();
                onBuildingEnter(nearBuilding.route);
              }
            }}
            canInteract={!!nearBuilding}
            onClose={onCloseDialog}
            canClose={canCloseDialog}
          />
        </div>
      )}
    </div>
  );
};
