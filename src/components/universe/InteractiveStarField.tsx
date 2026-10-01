"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CSSProperties } from "react";

import { generateStars } from "@/lib/generateStars";
import type { Memory } from "@/types/memory";

import MemoryModal from "./MemoryModal";
import MemoryStar from "./MemoryStar";

const CONSTELLATION_NAMES: Record<
  Memory["category"],
  string
> = {
  achievement: "RISE",
  adventure: "WANDER",
  family: "ROOTS",
  celebration: "SPARK",
  growth: "BECOMING",
  reflection: "ECHO",
  milestone: "CHAPTERS",
};

interface InteractiveStarFieldProps {
  memories: Memory[];
  selectedYear: string | null;
  selectedMemory: Memory | null;
  onDeleteMemory: (id: string) => Promise<void>;
  onUpdateMemory: (memory: Memory) => Promise<void>;
  onClearSelectedMemory: () => void;
}

interface ConstellationLine {
  from: number;
  to: number;
  category: Memory["category"];
}

export default function InteractiveStarField({
  memories,
  selectedYear,
  selectedMemory,
  onDeleteMemory,
  onUpdateMemory,
  onClearSelectedMemory,
}: InteractiveStarFieldProps) {
  const backgroundStars = useMemo(
    () => generateStars(),
    [],
  );

  const memoryStars = useMemo(() => {
    if (memories.length === 0) {
      return [];
    }

    const timestamps = memories.map((memory) =>
      new Date(memory.date).getTime(),
    );

    const minDate = Math.min(...timestamps);
    const maxDate = Math.max(...timestamps);

    return memories.map((memory, index) => {
      const timestamp = new Date(
        memory.date,
      ).getTime();

      const x =
        minDate === maxDate
          ? 50
          : 15 +
            ((timestamp - minDate) /
              (maxDate - minDate)) *
              70;

      const y =
        20 + ((index * 53) % 60);

      let size = 5;

      if (memory.importance === "low") {
        size = 4;
      }

      if (memory.importance === "important") {
        size = 7;
      }

      if (
        memory.importance ===
        "life-changing"
      ) {
        size = 9;
      }

      return {
        id: 1000 + index,
        x,
        y,
        size,
        depth: 1,
        twinkleDelay: index * 0.4,
        twinkleDuration: 3.5,
      };
    });
  }, [memories]);

  const constellationLines =
    useMemo<ConstellationLine[]>(
      () => {
        const lines: ConstellationLine[] =
          [];

        const categories: Memory["category"][] =
          [
            "achievement",
            "adventure",
            "family",
            "celebration",
            "growth",
            "reflection",
            "milestone",
          ];

        categories.forEach((category) => {
          const indexes = memories
            .map((memory, index) => ({
              memory,
              index,
            }))
            .filter(
              ({ memory }) =>
                memory.category === category,
            )
            .sort(
              (a, b) =>
                new Date(
                  a.memory.date,
                ).getTime() -
                new Date(
                  b.memory.date,
                ).getTime(),
            )
            .map(({ index }) => index);

          for (
            let i = 0;
            i < indexes.length - 1;
            i++
          ) {
            lines.push({
              from: indexes[i],
              to: indexes[i + 1],
              category,
            });
          }
        });

        return lines;
      },
      [memories],
    );

  const fieldRef =
    useRef<HTMLDivElement>(null);

  const target = useRef({
    x: 0,
    y: 0,
  });

  const current = useRef({
    x: 0,
    y: 0,
  });

  const rafId =
    useRef<number | null>(null);

  const [activeMemory, setActiveMemory] =
    useState<Memory | null>(null);

  const [isTraveling, setIsTraveling] =
    useState(false);

  const [cameraZoom, setCameraZoom] =
    useState(1);

  const [cameraX, setCameraX] =
    useState(0);

  const [cameraY, setCameraY] =
    useState(0);

  /*
   * CAMERA TARGET
   *
   * Finds the center of the selected year's
   * memories and moves the camera toward them.
   */
  const cameraTarget = useMemo(() => {
    if (!selectedYear) {
      return {
        x: 0,
        y: 0,
        zoom: 1,
      };
    }

    const targetStars = memories
      .map((memory, index) => ({
        memory,
        star: memoryStars[index],
      }))
      .filter(
        (
          item,
        ): item is {
          memory: Memory;
          star: NonNullable<
            (typeof memoryStars)[number]
          >;
        } =>
          item.memory.date.startsWith(
            selectedYear,
          ) &&
          Boolean(item.star),
      )
      .map(({ star }) => star);

    if (targetStars.length === 0) {
      return {
        x: 0,
        y: 0,
        zoom: 1,
      };
    }

    const centerX =
      targetStars.reduce(
        (sum, star) => sum + star.x,
        0,
      ) / targetStars.length;

    const centerY =
      targetStars.reduce(
        (sum, star) => sum + star.y,
        0,
      ) / targetStars.length;

    return {
      x: (50 - centerX) * 0.55,
      y: (50 - centerY) * 0.55,
      zoom: 1.16,
    };
  }, [
    memories,
    memoryStars,
    selectedYear,
  ]);

  /*
   * YEAR TRAVEL
   *
   * Moves the camera toward the selected year.
   */
  useEffect(() => {
    if (!selectedYear) {
      setIsTraveling(false);
      setCameraX(0);
      setCameraY(0);
      setCameraZoom(1);
      return;
    }

    setIsTraveling(true);

    setCameraX(cameraTarget.x);
    setCameraY(cameraTarget.y);
    setCameraZoom(cameraTarget.zoom);

    const timer = window.setTimeout(() => {
      setIsTraveling(false);
    }, 900);

    return () => {
      window.clearTimeout(timer);
    };
  }, [selectedYear, cameraTarget]);

  /*
   * OPEN MEMORY FROM OUTSIDE THE STAR FIELD
   */
  useEffect(() => {
    if (selectedMemory) {
      setActiveMemory(selectedMemory);
    }
  }, [selectedMemory]);

  const [
    hoveredCategory,
    setHoveredCategory,
  ] = useState<
    Memory["category"] | null
  >(null);

  const [
    selectedConstellation,
    setSelectedConstellation,
  ] = useState<
    Memory["category"] | null
  >(null);

  /*
   * ESCAPE KEY
   */
  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setSelectedConstellation(null);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, []);

  /*
   * PARALLAX
   */
  const tick = useCallback(() => {
    const lerp = 0.08;

    current.current.x +=
      (target.current.x -
        current.current.x) *
      lerp;

    current.current.y +=
      (target.current.y -
        current.current.y) *
      lerp;

    const element = fieldRef.current;

    if (element) {
      element.style.setProperty(
        "--parallax-x",
        `${current.current.x}px`,
      );

      element.style.setProperty(
        "--parallax-y",
        `${current.current.y}px`,
      );
    }

    rafId.current =
      requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const handleMouseMove = (
      event: globalThis.MouseEvent,
    ) => {
      const element = fieldRef.current;

      if (!element) {
        return;
      }

      const rect =
        element.getBoundingClientRect();

      const centerX =
        rect.left + rect.width / 2;

      const centerY =
        rect.top + rect.height / 2;

      const relativeX =
        (event.clientX - centerX) /
        (rect.width / 2);

      const relativeY =
        (event.clientY - centerY) /
        (rect.height / 2);

      target.current = {
        x: relativeX * 18,
        y: relativeY * 14,
      };
    };

    rafId.current =
      requestAnimationFrame(tick);

    window.addEventListener(
      "mousemove",
      handleMouseMove,
      {
        passive: true,
      },
    );

    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(
          rafId.current,
        );
      }

      window.removeEventListener(
        "mousemove",
        handleMouseMove,
      );
    };
  }, [tick]);

  /*
   * MEMORIES INSIDE SELECTED CONSTELLATION
   */
  const selectedMemories = useMemo(() => {
    if (!selectedConstellation) {
      return [];
    }

    return memories
      .filter(
        (memory) =>
          memory.category ===
          selectedConstellation,
      )
      .sort(
        (a, b) =>
          new Date(a.date).getTime() -
          new Date(b.date).getTime(),
      );
  }, [
    memories,
    selectedConstellation,
  ]);

  const enterConstellation = (
    category: Memory["category"],
  ) => {
    setHoveredCategory(category);
    setSelectedConstellation(category);
  };

  return (
    <>
      <div
        ref={fieldRef}
        className={`universe-field relative mx-auto aspect-[16/10] w-full max-w-4xl overflow-hidden rounded-3xl border border-violet-400/10 bg-violet-950/10 shadow-[inset_0_0_80px_rgba(139,92,246,0.08)] backdrop-blur-sm sm:aspect-[16/9] ${
          hoveredCategory
            ? `constellation-hover-${hoveredCategory}`
            : ""
        } ${
          selectedConstellation
            ? `constellation-entry-active constellation-entry-${selectedConstellation}`
            : ""
        } ${
          isTraveling
            ? "time-traveling"
            : ""
        }`}
        style={{
          transform: `translate(${cameraX}px, ${cameraY}px) scale(${cameraZoom})`,
          transition:
            "transform 900ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.08)_0%,transparent_70%)]" />

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {constellationLines.map(
            (line, index) => {
              const fromStar =
                memoryStars[line.from];

              const toStar =
                memoryStars[line.to];

              if (
                !fromStar ||
                !toStar
              ) {
                return null;
              }

              const fromMemory =
                memories[line.from];

              const toMemory =
                memories[line.to];

              if (
                !fromMemory ||
                !toMemory
              ) {
                return null;
              }

              return (
                <line
                  key={`${fromMemory.id}-${toMemory.id}`}
                  x1={fromStar.x}
                  y1={fromStar.y}
                  x2={toStar.x}
                  y2={toStar.y}
                  pathLength={1}
                  className={`constellation-line constellation-${line.category}`}
                  style={
                    {
                      "--constellation-delay":
                        `${index * 0.25}s`,
                    } as CSSProperties
                  }
                />
              );
            },
          )}
        </svg>

        <div className="pointer-events-none absolute inset-0 z-20">
          {(
            Object.entries(
              CONSTELLATION_NAMES,
            ) as [
              Memory["category"],
              string,
            ][]
          ).map(
            ([category, name]) => {
              const categoryIndexes =
                memories
                  .map(
                    (
                      memory,
                      index,
                    ) => ({
                      memory,
                      index,
                    }),
                  )
                  .filter(
                    ({ memory }) =>
                      memory.category ===
                      category,
                  )
                  .map(
                    ({ index }) =>
                      index,
                  );

              if (
                categoryIndexes.length < 2
              ) {
                return null;
              }

              const stars =
                categoryIndexes
                  .map(
                    (index) =>
                      memoryStars[
                        index
                      ],
                  )
                  .filter(
                    (
                      star,
                    ): star is NonNullable<
                      typeof star
                    > =>
                      Boolean(star),
                  );

              if (
                stars.length < 2
              ) {
                return null;
              }

              const centerX =
                stars.reduce(
                  (
                    sum,
                    star,
                  ) =>
                    sum +
                    star.x,
                  0,
                ) /
                stars.length;

              const centerY =
                stars.reduce(
                  (
                    sum,
                    star,
                  ) =>
                    sum +
                    star.y,
                  0,
                ) /
                stars.length;

              /*
               * CATEGORY LABEL POSITIONS
               * DO NOT CHANGE — these were already
               * positioned correctly.
               */
              const LABEL_OFFSETS: Record<
                Memory["category"],
                { x: number; y: number }
              > = {
                achievement: {
                  x: -12,
                  y: -16,
                },
                adventure: {
                  x: -14,
                  y: 12,
                },
                family: {
                  x: 14,
                  y: -14,
                },
                celebration: {
                  x: 16,
                  y: 14,
                },
                growth: {
                  x: 16,
                  y: -4,
                },
                reflection: {
                  x: -16,
                  y: -4,
                },
                milestone: {
                  x: 0,
                  y: 18,
                },
              };

              const offset =
                LABEL_OFFSETS[
                  category
                ];

              const labelX =
                Math.min(
                  Math.max(
                    centerX +
                      offset.x,
                    10,
                  ),
                  90,
                );

              const labelY =
                Math.min(
                  Math.max(
                    centerY +
                      offset.y,
                    8,
                  ),
                  92,
                );

              return (
                <button
                  key={category}
                  type="button"
                  className={`constellation-label constellation-label-${category} ${
                    hoveredCategory ===
                    category
                      ? "constellation-label-active"
                      : ""
                  }`}
                  onMouseEnter={() =>
                    setHoveredCategory(
                      category,
                    )
                  }
                  onMouseLeave={() =>
                    setHoveredCategory(
                      null,
                    )
                  }
                  onClick={() =>
                    enterConstellation(
                      category,
                    )
                  }
                  style={
                    {
                      position:
                        "absolute",
                      left: `${labelX}%`,
                      top: `${labelY}%`,
                      transform:
                        "translate(calc(-50% + var(--parallax-x)), calc(-50% + var(--parallax-y)))",
                      whiteSpace:
                        "nowrap",
                      fontFamily:
                        "var(--font-display), serif",
                      fontSize:
                        "10px",
                      fontWeight:
                        500,
                      letterSpacing:
                        "0.28em",
                      background:
                        "transparent",
                      border: "none",
                      padding:
                        "6px 8px",
                      color:
                        "rgba(255, 255, 255, 0.6)",
                      textShadow:
                        "0 0 8px rgba(167, 139, 250, 0.6), 0 0 18px rgba(139, 92, 246, 0.35)",
                      cursor:
                        "pointer",
                      pointerEvents:
                        "auto",
                      transition:
                        "transform 0.35s ease, color 0.35s ease, opacity 0.35s ease",
                    } as CSSProperties
                  }
                >
                  {name}
                </button>
              );
            },
          )}
        </div>

        {backgroundStars.map(
          (star) => (
            <MemoryStar
              key={star.id}
              star={star}
              onSelect={() => {}}
            />
          ),
        )}

        {memoryStars.map(
          (star, index) => {
            const memory =
              memories[index];

            if (!memory) {
              return null;
            }

            const memoryYear =
              new Date(
                memory.date,
              )
                .getFullYear()
                .toString();

            const isTimeTravelActive =
              selectedYear !== null;

            const isTimeTravelTarget =
              selectedYear === memoryYear;

            const isConstellationTarget =
              selectedConstellation ===
              memory.category;

            let focusClass = "";

            if (
              selectedConstellation
            ) {
              focusClass =
                isConstellationTarget
                  ? "constellation-focus-target"
                  : "constellation-focus-distant";
            }

            if (isTimeTravelActive) {
              focusClass +=
                isTimeTravelTarget
                  ? " time-travel-target"
                  : " time-travel-distant";
            }

            return (
              <MemoryStar
                key={star.id}
                star={star}
                isMemoryStar
                category={
                  memory.category
                }
                className={
                  focusClass
                }
                onSelect={() => {
                  setActiveMemory(
                    memory,
                  );
                }}
              />
            );
          },
        )}

        {selectedConstellation && (
          <div className="pointer-events-none absolute inset-x-0 bottom-5 z-30 text-center">
            <p className="constellation-entry-caption">
              Entering{" "}
              <span>
                {
                  CONSTELLATION_NAMES[
                    selectedConstellation
                  ]
                }
              </span>
            </p>
          </div>
        )}
      </div>

      {selectedConstellation && (
        <div
          className="constellation-view-backdrop fixed inset-0 z-40 flex items-center justify-center px-5 py-8"
          onClick={(
            event,
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setSelectedConstellation(
                null,
              );
              setHoveredCategory(
                null,
              );
            }
          }}
        >
          <div className="constellation-view relative w-full max-w-2xl overflow-hidden rounded-3xl border border-violet-400/20 bg-[#08021c]/95 p-7 shadow-[0_0_100px_rgba(139,92,246,0.25)] backdrop-blur-2xl sm:p-10">
            <button
              type="button"
              onClick={() => {
                setSelectedConstellation(
                  null,
                );
                setHoveredCategory(
                  null,
                );
              }}
              className="absolute right-6 top-5 text-xl text-zinc-500 transition hover:text-white"
              aria-label="Close constellation"
            >
              ×
            </button>

            <div className="text-center">
              <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-violet-300/60">
                Constellation
              </p>

              <h2
                className={`constellation-view-title mt-3 constellation-title-${selectedConstellation}`}
              >
                {
                  CONSTELLATION_NAMES[
                    selectedConstellation
                  ]
                }
              </h2>

              <p className="mt-3 text-sm text-zinc-500">
                {
                  selectedMemories.length
                }{" "}
                {selectedMemories.length ===
                1
                  ? "memory"
                  : "memories"}{" "}
                in this
                constellation
              </p>
            </div>

            <div className="mx-auto mt-7 h-px w-20 bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />

            <div className="mt-8 max-h-[55vh] space-y-3 overflow-y-auto pr-1">
              {selectedMemories.map(
                (memory) => (
                  <button
                    key={memory.id}
                    type="button"
                    onClick={() =>
                      setActiveMemory(
                        memory,
                      )
                    }
                    className="constellation-memory-card group w-full rounded-2xl border border-white/5 bg-white/[0.03] p-5 text-left transition hover:border-violet-400/20 hover:bg-violet-400/[0.06]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-lg tracking-wide text-white transition group-hover:text-violet-200">
                          {
                            memory.title
                          }
                        </h3>

                        <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-zinc-600">
                          {
                            memory.date
                          }
                        </p>
                      </div>

                      <span className="text-violet-400/40 transition group-hover:text-violet-300">
                        →
                      </span>
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-zinc-500">
                      {memory.text}
                    </p>
                  </button>
                ),
              )}
            </div>

            <p className="mt-7 text-center font-display text-sm italic text-violet-200/40">
              Every memory is part
              of the story.
            </p>
          </div>
        </div>
      )}

      {activeMemory && (
        <MemoryModal
          memory={activeMemory}
          onClose={() => {
            setActiveMemory(null);
            onClearSelectedMemory();
          }}
          onDelete={async (id) => {
            await onDeleteMemory(id);
            setActiveMemory(null);
            onClearSelectedMemory();
          }}
          onUpdate={async (
            updatedMemory,
          ) => {
            await onUpdateMemory(
              updatedMemory,
            );

            setActiveMemory(
              updatedMemory,
            );
          }}
        />
      )}
    </>
  );
}