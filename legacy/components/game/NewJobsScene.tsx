"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { BaseGameWorld } from "./BaseGameWorld";
import {
  TILE_EMPTY,
  TILE_WALL,
  TILE_JOBS,
  TILE_BACK_TO_TOWN,
  MAP_WIDTH,
  MAP_HEIGHT,
} from "@/lib/game/constants";
import {
  addGroundVariety,
  addTrees,
  connectBuildingsWithRoads,
} from "@/lib/game/mapHelpers";
import { BuildingConfig } from "@/lib/game/types";

interface NewJobsSceneProps {
  onBack: () => void;
}

export const NewJobsScene: React.FC<NewJobsSceneProps> = ({ onBack }) => {
  const router = useRouter();

  // Generate map with jobs building
  const map = useMemo(() => {
    const newMap: number[][] = [];

    for (let y = 0; y < MAP_HEIGHT; y++) {
      const row: number[] = [];
      for (let x = 0; x < MAP_WIDTH; x++) {
        if (x === 0 || x === MAP_WIDTH - 1 || y === 0 || y === MAP_HEIGHT - 1) {
          row.push(TILE_WALL);
        } else {
          row.push(TILE_EMPTY);
        }
      }
      newMap.push(row);
    }

    // Place jobs building in center
    const centerX = Math.floor(MAP_WIDTH / 2);
    const centerY = Math.floor(MAP_HEIGHT / 2);
    newMap[centerY - 1][centerX - 1] = TILE_JOBS;
    newMap[centerY - 1][centerX] = TILE_JOBS;
    newMap[centerY][centerX - 1] = TILE_JOBS;
    newMap[centerY][centerX] = TILE_JOBS;

    // Place back to town building (bottom-left)
    newMap[MAP_HEIGHT - 2][1] = TILE_BACK_TO_TOWN;
    newMap[MAP_HEIGHT - 2][2] = TILE_BACK_TO_TOWN;
    newMap[MAP_HEIGHT - 3][1] = TILE_BACK_TO_TOWN;
    newMap[MAP_HEIGHT - 3][2] = TILE_BACK_TO_TOWN;

    // Connect buildings with roads
    const jobsCenterX = Math.floor(MAP_WIDTH / 2);
    const jobsCenterY = Math.floor(MAP_HEIGHT / 2);
    connectBuildingsWithRoads(newMap, [
      [
        { x: jobsCenterX - 1, y: jobsCenterY - 1 },
        { x: jobsCenterX, y: jobsCenterY - 1 },
        { x: jobsCenterX - 1, y: jobsCenterY },
        { x: jobsCenterX, y: jobsCenterY },
      ],
      [
        { x: 1, y: MAP_HEIGHT - 2 },
        { x: 2, y: MAP_HEIGHT - 2 },
        { x: 1, y: MAP_HEIGHT - 3 },
        { x: 2, y: MAP_HEIGHT - 3 },
      ],
    ]);

    // Add ground variety and trees
    addGroundVariety(newMap);
    addTrees(newMap, [
      { x: jobsCenterX - 1, y: jobsCenterY - 1 },
      { x: jobsCenterX, y: jobsCenterY - 1 },
      { x: jobsCenterX - 1, y: jobsCenterY },
      { x: jobsCenterX, y: jobsCenterY },
      { x: 1, y: MAP_HEIGHT - 2 },
      { x: 2, y: MAP_HEIGHT - 2 },
      { x: 1, y: MAP_HEIGHT - 3 },
      { x: 2, y: MAP_HEIGHT - 3 },
    ]);

    return newMap;
  }, []);

  const buildings: BuildingConfig[] = useMemo(
    () => [
      {
        id: "jobs-building",
        tileType: TILE_JOBS,
        positions: [
          {
            x: Math.floor(MAP_WIDTH / 2) - 1,
            y: Math.floor(MAP_HEIGHT / 2) - 1,
          },
          { x: Math.floor(MAP_WIDTH / 2), y: Math.floor(MAP_HEIGHT / 2) - 1 },
          { x: Math.floor(MAP_WIDTH / 2) - 1, y: Math.floor(MAP_HEIGHT / 2) },
          { x: Math.floor(MAP_WIDTH / 2), y: Math.floor(MAP_HEIGHT / 2) },
        ],
        label: "JOBS BOARD",
        customLabel: "JOBS\nBOARD",
        description: "View available tech jobs",
        route: "/jobs",
        color: "#3b82f6",
        colorDark: "#2563eb",
      },
      {
        id: "back-to-town",
        tileType: TILE_BACK_TO_TOWN,
        positions: [
          { x: 1, y: MAP_HEIGHT - 3 },
          { x: 2, y: MAP_HEIGHT - 3 },
          { x: 1, y: MAP_HEIGHT - 2 },
          { x: 2, y: MAP_HEIGHT - 2 },
        ],
        label: "BACK TO TOWN",
        customLabel: "BACK\nTO\nTOWN",
        description: "Return to the main town",
        route: "/",
        color: "#ef4444",
        colorDark: "#dc2626",
        autoNavigate: true,
      },
    ],
    []
  );

  const handleBuildingEnter = (route: string) => {
    if (route === "/") {
      onBack();
    } else if (route) {
      router.push(route);
    }
  };

  return (
    <div className="relative w-full h-screen">
      <BaseGameWorld
        map={map}
        buildings={buildings}
        onBuildingEnter={handleBuildingEnter}
        initialPlayerX={(MAP_WIDTH / 2) * 40}
        initialPlayerY={(MAP_HEIGHT / 2 + 2) * 40}
      />
    </div>
  );
};
