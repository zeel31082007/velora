"use client";

import { useEffect, useState } from "react";

import {
  deleteMemory,
  getMemories,
  saveMemory,
} from "@/lib/memoryStorage";

import InteractiveStarField from "@/components/universe/InteractiveStarField";
import CreateMemory from "@/components/universe/CreateMemory";
import MemoryTimeline from "@/components/universe/MemoryTimeline";
import OnThisDay from "@/components/universe/OnThisDay";

import type { Memory } from "@/types/memory";

export default function YourUniverseSection() {
  const [memories, setMemories] =
    useState<Memory[]>([]);
const [newlyCreatedMemoryId, setNewlyCreatedMemoryId] =
  useState<string | null>(null);

    const [showStarBirth, setShowStarBirth] = useState(false);

  const [showCreateMemory, setShowCreateMemory] =
    useState(false);

  const [selectedYear, setSelectedYear] =
    useState<string | null>(null);

  const [selectedMemory, setSelectedMemory] =
    useState<Memory | null>(null);

  useEffect(() => {
    getMemories()
      .then((storedMemories) => {
        setMemories(storedMemories);
      })
      .catch((error) => {
        console.error(
          "Failed to load memories:",
          error,
        );
      });
  }, []);


const handleCreateMemory = async (memory: Memory) => {
  try {
    // Keep the ID created by CreateMemory.tsx
    await saveMemory(memory);

    setMemories((current) => [
      ...current,
      memory,
    ]);

    setShowCreateMemory(false);

    
setNewlyCreatedMemoryId(memory.id);
setShowStarBirth(true);

window.setTimeout(() => {
  setShowStarBirth(false);
}, 3200);

window.setTimeout(() => {
  setNewlyCreatedMemoryId(null);
},4200);

  } catch (error) {
    console.error("Failed to save memory:", error);
    throw error;
  }
};

  const handleUpdateMemory = async (
    updatedMemory: Memory,
  ) => {
    try {
      await saveMemory(updatedMemory);

      setMemories((current) =>
        current.map((memory) =>
          memory.id === updatedMemory.id
            ? updatedMemory
            : memory,
        ),
      );

      setSelectedMemory((current) =>
        current?.id === updatedMemory.id
          ? updatedMemory
          : current,
      );
    } catch (error) {
      console.error(
        "Failed to update memory:",
        error,
      );

      throw error;
    }
  };

  const handleDeleteMemory = async (
    id: string,
  ) => {
    try {
      await deleteMemory(id);

      setMemories((current) =>
        current.filter(
          (memory) => memory.id !== id,
        ),
      );

      setSelectedMemory((current) =>
        current?.id === id
          ? null
          : current,
      );
    } catch (error) {
      console.error(
        "Failed to delete memory:",
        error,
      );

      throw error;
    }
  };

  const handleSelectMemory = (
    memory: Memory,
  ) => {
    setSelectedMemory(memory);
  };

  return (
    <section
      id="your-universe"
      className="relative z-10 px-6 py-32 sm:py-40"
    >
  

{showStarBirth && (
  <div
    role="status"
    aria-live="polite"
    className="fixed bottom-8 left-1/2 z-[100] -translate-x-1/2 rounded-full border border-violet-300/20 bg-[#08021c]/95 px-6 py-4 text-center shadow-[0_0_40px_rgba(139,92,246,0.25)] backdrop-blur-xl"
  >
    <p className="text-sm tracking-wide text-violet-100">
      ✨ A new light enters your universe 🌟
    </p>
  </div>
)}

      <div className="mx-auto w-full max-w-7xl">

        {/* Header */}
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-violet-300/80">
            Explore
          </p>

          <h2 className="mt-4 font-display text-4xl font-light tracking-[0.08em] text-white sm:text-5xl">
            Your Universe
          </h2>

          <div className="mx-auto mt-6 h-px w-16 bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />

          <p className="mx-auto mt-6 max-w-lg text-sm text-zinc-500">
            Click a star to reveal a memory hidden in your cosmos.
          </p>

          <button
            type="button"
            onClick={() =>
              setShowCreateMemory(true)
            }
            className="mt-8 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-7 py-3 text-xs font-medium uppercase tracking-[0.2em] text-white transition hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]"
          >
            + Create Memory
          </button>
        </div>

        <div className="mt-16">

          {/* ON THIS DAY */}
          <OnThisDay
            memories={memories}
            onSelectMemory={handleSelectMemory}
          />

          {/* STAR FIELD */}
          <InteractiveStarField
            memories={memories}
            selectedYear={selectedYear}
            selectedMemory={selectedMemory}
            newlyCreatedMemoryId={newlyCreatedMemoryId}
            onDeleteMemory={handleDeleteMemory}
            onUpdateMemory={handleUpdateMemory}
            onClearSelectedMemory={() =>
              setSelectedMemory(null)
            }
          />

          {/* TIMELINE */}
          <MemoryTimeline
            memories={memories}
            selectedDate={selectedYear}
            onSelectDate={setSelectedYear}
          />
        </div>

        <p className="mt-12 text-center font-display text-lg italic tracking-wide text-violet-200/70 sm:text-xl">
          Every memory becomes a star. Every story becomes a universe.
        </p>
      </div>

      {/* CREATE MEMORY */}
      {showCreateMemory && (
        <CreateMemory
          onCreate={handleCreateMemory}
          onClose={() =>
            setShowCreateMemory(false)
          }
        />
      )}
    </section>
  );
}