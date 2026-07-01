"use client";

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import type { Property } from "@/types";

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

interface FavoritesContextValue {
  favorites: string[];
  recent: string[];
  toggleFavorite: (id: string) => void;
  addRecent: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() =>
    readStorage("dam-favorites", []),
  );
  const [recent, setRecent] = useState<string[]>(() => readStorage("dam-recent", []));

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("dam-favorites", JSON.stringify(next));
      return next;
    });
  }, []);

  const addRecent = useCallback((id: string) => {
    setRecent((prev) => {
      if (prev[0] === id) return prev;
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, 8);
      localStorage.setItem("dam-recent", JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      favorites,
      recent,
      toggleFavorite,
      addRecent,
      isFavorite: (id: string) => favorites.includes(id),
    }),
    [favorites, recent, toggleFavorite, addRecent],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}

interface CompareContextValue {
  compare: Property[];
  addToCompare: (p: Property) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compare, setCompare] = useState<Property[]>([]);

  const addToCompare = (p: Property) => {
    setCompare((prev) => {
      if (prev.find((x) => x.id === p.id)) return prev;
      if (prev.length >= 4) return prev;
      return [...prev, p];
    });
  };

  const removeFromCompare = (id: string) => {
    setCompare((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <CompareContext.Provider
      value={{
        compare,
        addToCompare,
        removeFromCompare,
        clearCompare: () => setCompare([]),
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
