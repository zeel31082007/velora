"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import type { Memory } from "@/types/memory";

interface MemoryTimelineProps {
  memories: Memory[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}

export default function MemoryTimeline({
  memories,
  selectedDate,
  onSelectDate,
}: MemoryTimelineProps) {
  const [isTraveling, setIsTraveling] = useState(false);
  useEffect(() => {
  if (selectedDate === null) {
    setIsTraveling(false);
    return;
  }

  setIsTraveling(true);

  const timer = window.setTimeout(() => {
    setIsTraveling(false);
  }, 700);

  return () => window.clearTimeout(timer);
}, [selectedDate]);
  if (memories.length === 0) {
    return null;
  }

  const sortedMemories = [...memories].sort(
    (a, b) =>
      new Date(a.date).getTime() -
      new Date(b.date).getTime(),
  );

  const years = Array.from(
    new Set(
      sortedMemories.map((memory) =>
        new Date(memory.date).getFullYear(),
      ),
    ),
  ).sort((a, b) => a - b);

  if (years.length === 0) {
    return null;
  }

  const selectedYearIndex =
    selectedDate === null
      ? years.length - 1
      : Math.max(
          0,
          years.indexOf(Number(selectedDate)),
        );

  const activeYear = years[selectedYearIndex];

  const activeYearMemories = sortedMemories.filter(
    (memory) =>
      new Date(memory.date).getFullYear() ===
      activeYear,
  );

  const firstYear = years[0];
  const lastYear = years[years.length - 1];

  const isPresent =
    selectedDate === null ||
    selectedYearIndex === years.length - 1;

  const isBeginning =
    selectedYearIndex === 0;

  const progress =
    years.length <= 1
      ? 100
      : (selectedYearIndex /
          (years.length - 1)) *
        100;

  const handleSliderChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const index = Number(event.target.value);
    const year = years[index];

    if (year !== undefined) {
      onSelectDate(String(year));
    }
  };

  const handlePrevious = () => {
    if (isBeginning) {
      return;
    }

    const previousYear =
      years[selectedYearIndex - 1];

    if (previousYear !== undefined) {
      onSelectDate(String(previousYear));
    }
  };

  const handleNext = () => {
    if (isPresent) {
      return;
    }

    const nextYear =
      years[selectedYearIndex + 1];

    if (nextYear !== undefined) {
      onSelectDate(String(nextYear));
    }
  };

