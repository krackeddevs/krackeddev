import { TILE_EMPTY, TILE_GRAVEL, TILE_PAVEMENT, TILE_TREE, TILE_WALL, MAP_WIDTH, MAP_HEIGHT } from './constants';

/**
 * Adds variety to ground tiles (grass, gravel, pavement)
 */
export function addGroundVariety(map: number[][]): void {
  for (let y = 1; y < MAP_HEIGHT - 1; y++) {
    for (let x = 1; x < MAP_WIDTH - 1; x++) {
      // Skip if it's a wall or already a special tile
      if (map[y][x] === TILE_WALL || map[y][x] !== TILE_EMPTY) {
        continue;
      }
      
      const rand = Math.random();
      if (rand < 0.15) {
        map[y][x] = TILE_GRAVEL;
      } else if (rand < 0.25) {
        map[y][x] = TILE_PAVEMENT;
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

