import {
  TILE_SIZE,
  TILE_WALL,
  TILE_TREE,
  MAP_WIDTH,
  MAP_HEIGHT,
} from "./constants";

export type WalkableRect = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

function isPointInRect(x: number, y: number, rect: WalkableRect): boolean {
  const left = Math.min(rect.x1, rect.x2);
  const right = Math.max(rect.x1, rect.x2);
  const top = Math.min(rect.y1, rect.y2);
  const bottom = Math.max(rect.y1, rect.y2);
  return x >= left && x <= right && y >= top && y <= bottom;
}

// Check if position is walkable
export function isWalkable(
  x: number,
  y: number,
  map: number[][],
  padding: number = 10,
  walkableRects: WalkableRect[] = []
): boolean {
  const corners = [
    { x: x - padding, y: y - padding },
    { x: x + padding, y: y - padding },
    { x: x - padding, y: y + padding },
    { x: x + padding, y: y + padding },
  ];

  for (const corner of corners) {
    // Pixel-level override: if this corner is inside any walkable rectangle,
    // treat it as walkable even if the underlying tile is a wall/tree.
    if (walkableRects.some((r) => isPointInRect(corner.x, corner.y, r))) {
      continue;
    }

    const tileX = Math.floor(corner.x / TILE_SIZE);
    const tileY = Math.floor(corner.y / TILE_SIZE);

    if (tileX < 0 || tileX >= MAP_WIDTH || tileY < 0 || tileY >= MAP_HEIGHT) {
      return false;
    }

    const tile = map[tileY]?.[tileX];
    // Block walls and trees, allow all other tiles
    if (tile === TILE_WALL || tile === TILE_TREE) {
      return false;
    }
  }

  return true;
}

// Check if player is near a building (for interaction)
// Only returns true if player is directly standing on a building tile
export function isNearBuilding(
  playerX: number,
  playerY: number,
  buildingPositions: { x: number; y: number }[],
  interactionRadius: number = TILE_SIZE * 1.5
): boolean {
  const playerTileX = Math.floor(playerX / TILE_SIZE);
  const playerTileY = Math.floor(playerY / TILE_SIZE);

  // Only check if player is standing on any building tile (no proximity check)
  return buildingPositions.some(
    (pos) => pos.x === playerTileX && pos.y === playerTileY
  );
}

// Check if player is standing on any tile of a building
export function isOnBuildingTile(
  playerX: number,
  playerY: number,
  buildingPositions: { x: number; y: number }[]
): boolean {
  const playerTileX = Math.floor(playerX / TILE_SIZE);
  const playerTileY = Math.floor(playerY / TILE_SIZE);

  return buildingPositions.some(
    (pos) => pos.x === playerTileX && pos.y === playerTileY
  );
}
