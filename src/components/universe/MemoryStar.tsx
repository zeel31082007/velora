"use client";

import type { CSSProperties } from "react";
import type { StarData } from "@/lib/generateStars";

interface MemoryStarProps {
  star: StarData;
  onSelect: () => void;
  isMemoryStar?: boolean;
  category?: string;
  className?: string;
}

function cssValue(
  value: number,
  unit: string,
  digits = 4,
): string {
  return `${value.toFixed(digits)}${unit}`;
}

export default function MemoryStar({
  star,
  onSelect,
  isMemoryStar = false,
  category,
  className = "",
}: MemoryStarProps) {
  const left = cssValue(
    star.x,
    "%",
  );

  const top = cssValue(
    star.y,
    "%",
  );

  const size = cssValue(
    star.size,
    "px",
  );

  const animationDelay =
    cssValue(
      star.twinkleDelay,
      "s",
    );

  const animationDuration =
    cssValue(
      isMemoryStar
        ? 2.2
        : star.twinkleDuration,
      "s",
    );

  const depth =
    star.depth.toFixed(4);

  const categoryClass =
    category === "achievement"
      ? "memory-star-achievement"
      : category === "adventure"
        ? "memory-star-adventure"
        : category === "family"
          ? "memory-star-family"
          : category === "celebration"
            ? "memory-star-celebration"
            : category === "growth"
              ? "memory-star-growth"
              : category === "reflection"
                ? "memory-star-reflection"
                : "memory-star-milestone";

  return (
    <button
      type="button"
      aria-label={
        isMemoryStar
          ? "View memory"
          : "Background star"
      }
      onClick={onSelect}
      className={`universe-star absolute rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50 ${
        isMemoryStar
          ? `memory-star z-10 ${categoryClass} ${className}`
          : "opacity-70"
      }`}
      style={
        {
          left,
          top,
          width: size,
          height: size,
          animationDelay,
          animationDuration,
          "--star-depth": depth,
        } as CSSProperties & {
          "--star-depth": string;
        }
      }
    />
  );
}