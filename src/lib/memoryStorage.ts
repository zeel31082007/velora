import type { Memory } from "@/types/memory";

const DB_NAME = "velora-db";
const STORE_NAME = "memories";
const DB_VERSION = 1;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      reject(new Error("IndexedDB is not available."));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
        });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(
        request.error ??
          new Error("Failed to open Velora storage."),
      );
    };

    request.onblocked = () => {
      reject(
        new Error(
          "Velora storage is blocked by another database connection.",
        ),
      );
    };
  });
}

function isValidMemory(memory: Memory): boolean {
  return (
    typeof memory === "object" &&
    memory !== null &&
    typeof memory.id === "string" &&
    memory.id.trim().length > 0 &&
    typeof memory.title === "string" &&
    memory.title.trim().length > 0 &&
    typeof memory.date === "string" &&
    memory.date.trim().length > 0 &&
    typeof memory.text === "string" &&
    memory.text.trim().length > 0 &&
    typeof memory.importance === "string" &&
    typeof memory.category === "string"
  );
}

export async function saveMemory(
  memory: Memory,
): Promise<void> {
  if (!isValidMemory(memory)) {
    throw new Error("Invalid memory data.");
  }

  const db = await openDatabase();

  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(
      STORE_NAME,
      "readwrite",
    );

    const store = transaction.objectStore(STORE_NAME);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      const error =
        transaction.error ??
        new Error("Failed to save memory.");

      db.close();
      reject(error);
    };

    transaction.onabort = () => {
      const error =
        transaction.error ??
        new Error("Memory save was aborted.");

      db.close();
      reject(error);
    };

    try {
      store.put(memory);
    } catch (error) {
      db.close();
      reject(error);
    }
  });
}

export async function getMemories(): Promise<Memory[]> {
  const db = await openDatabase();

  return new Promise<Memory[]>((resolve, reject) => {
    const transaction = db.transaction(
      STORE_NAME,
      "readonly",
    );

    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const memories = request.result as Memory[];

      db.close();
      resolve(memories);
    };

    request.onerror = () => {
      const error =
        request.error ??
        new Error("Failed to load memories.");

      db.close();
      reject(error);
    };

    transaction.onabort = () => {
      const error =
        transaction.error ??
        new Error("Memory loading was aborted.");

      db.close();
      reject(error);
    };
  });
}

export async function deleteMemory(
  id: string,
): Promise<void> {
  if (
    typeof id !== "string" ||
    id.trim().length === 0
  ) {
    throw new Error("Invalid memory ID.");
  }

  const db = await openDatabase();

  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(
      STORE_NAME,
      "readwrite",
    );

    const store = transaction.objectStore(STORE_NAME);

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      const error =
        transaction.error ??
        new Error("Failed to delete memory.");

      db.close();
      reject(error);
    };

    transaction.onabort = () => {
      const error =
        transaction.error ??
        new Error("Memory deletion was aborted.");

      db.close();
      reject(error);
    };

    try {
      store.delete(id);
    } catch (error) {
      db.close();
      reject(error);
    }
  });
}