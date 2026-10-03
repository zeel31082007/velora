"use client";

import { useEffect, useRef, useState } from "react";
import type { Memory } from "@/types/memory";

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

interface CreateMemoryProps {
  onCreate: (memory: Memory) => Promise<void>;
  onClose: () => void;
}

const DRAFT_KEY = "velora-create-memory-draft";

const categories: {
  value: Memory["category"];
  emoji: string;
  label: string;
}[] = [
  {
    value: "achievement",
    emoji: "🎓",
    label: "Achievement",
  },
  {
    value: "adventure",
    emoji: "✈️",
    label: "Adventure",
  },
  {
    value: "family",
    emoji: "❤️",
    label: "Family",
  },
  {
    value: "celebration",
    emoji: "🎉",
    label: "Celebration",
  },
  {
    value: "growth",
    emoji: "🌱",
    label: "Growth",
  },
  {
    value: "reflection",
    emoji: "💭",
    label: "Reflection",
  },
  {
    value: "milestone",
    emoji: "⭐",
    label: "Milestone",
  },
];

const importanceOptions: {
  value: Memory["importance"];
  emoji: string;
  label: string;
}[] = [
  {
    value: "low",
    emoji: "🌙",
    label: "Low",
  },
  {
    value: "normal",
    emoji: "🪐",
    label: "Normal",
  },
  {
    value: "important",
    emoji: "✨",
    label: "Important",
  },
  {
    value: "life-changing",
    emoji: "🌌",
    label: "Life Changing",
  },
];

export default function CreateMemory({
  onCreate,
  onClose,
}: CreateMemoryProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const today = getTodayDate();

  const DRAFT_KEY = "velora-create-memory-draft";

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(today);
  const [text, setText] = useState("");

  const [importance, setImportance] =
    useState<Memory["importance"]>("normal");

  const [category, setCategory] =
    useState<Memory["category"]>("milestone");

  const [image, setImage] =
    useState<string | undefined>();

  const [isDraggingImage, setIsDraggingImage] =
  useState(false);

  const [video, setVideo] =
    useState<string | undefined>();

  useEffect(() => {
  try {
    const savedDraft = localStorage.getItem(DRAFT_KEY);

    if (savedDraft) {
      const draft = JSON.parse(savedDraft);

      setTitle(draft.title ?? "");
      setDate(draft.date ?? today);
      setText(draft.text ?? "");
      setCategory(draft.category ?? "milestone");
      setImportance(draft.importance ?? "normal");
    }
      } catch (error) {
    console.error("Failed to load memory draft:", error);
  } finally {
    setIsDraftLoaded(true);
  }
}, []);

useEffect(() => {
  if (!isDraftLoaded) return;

  try {
    console.log("VELORA DRAFT SAVING");

    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({
        title,
        date,
        text,
        category,
        importance,
      }),
    );
  } catch (error) {
    console.error("Failed to save memory draft:", error);
  }
}, [title, date, text, category, importance]);

useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#050014";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.arc(150, 75, 18, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.shadowBlur = 25;
  ctx.shadowColor = "#8b5cf6";
  ctx.fill();

  ctx.shadowBlur = 0;
}, []);

  const [isSaving, setIsSaving] =
    useState(false);
  const [isDraftLoaded, setIsDraftLoaded] =
  useState(false);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (
        typeof reader.result === "string"
      ) {
        setImage(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleVideoChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("video/")) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (
        typeof reader.result === "string"
      ) {
        setVideo(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      !title.trim() ||
      !date ||
      !text.trim()
    ) {
      return;
    }

    // Never allow future memories.
    if (date > today) {
      return;
    }

    try {
      setIsSaving(true);

      await onCreate({
        id: "",
        title: title.trim(),
        date,
        text: text.trim(),
        importance,
        category,
        image,
        video,
      });
      localStorage.removeItem(DRAFT_KEY);
    } catch (error) {
      console.error(
        "Failed to create memory:",
        error,
      );

      setIsSaving(false);
    }
  };

  return (
    <div
      className="memory-modal-backdrop fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-5 py-6 backdrop-blur-md"
      onClick={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="memory-modal-content max-h-[calc(100vh-3rem)] w-full max-w-lg overflow-y-auto rounded-3xl border border-violet-400/15 bg-[#08021c]/95 p-7 shadow-[0_0_100px_rgba(139,92,246,0.2)] backdrop-blur-2xl sm:p-9">

        {/* Header */}
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-violet-300/60">
              New Memory
            </p>

            <h2 className="mt-3 font-display text-3xl font-light tracking-wide text-white">
              Create a Star
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-zinc-600 transition hover:text-white"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="my-7 h-px w-full bg-gradient-to-r from-violet-400/20 via-violet-400/5 to-transparent" />

        <form
          onSubmit={handleSubmit}
          className="space-y-7"
        >
          {/* Title */}
          <div>
            <label
              htmlFor="memory-title"
              className="text-[10px] uppercase tracking-[0.25em] text-zinc-500"
            >
              Title
            </label>

            <input
              id="memory-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Give this memory a name"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-violet-400/40 focus:bg-white/[0.05]"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label
              htmlFor="memory-date"
              className="text-[10px] uppercase tracking-[0.25em] text-zinc-500"
            >
              Date
            </label>

            <input
              id="memory-date"
              type="date"
              value={date}
              max={today}
              onChange={(event) =>
                setDate(event.target.value)
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400/40 focus:bg-white/[0.05] [color-scheme:dark]"
              required
            />

            <p className="mt-2 text-[10px] text-zinc-700">
              You can add memories from any past date up to today.
            </p>
          </div>

          {/* Memory */}
          <div>
            <label
              htmlFor="memory-text"
              className="text-[10px] uppercase tracking-[0.25em] text-zinc-500"
            >
              Memory
            </label>

            <textarea
              id="memory-text"
              value={text}
              onChange={(event) =>
                setText(event.target.value)
              }
              placeholder="What happened?"
              rows={5}
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-white outline-none transition placeholder:text-zinc-700 focus:border-violet-400/40 focus:bg-white/[0.05]"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="memory-category"
              className="text-[10px] uppercase tracking-[0.25em] text-zinc-500"
            >
              Category
            </label>

            <div className="relative mt-3">
              <select
                id="memory-category"
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target
                      .value as Memory["category"],
                  )
                }
                className="w-full appearance-none rounded-xl border border-violet-400/30 bg-[#100629] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400/60 focus:bg-[#14082f]"
              >
                {categories.map(
                  (item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.emoji}{" "}
                      {item.label}
                    </option>
                  ),
                )}
              </select>

              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-violet-300">
                ↓
              </div>
            </div>
          </div>

          {/* Importance */}
          <div>
            <label
              htmlFor="memory-importance"
              className="text-[10px] uppercase tracking-[0.25em] text-zinc-500"
            >
              Importance
            </label>

            <div className="relative mt-3">
              <select
                id="memory-importance"
                value={importance}
                onChange={(event) =>
                  setImportance(
                    event.target
                      .value as Memory["importance"],
                  )
                }
                className="w-full appearance-none rounded-xl border border-violet-400/30 bg-[#100629] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400/60 focus:bg-[#14082f]"
              >
                {importanceOptions.map(
                  (item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.emoji}{" "}
                      {item.label}
                    </option>
                  ),
                )}
              </select>

              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-violet-300">
                ↓
              </div>
            </div>
          </div>

          {/* Media */}
          <div>
            <label className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
              Media
            </label>

            <div className="mt-3 grid grid-cols-2 gap-3">

              {/* Photo */}
              <div>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {!image ? (
                  <button
  type="button"
  onClick={() =>
    imageInputRef.current?.click()
  }
  onDragOver={(event) => {
    event.preventDefault();
    setIsDraggingImage(true);
  }}
  onDragLeave={() => {
    setIsDraggingImage(false);
  }}
  onDrop={(event) => {
    event.preventDefault();
    setIsDraggingImage(false);

    const file = event.dataTransfer.files?.[0];

    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
      }
    };

    reader.readAsDataURL(file);
  }}
                    className={`flex min-h-[145px] w-full flex-col items-center justify-center rounded-2xl border border-dashed px-3 text-center transition ${
  isDraggingImage
    ? "border-violet-400/70 bg-violet-400/10"
    : "border-violet-400/15 bg-white/[0.02] hover:border-violet-400/30 hover:bg-violet-400/[0.04]"
}`}
                  >
                    <span className="text-2xl">
                      📷
                    </span>

                    <span className="mt-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                      Add Photo
                    </span>

                    <span className="mt-1 text-xs text-zinc-700">
                      Optional
                    </span>
                  </button>
                ) : (
                  <div className="relative overflow-hidden rounded-2xl border border-violet-400/15">
                    <img
                      src={image}
                      alt="Memory preview"
                      className="h-[145px] w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setImage(undefined)
                      }
                      className="absolute right-2 top-2 rounded-full border border-white/10 bg-black/70 px-2.5 py-1 text-xs text-white backdrop-blur-md transition hover:bg-black/90"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Video */}
              <div>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                />

                {!video ? (
                  <button
                    type="button"
                    onClick={() =>
                      videoInputRef.current?.click()
                    }
                    className="flex min-h-[145px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-violet-400/15 bg-white/[0.02] px-3 text-center transition hover:border-violet-400/30 hover:bg-violet-400/[0.04]"
                  >
                    <span className="text-2xl">
                      🎥
                    </span>

                    <span className="mt-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                      Add Video
                    </span>

                    <span className="mt-1 text-xs text-zinc-700">
                      Optional
                    </span>
                  </button>
                ) : (
                  <div className="relative overflow-hidden rounded-2xl border border-violet-400/15 bg-black/30">
                    <video
                      src={video}
                      controls
                      playsInline
                      className="h-[145px] w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setVideo(undefined)
                      }
                      className="absolute right-2 top-2 rounded-full border border-white/10 bg-black/70 px-2.5 py-1 text-xs text-white backdrop-blur-md transition hover:bg-black/90"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

<div className="mt-6 overflow-hidden rounded-2xl border border-violet-400/20 bg-black/30">
  <canvas
    ref={canvasRef}
    width={300}
    height={150}
    className="h-auto w-full"
  />
</div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-full border border-white/5 px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-zinc-500 transition hover:border-white/10 hover:text-white disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isSaving ||
                !title.trim() ||
                !date ||
                !text.trim() ||
                date > today
              }
              className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(139,92,246,0.35)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSaving
                ? "Creating..."
                : "Create Star"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}