 return (
  <div
  className={`relative mt-14 transition-all duration-700 ${
      isTraveling
        ? "scale-[0.99] opacity-60 blur-[1px]"
        : "scale-100 opacity-100 blur-0"
    }`}
  >
      {/* ───────────────── HEADER ───────────────── */}
      {isTraveling && (
  <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center">
    <div className="rounded-full border border-violet-300/20 bg-violet-950/40 px-5 py-2 text-[9px] uppercase tracking-[0.35em] text-violet-200/70 shadow-[0_0_30px_rgba(139,92,246,0.2)] backdrop-blur-md">
      Traveling through time
    </div>
  </div>
)}

      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-violet-400/30" />

            <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-violet-300/50">
              Time Travel
            </p>
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <h3 className="font-display text-3xl font-light tracking-[0.12em] text-white">
              {activeYear}
            </h3>

            {isPresent && (
              <span className="text-[9px] uppercase tracking-[0.3em] text-violet-300/40">
                Present
              </span>
            )}
          </div>
        </div>

        <div className="text-right">
          <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-600">
            {activeYearMemories.length}{" "}
            {activeYearMemories.length === 1
              ? "memory"
              : "memories"}
          </p>

          <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-zinc-700">
            {selectedYearIndex + 1} /{" "}
            {years.length}
          </p>
        </div>
      </div>

      {/* ───────────────── TRAVEL STATUS ───────────────── */}

      <div className="mt-7 overflow-hidden rounded-2xl border border-violet-400/10 bg-violet-950/[0.08]">
        <div className="relative px-5 py-4">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(139,92,246,0.12), transparent 65%)",
            }}
          />

          <div className="relative flex items-center justify-between gap-4">
            <div>
              <p className="text-[8px] uppercase tracking-[0.3em] text-zinc-600">
                Traveling through
              </p>

              <p className="mt-1 font-display text-base tracking-[0.08em] text-violet-200/80">
                {activeYear}
              </p>
            </div>

            <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.25em] text-violet-300/40">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isPresent
                    ? "bg-violet-300 shadow-[0_0_10px_rgba(167,139,250,0.9)]"
                    : "bg-violet-400/50"
                }`}
              />

              {isPresent
                ? "Present"
                : "Past"}
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────── SLIDER ───────────────── */}

      <div className="mt-8">
        <div className="relative px-2">
          {/* Progress glow */}

          <div className="pointer-events-none absolute left-2 right-2 top-1/2 h-px -translate-y-1/2 overflow-hidden rounded-full bg-violet-400/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500/50 via-violet-300/60 to-violet-200/30 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <input
            type="range"
            min="0"
            max={Math.max(years.length - 1, 0)}
            step="1"
            value={selectedYearIndex}
            onChange={handleSliderChange}
            aria-label="Travel through memory years"
            className="memory-timeline-slider relative z-10 w-full"
          />
        </div>

        {/* Year markers */}

        <div className="mt-4 flex justify-between gap-2 px-1">
          {years.map((year, index) => {
            const isActive =
              index === selectedYearIndex;

            const isPast =
              index < selectedYearIndex;

            return (
              <button
                key={year}
                type="button"
                onClick={() =>
                  onSelectDate(String(year))
                }
                aria-label={`Travel to ${year}`}
                className={`group relative min-w-0 transition-all duration-500 ${
                  isActive
                    ? "text-white"
                    : "text-zinc-700 hover:text-zinc-400"
                }`}
              >
                <span
                  className={`block font-display text-[11px] tracking-[0.1em] transition-all duration-500 ${
                    isActive
                      ? "scale-110 text-violet-200"
                      : isPast
                        ? "text-violet-300/30"
                        : ""
                  }`}
                >
                  {year}
                </span>

                <span
                  className={`mx-auto mt-2 block rounded-full transition-all duration-500 ${
                    isActive
                      ? "h-1.5 w-1.5 bg-violet-200 shadow-[0_0_12px_3px_rgba(167,139,250,0.65)]"
                      : isPast
                        ? "h-1 w-1 bg-violet-400/30"
                        : "h-1 w-1 bg-zinc-700 group-hover:bg-violet-400/60"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* ───────────────── CONTROLS ───────────────── */}

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={isBeginning}
          className="rounded-full border border-white/5 px-4 py-2 text-[9px] uppercase tracking-[0.2em] text-zinc-500 transition-all duration-300 hover:border-violet-400/20 hover:bg-violet-400/[0.04] hover:text-violet-200 disabled:cursor-not-allowed disabled:opacity-20"
        >
          ← Previous
        </button>

        <button
          type="button"
          onClick={() =>
            onSelectDate(null)
          }
          className={`relative px-4 py-2 text-[9px] uppercase tracking-[0.28em] transition-all duration-300 ${
            isPresent
              ? "text-violet-300/80"
              : "text-zinc-600 hover:text-white"
          }`}
        >
          {isPresent
            ? "Present"
            : "Return to Present"}

          {isPresent && (
            <span className="absolute -bottom-1 left-1/2 h-px w-8 -translate-x-1/2 bg-violet-400/40" />
          )}
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={isPresent}
          className="rounded-full border border-white/5 px-4 py-2 text-[9px] uppercase tracking-[0.2em] text-zinc-500 transition-all duration-300 hover:border-violet-400/20 hover:bg-violet-400/[0.04] hover:text-violet-200 disabled:cursor-not-allowed disabled:opacity-20"
        >
          Next →
        </button>
      </div>

      {/* ───────────────── MEMORY SUMMARY ───────────────── */}

      <div className="mt-8 overflow-hidden rounded-2xl border border-violet-400/5 bg-white/[0.015]">
        <div className="flex items-center justify-between gap-5 px-5 py-5">
          <div>
            <p className="text-[8px] uppercase tracking-[0.25em] text-zinc-700">
              Timeline
            </p>

            <p className="mt-1 text-[10px] tracking-[0.12em] text-zinc-500">
              {firstYear} — {lastYear}
            </p>
          </div>

          <div className="h-8 w-px bg-white/5" />

          <div>
            <p className="text-[8px] uppercase tracking-[0.25em] text-zinc-700">
              Current point
            </p>

            <p className="mt-1 font-display text-sm tracking-wide text-violet-200/70">
              {activeYear}
            </p>
          </div>

          <div className="h-8 w-px bg-white/5" />

          <div className="text-right">
            <p className="text-[8px] uppercase tracking-[0.25em] text-zinc-700">
              Universe
            </p>

            <p className="mt-1 text-xs text-zinc-400">
              {memories.length} total
            </p>
          </div>
        </div>
      </div>

      {/* ───────────────── CINEMATIC QUOTE ───────────────── */}

      <p className="mt-7 text-center font-display text-sm italic tracking-wide text-violet-200/30">
        {isPresent
          ? "You have arrived at the present."
          : `You are traveling through ${activeYear}.`}
      </p>
    </div>
  );
}