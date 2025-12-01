// Character sprite loader
export const spriteCache: Map<string, HTMLImageElement> = new Map();

export function loadSprite(src: string): Promise<HTMLImageElement> {
  if (spriteCache.has(src)) {
    return Promise.resolve(spriteCache.get(src)!);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      spriteCache.set(src, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
}

// Preload all character sprites
export async function preloadCharacterSprites(): Promise<void> {
  const spritePaths = [
    '/sprites/character/S1.png',
    '/sprites/character/S2.png',
    '/sprites/character/S3.png',
    '/sprites/character/S4.png',
    '/sprites/character/W1.png',
    '/sprites/character/W2.png',
    '/sprites/character/W3.png',
    '/sprites/character/W4.png',
    '/sprites/character/A1.png',
    '/sprites/character/A2.png',
    '/sprites/character/A3.png',
    '/sprites/character/A4.png',
    '/sprites/character/D1.png',
    '/sprites/character/D2.png',
    '/sprites/character/D3.png',
    '/sprites/character/D4.png',
    '/sprites/character/botak1.png',
  ];

  await Promise.all(spritePaths.map(loadSprite));
}

// Get sprite path for direction and frame
export function getCharacterSpritePath(direction: number, frame: number): string {
  // Cycle through frames 1-4 based on frame count
  // Slow down animation by dividing frame by animation speed
  const animFrame = Math.floor(frame / 4) % 4;
  const frameIndex = animFrame + 1; // Convert 0-3 to 1-4
  const directionMap = ['S', 'W', 'A', 'D']; // Down, Up, Left, Right
  return `/sprites/character/${directionMap[direction]}${frameIndex}.png`;
}

