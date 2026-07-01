"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Popup,
  useMap,
} from "react-leaflet";
import type { District, Property } from "@/types";
import { OBOUR_MAP_BOUNDS } from "@/lib/data/districts";
import { formatPrice } from "@/lib/data/properties";
import { t } from "@/lib/utils";

import "leaflet/dist/leaflet.css";

const PREMIUM_IDS = new Set(["golf", "rock", "new", "family"]);

function districtIcon(active: boolean, premium: boolean, label?: string) {
  if (active && label) {
    return L.divIcon({
      className: "",
      html: `
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
          <div style="width:16px;height:16px;border-radius:50%;background:#C9A227;border:2px solid #fff;box-shadow:0 0 16px rgba(201,162,39,0.9);"></div>
          <span style="white-space:nowrap;background:#0a0a0a;color:#C9A227;font-size:11px;font-weight:600;padding:2px 8px;border-radius:99px;border:1px solid #C9A227;">${label}</span>
        </div>
      `,
      iconSize: [120, 40],
      iconAnchor: [60, 8],
    });
  }

  const size = active ? 16 : premium ? 13 : 10;
  const bg = active ? "#C9A227" : premium ? "#e8d48a" : "#ffffff";
  const border = active ? "#ffffff" : "#C9A227";

  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${bg};border:2px solid ${border};${active ? "box-shadow:0 0 14px rgba(201,162,39,0.85);" : ""}"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function propertyIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="width:8px;height:8px;border-radius:50%;background:#C9A227;border:1px solid #0a0a0a;"></div>`,
    iconSize: [8, 8],
    iconAnchor: [4, 4],
  });
}

function MapController({
  active,
  visibleDistricts,
}: {
  active: District;
  visibleDistricts: District[];
}) {
  const map = useMap();
  const initialFit = useRef(true);

  useEffect(() => {
    if (initialFit.current) {
      map.fitBounds(OBOUR_MAP_BOUNDS, { padding: [32, 32], maxZoom: 12 });
      initialFit.current = false;
      return;
    }

    if (visibleDistricts.length > 1) {
      const bounds = L.latLngBounds(
        visibleDistricts.map((d) => [d.lat, d.lng] as [number, number]),
      );
      map.flyToBounds(bounds, { padding: [48, 48], maxZoom: 13, duration: 0.9 });
      return;
    }

    map.flyTo([active.lat, active.lng], 14, { duration: 0.9 });
  }, [active.id, active.lat, active.lng, map, visibleDistricts]);

  return null;
}

interface ObourLeafletMapProps {
  districts: District[];
  visibleDistricts: District[];
  properties: Property[];
  active: District;
  onSelect: (district: District) => void;
}

export function ObourLeafletMap({
  districts,
  visibleDistricts,
  properties,
  active,
  onSelect,
}: ObourLeafletMapProps) {
  const visibleIds = new Set(visibleDistricts.map((d) => d.id));
  const isPremium = PREMIUM_IDS.has(active.id);

  return (
    <MapContainer
      center={[active.lat, active.lng]}
      zoom={12}
      scrollWheelZoom
      className="h-full w-full z-0"
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />

      <MapController active={active} visibleDistricts={visibleDistricts} />

      {districts.map((d) => {
        const inGroup = visibleIds.has(d.id);
        const isActive = d.id === active.id;
        if (!inGroup && !isActive) return null;

        return (
          <Marker
            key={d.id}
            position={[d.lat, d.lng]}
            icon={districtIcon(
              isActive,
              PREMIUM_IDS.has(d.id),
              isActive ? t(d.name) : undefined,
            )}
            opacity={inGroup ? 1 : 0.35}
            eventHandlers={{ click: () => onSelect(d) }}
            zIndexOffset={isActive ? 1000 : PREMIUM_IDS.has(d.id) ? 500 : 100}
          >
            <Popup>
              <div className="min-w-[150px] text-sm text-[#0a0a0a]">
                <p className="font-semibold">{t(d.name)}</p>
                <p className="mt-1 text-xs text-black/55">{formatPrice(d.avgPrice)}</p>
                <p className="text-xs text-black/45">{d.properties} عقار</p>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {properties
        .filter((p) => visibleIds.has(p.district) || p.district === active.id)
        .map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={propertyIcon()} zIndexOffset={200}>
            <Popup>
              <div className="min-w-[160px] text-sm text-[#0a0a0a]">
                <p className="font-semibold">{t(p.title)}</p>
                <p className="mt-1 text-xs text-black/55">
                  {p.bedrooms} غرف · {p.area} م²
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

      <Circle
        center={[active.lat, active.lng]}
        radius={isPremium ? 1200 : 800}
        pathOptions={{
          color: "#C9A227",
          fillColor: "#C9A227",
          fillOpacity: 0.1,
          weight: 2,
          opacity: 0.75,
          dashArray: isPremium ? undefined : "6 4",
        }}
      />
    </MapContainer>
  );
}
