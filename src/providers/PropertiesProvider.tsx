"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Property } from "@/types";
import { properties as fallback } from "@/lib/data/properties";

type Ctx = {
  properties: Property[];
  loading: boolean;
  refresh: () => Promise<void>;
};

const PropertiesContext = createContext<Ctx>({
  properties: fallback,
  loading: true,
  refresh: async () => {},
});

export function PropertiesProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(fallback);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const res = await fetch("/api/properties");
      if (res.ok) setProperties(await res.json());
    } catch {
      setProperties(fallback);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <PropertiesContext.Provider value={{ properties, loading, refresh }}>
      {children}
    </PropertiesContext.Provider>
  );
}

export function useProperties() {
  return useContext(PropertiesContext);
}

export function usePropertyBySlug(slug: string) {
  const { properties, loading } = useProperties();
  return { property: properties.find((p) => p.slug === slug), loading };
}
