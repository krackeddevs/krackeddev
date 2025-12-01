import { TILE_SIZE, TILE_WALL, MAP_WIDTH, MAP_HEIGHT } from './constants';

// Check if position is walkable
export function isWalkable(
  x: number,
  y: number,
  map: number[][],
  padding: number = 10
): boolean {
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
    pos => pos.x === playerTileX && pos.y === playerTileY
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
    pos => pos.x === playerTileX && pos.y === playerTileY
  );
}

