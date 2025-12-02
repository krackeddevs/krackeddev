import { TILE_EMPTY, TILE_GRAVEL, TILE_PAVEMENT, TILE_TREE, TILE_WALL, MAP_WIDTH, MAP_HEIGHT } from './constants';

/**
 * Gets the entrance point of a building (front/bottom center)
 */
function getBuildingEntrance(positions: Array<{ x: number; y: number }>): { x: number; y: number } | null {
  if (positions.length === 0) return null;
  
  // Find the bottom-most row (highest y value)
  const maxY = Math.max(...positions.map(p => p.y));
  const bottomRow = positions.filter(p => p.y === maxY);
  
  // Get the center x of the bottom row
  const xs = bottomRow.map(p => p.x).sort((a, b) => a - b);
  const centerX = xs[Math.floor(xs.length / 2)];
  
  return { x: centerX, y: maxY + 1 }; // Entrance is one tile below the building
}

/**
 * Draws a horizontal or vertical path between two points
 */
function drawPath(map: number[][], x1: number, y1: number, x2: number, y2: number, tileType: number = TILE_PAVEMENT): void {
  // Draw horizontal path first
  const startX = Math.min(x1, x2);
  const endX = Math.max(x1, x2);
  for (let x = startX; x <= endX; x++) {
    if (x >= 1 && x < MAP_WIDTH - 1 && y1 >= 1 && y1 < MAP_HEIGHT - 1) {
      if (map[y1][x] === TILE_EMPTY || map[y1][x] === TILE_GRAVEL) {
        map[y1][x] = tileType;
      }
    }
  }
  
  // Draw vertical path
  const startY = Math.min(y1, y2);
  const endY = Math.max(y1, y2);
  for (let y = startY; y <= endY; y++) {
    if (x2 >= 1 && x2 < MAP_WIDTH - 1 && y >= 1 && y < MAP_HEIGHT - 1) {
      if (map[y][x2] === TILE_EMPTY || map[y][x2] === TILE_GRAVEL) {
        map[y][x2] = tileType;
      }
    }
  }
}

/**
 * Connects buildings with roads/paths
 */
export function connectBuildingsWithRoads(
  map: number[][],
  buildingPositions: Array<Array<{ x: number; y: number }>>
): void {
  const entrances = buildingPositions
    .map(positions => getBuildingEntrance(positions))
    .filter((entrance): entrance is { x: number; y: number } => entrance !== null);
  
  if (entrances.length < 2) return;
  
  // Find a central hub point (center of map)
  const centerX = Math.floor(MAP_WIDTH / 2);
  const centerY = Math.floor(MAP_HEIGHT / 2);
  
  // Connect each building entrance to the center hub
  entrances.forEach(entrance => {
    drawPath(map, entrance.x, entrance.y, centerX, entrance.y);
    drawPath(map, centerX, entrance.y, centerX, centerY);
  });
  
  // Also connect adjacent buildings directly
  for (let i = 0; i < entrances.length; i++) {
    for (let j = i + 1; j < entrances.length; j++) {
      const e1 = entrances[i];
      const e2 = entrances[j];
      const distance = Math.abs(e1.x - e2.x) + Math.abs(e1.y - e2.y);
      
      // Connect nearby buildings directly (within reasonable distance)
      if (distance < 8) {
        drawPath(map, e1.x, e1.y, e2.x, e2.y);
      }
    }
  }
}

/**
 * Adds variety to ground tiles (grass, gravel, pavement)
 * Now runs AFTER roads are placed to avoid overwriting them
 */
export function addGroundVariety(map: number[][]): void {
  for (let y = 1; y < MAP_HEIGHT - 1; y++) {
    for (let x = 1; x < MAP_WIDTH - 1; x++) {
      // Skip if it's a wall, building, tree, or already a path
      if (map[y][x] === TILE_WALL || map[y][x] !== TILE_EMPTY) {
        continue;
      }
      
      const rand = Math.random();
      if (rand < 0.1) {
        map[y][x] = TILE_GRAVEL;
      }
      // Otherwise keep as TILE_EMPTY (grass)
    }
  }
}

/**
 * Adds trees to the map, avoiding building positions
 */
export function addTrees(map: number[][], avoidPositions: Array<{ x: number; y: number }> = []): void {
  const treePositions = [
    { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 4, y: 1 },
    { x: MAP_WIDTH - 2, y: 1 }, { x: MAP_WIDTH - 3, y: 1 },
    { x: 1, y: MAP_HEIGHT - 2 }, { x: 2, y: MAP_HEIGHT - 2 },
    { x: MAP_WIDTH - 2, y: MAP_HEIGHT - 2 }, { x: MAP_WIDTH - 3, y: MAP_HEIGHT - 2 },
    { x: 6, y: 1 }, { x: 8, y: 1 },
    { x: 1, y: 4 }, { x: MAP_WIDTH - 2, y: 4 },
    { x: 4, y: 6 }, { x: MAP_WIDTH - 5, y: 6 },
    { x: 10, y: 3 }, { x: 5, y: 7 },
  ];
  
  treePositions.forEach(pos => {
    // Check if position is valid and not a building
    const isBuilding = avoidPositions.some(bp => bp.x === pos.x && bp.y === pos.y);
    if (!isBuilding && map[pos.y] && map[pos.y][pos.x] !== TILE_WALL && map[pos.y][pos.x] < 2) {
      map[pos.y][pos.x] = TILE_TREE;
    }
  });
}

