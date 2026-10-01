export interface StarData {
  id: number;
  x: number;
  y: number;
  size: number;
  depth: number;
  twinkleDelay: number;
  twinkleDuration: number;
}

function seededRandom(seed: number): number {
  const value = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

export function generateStars(min = 40, max = 60): StarData[] {
  const count = min + Math.floor(seededRandom(1) * (max - min + 1));

  return Array.from({ length: count }, (_, id) => {
    const base = id + 1;
    return {
      id,
      x: seededRandom(base * 3) * 92 + 4,
      y: seededRandom(base * 7) * 88 + 6,
      size: seededRandom(base * 11) * 2.5 + 2,
      depth: seededRandom(base * 13) * 0.8 + 0.2,
      twinkleDelay: seededRandom(base * 17) * 4,
      twinkleDuration: seededRandom(base * 19) * 3 + 3,
    };
  });
}
