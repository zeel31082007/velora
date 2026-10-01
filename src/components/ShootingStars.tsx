"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface ShootingStar {
  id: number;
  top: number;
  left: number;
  duration: number;
  delay: number;
}

const MIN_INTERVAL = 10_000;
const MAX_INTERVAL = 20_000;

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export default function ShootingStars() {
  const [stars, setStars] = useState<ShootingStar[]>([]);
  const idCounter = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const spawnStar = useCallback(() => {
    const id = ++idCounter.current;
    const star: ShootingStar = {
      id,
      top: randomBetween(5, 45),
      left: randomBetween(10, 80),
      duration: randomBetween(0.9, 1.4),
      delay: randomBetween(0, 0.3),
    };

    setStars((prev) => [...prev, star]);

    setTimeout(() => {
      setStars((prev) => prev.filter((s) => s.id !== id));
    }, (star.duration + star.delay) * 1000 + 100);
  }, []);

  const scheduleNext = useCallback(() => {
    const delay = randomBetween(MIN_INTERVAL, MAX_INTERVAL);
    timeoutRef.current = setTimeout(() => {
      spawnStar();
      scheduleNext();
    }, delay);
  }, [spawnStar]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const initialDelay = randomBetween(3000, 8000);
    timeoutRef.current = setTimeout(() => {
      spawnStar();
      scheduleNext();
    }, initialDelay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [spawnStar, scheduleNext]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[6] overflow-hidden" aria-hidden="true">
      {stars.map((star) => (
        <div
          key={star.id}
          className="shooting-star absolute h-px w-24"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
