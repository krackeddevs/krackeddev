'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Zap, Trophy, Gamepad2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Tile = {
  id: number;
  value: number;
  x: number;
  y: number;
  mergedFrom?: number[];
};

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 4;
let nextTileId = 1;

export default function Game2048() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    initializeGame();
    const savedBest = localStorage.getItem('2048-best-score');
    if (savedBest) setBestScore(parseInt(savedBest));
  }, []);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('2048-best-score', score.toString());
    }
  }, [score, bestScore]);

  const initializeGame = () => {
    nextTileId = 1;
    const newTiles: Tile[] = [];
    addRandomTile(newTiles);
    addRandomTile(newTiles);
    setTiles(newTiles);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
  };

  const getGridMap = (currentTiles: Tile[]) => {
    const grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
    currentTiles.forEach(tile => {
      if (tile.x >= 0 && tile.x < GRID_SIZE && tile.y >= 0 && tile.y < GRID_SIZE) {
        grid[tile.y][tile.x] = tile;
      }
    });
    return grid;
  };

  const addRandomTile = (currentTiles: Tile[]) => {
    const grid = getGridMap(currentTiles);
    const emptyCells = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (!grid[r][c]) emptyCells.push({ x: c, y: r });
      }
    }

    if (emptyCells.length === 0) return;

    const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    currentTiles.push({
      id: nextTileId++,
      value: Math.random() < 0.9 ? 2 : 4,
      x,
      y
    });
  };

  const move = useCallback((direction: Direction) => {
    if (gameOver || (gameWon && !confirm('Keep playing?'))) return;

    setTiles(prevTiles => {
      let nextTiles = prevTiles.map(t => ({ ...t, mergedFrom: undefined }));
      let moved = false;
      let scoreAdd = 0;
      
      const vector = { x: 0, y: 0 };
      if (direction === 'LEFT') vector.x = -1;
      if (direction === 'RIGHT') vector.x = 1;
      if (direction === 'UP') vector.y = -1;
      if (direction === 'DOWN') vector.y = 1;

      const traversals = { x: [] as number[], y: [] as number[] };
      for (let i = 0; i < GRID_SIZE; i++) {
        traversals.x.push(i);
        traversals.y.push(i);
      }

      if (vector.x === 1) traversals.x = traversals.x.reverse();
      if (vector.y === 1) traversals.y = traversals.y.reverse();

      const grid: (Tile | null)[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
      
      nextTiles.forEach(tile => {
        grid[tile.y][tile.x] = tile;
      });

      traversals.y.forEach(y => {
        traversals.x.forEach(x => {
          const tile = grid[y][x];
          if (tile) {
            const cell = { x: tile.x, y: tile.y };
            let next = { x: cell.x + vector.x, y: cell.y + vector.y };
            
            while (
              next.x >= 0 && next.x < GRID_SIZE &&
              next.y >= 0 && next.y < GRID_SIZE &&
              !grid[next.y][next.x]
            ) {
              cell.x = next.x;
              cell.y = next.y;
              next = { x: cell.x + vector.x, y: cell.y + vector.y };
            }

            let nextTile = null;
            if (
              next.x >= 0 && next.x < GRID_SIZE &&
              next.y >= 0 && next.y < GRID_SIZE
            ) {
              nextTile = grid[next.y][next.x];
            }

            if (
              nextTile &&
              nextTile.value === tile.value &&
              !nextTile.mergedFrom
            ) {
              const mergedValue = tile.value * 2;
              
              tile.x = nextTile.x;
              tile.y = nextTile.y;
              tile.value = mergedValue;
              
              nextTiles = nextTiles.filter(t => t.id !== nextTile!.id);
              
              scoreAdd += mergedValue;
              if (mergedValue === 2048 && !gameWon) setGameWon(true);
              moved = true;
              
              grid[tile.y][tile.x] = tile; 
              
            } else {
              if (tile.x !== cell.x || tile.y !== cell.y) {
                 grid[tile.y][tile.x] = null;
                 
                 tile.x = cell.x;
                 tile.y = cell.y;
                 
                 grid[tile.y][tile.x] = tile;
                 moved = true;
              }
            }
          }
        });
      });

      if (moved) {
        addRandomTile(nextTiles);
        setScore(s => s + scoreAdd);
        return nextTiles;
      }
      return prevTiles;
    });
  }, [gameOver, gameWon]);
  
  useEffect(() => {
    if (tiles.length === 0) return;
    
    const grid = getGridMap(tiles);
    for(let r=0; r<GRID_SIZE; r++) {
      for(let c=0; c<GRID_SIZE; c++) {
        if(!grid[r][c]) return;
      }
    }
    
    for(let r=0; r<GRID_SIZE; r++) {
      for(let c=0; c<GRID_SIZE; c++) {
        const tile = grid[r][c];
        if(tile) {
          if(c < GRID_SIZE-1) {
             const right = grid[r][c+1];
             if(right && right.value === tile.value) return;
          }
          if(r < GRID_SIZE-1) {
             const down = grid[r+1][c];
             if(down && down.value === tile.value) return;
          }
        }
      }
    }
    
    setGameOver(true);
  }, [tiles]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      switch (e.key) {
        case 'ArrowUp': move('UP'); break;
        case 'ArrowDown': move('DOWN'); break;
        case 'ArrowLeft': move('LEFT'); break;
        case 'ArrowRight': move('RIGHT'); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  const getTileColor = (value: number) => {
    switch (value) {
      case 2: return 'bg-zinc-200 text-zinc-800';
      case 4: return 'bg-zinc-300 text-zinc-800';
      case 8: return 'bg-orange-300 text-white';
      case 16: return 'bg-orange-400 text-white';
      case 32: return 'bg-orange-500 text-white';
      case 64: return 'bg-orange-600 text-white';
      case 128: return 'bg-yellow-400 text-white shadow-[0_0_10px_rgba(250,204,21,0.5)]';
      case 256: return 'bg-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.6)]';
      case 512: return 'bg-yellow-600 text-white shadow-[0_0_20px_rgba(202,138,4,0.7)]';
      case 1024: return 'bg-yellow-700 text-white shadow-[0_0_25px_rgba(161,98,7,0.8)]';
      case 2048: return 'bg-amber-500 text-white shadow-[0_0_30px_rgba(245,158,11,1)] animate-pulse';
      default: return 'bg-zinc-800 text-zinc-800'; 
    }
  };

  const getTileSize = (value: number) => {
    if (value > 1000) return 'text-2xl';
    if (value > 100) return 'text-3xl';
    return 'text-4xl';
  };

  const backgroundCells = Array(16).fill(0);

  return (
    <main className="min-h-screen pb-20 bg-zinc-950 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-4 py-20 md:py-24 lg:py-32 max-w-6xl relative z-10">
        
        {/* Header - Full Width */}
        <div className="mb-10 md:mb-12 flex items-center justify-between">
          <Link href="/game" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Games</span>
          </Link>
          <div className="flex items-center gap-2 text-neon-secondary">
            <Zap className="w-5 h-5" />
            <span className="text-sm">Nabil - Game 7</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          
          {/* LEFT COLUMN - Game Board */}
          <div className="flex-1 w-full max-w-lg mx-auto lg:mx-0">
            <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-xl shadow-2xl overflow-hidden relative aspect-square">
              {(gameOver || gameWon) && (
                <div className="absolute inset-0 z-30 bg-zinc-950/80 flex flex-col items-center justify-center backdrop-blur-sm animate-in fade-in duration-300">
                  <h2 className={`text-5xl font-bold mb-4 ${gameWon ? 'text-emerald-400' : 'text-zinc-300'}`}>
                    {gameWon ? 'You Win!' : 'Game Over!'}
                  </h2>
                  <p className="text-zinc-400 mb-8 text-lg">Score: {score}</p>
                  <Button 
                    onClick={initializeGame} 
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-6 text-lg font-bold"
                  >
                    Play Again
                  </Button>
                </div>
              )}

              <CardContent className="p-4 md:p-6 h-full">
                  <style dangerouslySetInnerHTML={{__html: `
                    .tile-grid {
                      --gap: 0.75rem;
                    }
                    @media (min-width: 768px) {
                      .tile-grid {
                        --gap: 1rem;
                      }
                    }
                  `}} />
                  
                  <div className="relative bg-zinc-800/50 p-3 md:p-4 rounded-xl h-full w-full tile-grid">
                  <div className="grid grid-cols-4 gap-3 md:gap-4 w-full h-full absolute inset-0 p-3 md:p-4 z-0">
                    {backgroundCells.map((_, i) => (
                      <div 
                        key={i}
                        className="w-full h-full rounded-lg bg-zinc-800/50"
                      />
                    ))}
                  </div>

                  <div className="relative w-full h-full z-10">
                     {tiles.map((tile) => (
                       <div
                         key={tile.id}
                         className={`
                           absolute flex items-center justify-center font-bold rounded-lg transition-all duration-150 ease-in-out
                           ${getTileColor(tile.value)}
                         `}
                         style={{
                           width: 'calc((100% - (3 * var(--gap))) / 4)',
                           height: 'calc((100% - (3 * var(--gap))) / 4)',
                           transform: `translate(
                             calc(${tile.x} * (100% + var(--gap))), 
                             calc(${tile.y} * (100% + var(--gap)))
                           )`,
                           left: 0,
                           top: 0,
                         }}
                       >
                          <span className={`${getTileSize(tile.value)} animate-in zoom-in duration-200`}>
                            {tile.value}
                          </span>
                  </div>
                     ))}
                  </div>
                </div>
          </CardContent>
        </Card>

            {/* Mobile Controls - Only visible on mobile */}
            <div className="mt-8 grid grid-cols-3 gap-2 max-w-[200px] mx-auto lg:hidden">
              <div />
              <Button variant="outline" className="h-14 bg-zinc-900 border-zinc-800" onClick={() => move('UP')}>
                <ArrowLeft className="w-6 h-6 rotate-90" />
              </Button>
              <div />
              <Button variant="outline" className="h-14 bg-zinc-900 border-zinc-800" onClick={() => move('LEFT')}>
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <Button variant="outline" className="h-14 bg-zinc-900 border-zinc-800" onClick={() => move('DOWN')}>
                <ArrowLeft className="w-6 h-6 -rotate-90" />
              </Button>
              <Button variant="outline" className="h-14 bg-zinc-900 border-zinc-800" onClick={() => move('RIGHT')}>
                <ArrowLeft className="w-6 h-6 rotate-180" />
              </Button>
              </div>
              </div>

          {/* RIGHT COLUMN - Score & Controls */}
          <div className="w-full lg:w-80 space-y-6">
            
            {/* Title & Score Panel */}
            <Card className="border-white/10 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-md">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-4xl font-bold mb-2 text-white">2048</CardTitle>
                <p className="text-sm text-zinc-500">Join the tiles, get to 2048!</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-lg text-center">
                    <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Score</div>
                    <div className="text-2xl font-bold text-white">{score}</div>
              </div>
                  <div className="bg-zinc-900/80 border border-zinc-800 p-3 rounded-lg text-center">
                    <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Best</div>
                    <div className="text-2xl font-bold text-emerald-400">{bestScore}</div>
              </div>
            </div>
                
                <Button 
                  variant="outline" 
                  onClick={initializeGame}
                  className="w-full py-6 text-lg border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800 hover:text-emerald-400 transition-colors gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  New Game
                </Button>
              </CardContent>
            </Card>

            {/* How to Play Panel */}
            <Card className="border-white/10 bg-black/60 backdrop-blur-md">
              <CardHeader className="py-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  How to Play
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-4 text-sm text-zinc-400 space-y-2">
                <p>Use your <span className="text-white font-bold">arrow keys</span> to move the tiles.</p>
                <p>Tiles with the same number merge into one when they touch.</p>
                <p>Add them up to reach <span className="text-emerald-400 font-bold">2048!</span></p>
              </CardContent>
            </Card>

            {/* Controls Panel */}
             <Card className="border-white/10 bg-black/60 backdrop-blur-md hidden lg:block">
              <CardHeader className="py-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-neon-primary" />
                  Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                <div className="grid grid-cols-3 gap-2 max-w-[140px] mx-auto">
                  <div />
                  <div className="h-10 w-10 flex items-center justify-center bg-white/10 rounded border border-white/20">↑</div>
                  <div />
                  <div className="h-10 w-10 flex items-center justify-center bg-white/10 rounded border border-white/20">←</div>
                  <div className="h-10 w-10 flex items-center justify-center bg-white/10 rounded border border-white/20">↓</div>
                  <div className="h-10 w-10 flex items-center justify-center bg-white/10 rounded border border-white/20">→</div>
                </div>
          </CardContent>
        </Card>

          </div>
        </div>

      </div>
    </main>
  );
}
