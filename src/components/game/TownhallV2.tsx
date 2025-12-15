"use client";

import React, { useMemo } from "react";
import { BaseGameWorld } from "@/components/game/BaseGameWorld";
import {
  MAP_HEIGHT,
  MAP_WIDTH,
  TILE_EMPTY,
  TILE_WALL,
} from "@/lib/game/constants";
import type { BuildingConfig } from "@/lib/game/types";

export function TownhallV2() {
  const map = useMemo(() => {
    const newMap: number[][] = [];

    for (let y = 0; y < MAP_HEIGHT; y++) {
      const row: number[] = [];
      for (let x = 0; x < MAP_WIDTH; x++) {
        // Default: border walls all around (including top)
        const isBorder =
          x === 0 || x === MAP_WIDTH - 1 || y === 0 || y === MAP_HEIGHT - 1;
        row.push(isBorder ? TILE_WALL : TILE_EMPTY);
      }
      newMap.push(row);
    }

    return newMap;
  }, []);

  const buildings: BuildingConfig[] = useMemo(() => [], []);

  const savePointA = useMemo(
    () => ({
      x1: 640,
      x2: 780,
      y1: 130,
      y2: 10,
    }),
    []
  );

  const savePointB = useMemo(
    () => ({
      x1: 135,
      x2: 22.5,
      y1: 400,
      y2: 550,
    }),
    []
  );

  const savePointC = useMemo(
    () => ({
      x1: 1665,
      x2: 1777.5,
      y1: 765,
      y2: 900,
    }),
    []
  );

  const savePointD = useMemo(
    () => ({
      x1: 1275,
      x2: 1400,
      y1: 135,
      y2: 240,
    }),
    []
  );

  const savePointE = useMemo(
    () => ({
      x1: 375,
      x2: 500,
      y1: 350,
      y2: 180,
    }),
    []
  );

  return (
    <BaseGameWorld
      map={map}
      buildings={buildings}
      onBuildingEnter={() => {}}
      backgroundImagePath="/map/townhall.png"
      backgroundFit="cover"
      showDebugHud
      walkableRectangles={[savePointA, savePointB, savePointC]}
      triggerZones={[
        {
          id: "save-point-a",
          rect: savePointA,
          message: "reached save point A",
          once: false,
        },
        {
          id: "save-point-b",
          rect: savePointB,
          message: "reached save point B",
          once: false,
        },
        {
          id: "save-point-c",
          rect: savePointC,
          message: "reached save point C",
          once: false,
        },
        {
          id: "save-point-d",
          rect: savePointD,
          message: "reached save point D",
          once: false,
        },
        {
          id: "save-point-e",
          rect: savePointE,
          message: "reached save point E",
          once: false,
        },
      ]}
    />
  );
}
