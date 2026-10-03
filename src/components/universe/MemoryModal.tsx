"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type { Memory } from "@/types/memory";

interface MemoryModalProps {
  memory: Memory;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (memory: Memory) => Promise<void>;
}

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

export default function MemoryModal({
  memory,
  onClose,
  onDelete,
  onUpdate,
}: MemoryModalProps) {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] =
    useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);    

  const [title, setTitle] =
    useState(memory.title);

  const [date, setDate] =
    useState(memory.date);

  const [text, setText] =
    useState(memory.text);

  const [category, setCategory] =
    useState<Memory["category"]>(
      memory.category,
    );

  const [importance, setImportance] =
    useState<Memory["importance"]>(
      memory.importance,
    );

  const [image, setImage] =
    useState<string | undefined>(
      memory.image,
    );

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      document.body.style.overflow =
        "";
    };
  }, [onClose]);

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (
      event.target ===
      event.currentTarget
    ) {
      onClose();
    }
  };

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
        typeof reader.result ===
        "string"
      ) {
        setImage(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (
      !title.trim() ||
      !date ||
      !text.trim()
    ) {
      return;
    }

    const updatedMemory: Memory = {
      ...memory,
      title: title.trim(),
      date,
      text: text.trim(),
      category,
      importance,
      image,
    };

    try {
      setIsSaving(true);

      await onUpdate(updatedMemory);

      setIsEditing(false);
    } catch (error) {
      console.error(
        "Failed to update memory:",
        error,
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setTitle(memory.title);
    setDate(memory.date);
    setText(memory.text);
    setCategory(memory.category);
    setImportance(memory.importance);
    setImage(memory.image);

    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      await onDelete(memory.id);
    } catch (error) {
      console.error(
        "Failed to delete memory:",
        error,
      );

      setIsDeleting(false);
    }
  };

  return (
    <div
      className="memory-modal-backdrop fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 px-5 py-8 backdrop-blur-md"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="memory-title"
        className="memory-modal-content w-full max-w-lg rounded-3xl border border-violet-400/15 bg-[#08021c]/95 p-7 shadow-[0_0_100px_rgba(139,92,246,0.2)] backdrop-blur-2xl sm:p-9"
      >
        {!isEditing && !showDeleteConfirm ? (
          <>
            {/* View Mode */}

            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-violet-300/60">
                  {memory.date}
                </p>

                <h3
                  id="memory-title"
                  className="mt-3 font-display text-3xl font-light tracking-wide text-white"
                >
                  {memory.title}
                </h3>
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

            <div className="my-6 h-px w-12 bg-gradient-to-r from-violet-400/60 to-transparent" />

            <p className="text-sm leading-relaxed text-zinc-300">
              {memory.text}
            </p>

            {memory.image && (
              <img
                src={memory.image}
                alt=""
                className="mt-6 max-h-72 w-full rounded-xl object-cover"
              />
            )}

            {memory.video && (
              <video
                src={memory.video}
                controls
                className="mt-6 max-h-72 w-full rounded-xl"
              />
            )}

            <div className="mt-8 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() =>
                  setShowDeleteConfirm(true)
                }
                className="text-[10px] uppercase tracking-[0.2em] text-red-300/60 transition-colors hover:text-red-300"
              >
                Delete Memory
              </button>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setIsEditing(true)
                  }
                  className="text-[10px] uppercase tracking-[0.2em] text-violet-300/70 transition-colors hover:text-violet-200"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 transition-colors hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        ) : showDeleteConfirm ? (
          <>
            {/* Delete Confirmation */}

            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-red-400/20 bg-red-500/10 text-red-300">
                !
              </div>

              <h3 className="mt-5 font-display text-2xl font-light tracking-wide text-white">
                Delete this memory?
              </h3>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-zinc-400">
                This memory will be permanently
                removed from your universe.
              </p>

              <div className="mt-8 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowDeleteConfirm(false)
                  }
                  disabled={isDeleting}
                  className="rounded-full border border-white/10 px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-zinc-400 transition hover:border-white/20 hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="rounded-full border border-red-400/20 bg-red-500/10 px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-red-300 transition hover:bg-red-500/20 disabled:cursor-wait disabled:opacity-50"
                >
                  {isDeleting
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Edit Mode */}

            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-violet-300/60">
                  Edit Memory
                </p>

                <h2 className="mt-3 font-display text-3xl font-light tracking-wide text-white">
                  Edit Your Star
                </h2>
              </div>

              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="text-xl text-zinc-600 transition hover:text-white disabled:opacity-40"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="my-7 h-px w-full bg-gradient-to-r from-violet-400/20 via-violet-400/5 to-transparent" />

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                  Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-violet-400/40 focus:bg-white/[0.05]"
                />
              </div>

              {/* Date */}
              <div>
                <label className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                  Date
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(event) =>
                    setDate(
                      event.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400/40 focus:bg-white/[0.05]"
                />
              </div>

              {/* Memory */}
              <div>
                <label className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                  Memory
                </label>

                <textarea
                  value={text}
                  onChange={(event) =>
                    setText(
                      event.target.value,
                    )
                  }
                  rows={5}
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-white outline-none transition focus:border-violet-400/40 focus:bg-white/[0.05]"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                  Category
                </label>

                <div className="relative mt-3">
                  <select
                    value={category}
                    onChange={(event) =>
                      setCategory(
                        event.target
                          .value as Memory["category"],
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-violet-400/30 bg-[#100629] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400/60"
                  >
                    {categories.map(
                      (item) => (
                        <option
                          key={
                            item.value
                          }
                          value={
                            item.value
                          }
                        >
                          {item.emoji}{" "}
                          {item.label}
                        </option>
                      ),
                    )}
                  </select>

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-violet-300">
                    ↓
                  </span>
                </div>
              </div>

              {/* Importance */}
              <div>
                <label className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                  Importance
                </label>

                <div className="relative mt-3">
                  <select
                    value={importance}
                    onChange={(event) =>
                      setImportance(
                        event.target
                          .value as Memory["importance"],
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-violet-400/30 bg-[#100629] px-4 py-3 text-sm text-white outline-none transition focus:border-violet-400/60"
                  >
                    {importanceOptions.map(
                      (item) => (
                        <option
                          key={
                            item.value
                          }
                          value={
                            item.value
                          }
                        >
                          {item.emoji}{" "}
                          {item.label}
                        </option>
                      ),
                    )}
                  </select>

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-violet-300">
                    ↓
                  </span>
                </div>
              </div>

              {/* Photo */}
              <div>
                <label className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                  Photo
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImageChange
                  }
                  className="hidden"
                />

                {!image ? (
                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="mt-3 flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-violet-400/15 bg-white/[0.02] px-5 py-7 text-center transition hover:border-violet-400/30 hover:bg-violet-400/[0.04]"
                  >
                    <span className="text-2xl">
                      +
                    </span>

                    <span className="mt-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                      Add a photo
                    </span>
                  </button>
                ) : (
                  <div className="relative mt-3 overflow-hidden rounded-2xl border border-violet-400/15">
                    <img
                      src={image}
                      alt="Memory preview"
                      className="max-h-64 w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setImage(
                          undefined,
                        )
                      }
                      className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs text-white backdrop-blur-md transition hover:bg-black/80"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={
                    handleCancelEdit
                  }
                  disabled={isSaving}
                  className="rounded-full border border-white/5 px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-zinc-500 transition hover:border-white/10 hover:text-white disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={
                    isSaving ||
                    !title.trim() ||
                    !date ||
                    !text.trim()
                  }
                  className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(139,92,246,0.35)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isSaving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}