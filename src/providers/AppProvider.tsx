"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface AppContextValue {
  dark: boolean;
  setDark: (d: boolean) => void;
  loaded: boolean;
  setLoaded: (v: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <AppContext.Provider value={{ dark, setDark, loaded, setLoaded }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
