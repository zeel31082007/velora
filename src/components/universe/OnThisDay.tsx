"use client";

import type { Memory } from "@/types/memory";

interface OnThisDayProps {
  memories: Memory[];
  onSelectMemory: (memory: Memory) => void;
}

function getTodayMonthDay() {
  const today = new Date();

  return {
    month: String(today.getMonth() + 1).padStart(2, "0"),
    day: String(today.getDate()).padStart(2, "0"),
    year: today.getFullYear(),
  };
}

function getMemoryYear(date: string) {
  return Number(date.slice(0, 4));
}

function formatMemoryDate(date: string) {
  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getYearsAgo(
  memoryYear: number,
  currentYear: number,
) {
  const difference = currentYear - memoryYear;

  if (difference === 1) {
    return "1 year ago";
  }

  return `${difference} years ago`;
}

export default function OnThisDay({
  memories,
  onSelectMemory,
}: OnThisDayProps) {
  const today = getTodayMonthDay();

  const matchingMemories = memories
    .filter((memory) => {
      const [, month, day] =
        memory.date.split("-");

      const memoryYear =
        getMemoryYear(memory.date);

      return (
        month === today.month &&
        day === today.day &&
        memoryYear < today.year
      );
    })
    .sort(
      (a, b) =>
        getMemoryYear(b.date) -
        getMemoryYear(a.date),
    );

  if (matchingMemories.length === 0) {
    return null;
  }

  const formattedToday = new Date(
    today.year,
    Number(today.month) - 1,
    Number(today.day),
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return (
    <section className="relative z-20 mx-auto mb-10 w-full max-w-5xl">
      <div className="relative overflow-hidden rounded-3xl border border-violet-400/15 bg-[#08021c]/70 p-6 shadow-[0_0_80px_rgba(139,92,246,0.08)] backdrop-blur-xl sm:p-8">

        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-violet-600/10 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-indigo-600/10 blur-3xl"
          aria-hidden="true"
        />

        {/* Header */}
        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="text-xl text-violet-300">
              ✦
            </span>

            <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-violet-300/70">
              On This Day
            </p>
          </div>

          <h2 className="mt-3 font-display text-2xl font-light tracking-wide text-white sm:text-3xl">
            {formattedToday}
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Moments from your universe,
            remembered.
          </p>
        </div>

        {/* Memories */}
        <div className="relative mt-7 space-y-3">
          {matchingMemories.map((memory) => {
            const memoryYear =
              getMemoryYear(memory.date);

            return (
              <button
                key={memory.id}
                type="button"
                onClick={() =>
                  onSelectMemory(memory)
                }
                className="group relative block w-full overflow-hidden rounded-2xl border border-white/5 bg-white/[0.025] p-4 text-left transition duration-500 hover:border-violet-400/25 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(139,92,246,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50"
              >
                <div className="flex gap-4">

                  {/* Media */}
                  {(memory.image ||
                    memory.video) && (
                    <div className="hidden h-20 w-24 shrink-0 overflow-hidden rounded-xl border border-white/5 bg-black/30 sm:block">
                      {memory.image ? (
                        <img
                          src={memory.image}
                          alt=""
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <video
                          src={memory.video}
                          muted
                          playsInline
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-violet-400/15 bg-violet-400/[0.06] px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-violet-300/70">
                        {getYearsAgo(
                          memoryYear,
                          today.year,
                        )}
                      </span>

                      <span className="text-[10px] text-zinc-700">
                        {formatMemoryDate(
                          memory.date,
                        )}
                      </span>
                    </div>

                    <h3 className="mt-3 truncate text-base font-medium text-white">
                      {memory.title}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-500">
                      {memory.text}
                    </p>
                  </div>

                  {/* Open indicator */}
                  <div className="hidden items-center sm:flex">
                    <span className="text-lg text-violet-300/40 transition duration-500 group-hover:translate-x-1 group-hover:text-violet-200 group-hover:drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]">
                      →
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="relative mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-violet-400/20 to-transparent" />

          <p className="text-[9px] uppercase tracking-[0.25em] text-zinc-700">
            The story never ends
          </p>

          <div className="h-px flex-1 bg-gradient-to-l from-violet-400/20 to-transparent" />
        </div>
      </div>
    </section>
  );
}