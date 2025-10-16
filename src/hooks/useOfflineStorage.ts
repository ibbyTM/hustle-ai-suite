import { useState, useEffect } from "react";
import { toast } from "sonner";

const DB_NAME = "HustleLabOffline";
const DB_VERSION = 1;
const STORE_NAME = "generations";

interface Generation {
  id: string;
  tool_id: string;
  tool_title: string;
  tool_emoji: string;
  inputs: any;
  output: string;
  created_at: string;
}

export function useOfflineStorage() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [db, setDb] = useState<IDBDatabase | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Back online!");
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.info("You're offline - viewing cached data");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initialize IndexedDB
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error("Failed to open IndexedDB");
    };

    request.onsuccess = () => {
      setDb(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        objectStore.createIndex("created_at", "created_at", { unique: false });
      }
    };

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (db) {
        db.close();
      }
    };
  }, []);

  const cacheGenerations = async (generations: Generation[]) => {
    if (!db) return;

    return new Promise<void>((resolve, reject) => {
      try {
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const objectStore = transaction.objectStore(STORE_NAME);

        // Clear old data
        objectStore.clear();

        // Add new data
        generations.forEach((gen) => {
          objectStore.add(gen);
        });

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      } catch (error) {
        console.error("Failed to cache generations:", error);
        reject(error);
      }
    });
  };

  const getCachedGenerations = async (): Promise<Generation[]> => {
    if (!db) return [];

    try {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.getAll();

      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error("Failed to get cached generations:", error);
      return [];
    }
  };

  return {
    isOnline,
    cacheGenerations,
    getCachedGenerations,
  };
}