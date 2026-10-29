"use client";

import { useState } from "react";
import { MapPin, Search, Navigation } from "lucide-react";
import { geocodeReverseApi, geocodeSearchApi } from "@/lib/api";
import { MapViewer } from "./map-viewer";

export interface PickedLocation {
  lat: number;
  lng: number;
  city?: string;
  state?: string;
  country?: string;
  address?: string;
}

export interface MapPickerProps {
  value?: PickedLocation;
  onChange: (loc: PickedLocation) => void;
}

export function MapPicker({ value, onChange }: MapPickerProps) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const lat = value?.lat ?? 30.0869;
  const lng = value?.lng ?? 78.2676;

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const data = await geocodeSearchApi(query.trim());
      setResults(Array.isArray(data) ? data.slice(0, 5) : data?.results || []);
    } finally {
      setSearching(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const nextLat = pos.coords.latitude;
      const nextLng = pos.coords.longitude;
      const rev = await geocodeReverseApi(nextLat, nextLng);
      onChange({
        lat: nextLat,
        lng: nextLng,
        city: rev?.address?.city || rev?.address?.town || rev?.address?.village || "",
        state: rev?.address?.state || "Uttarakhand",
        country: rev?.address?.country || "India",
        address: rev?.display_name || "",
      });
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            placeholder="Search meeting point or town..."
            className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs focus:border-[#C59A2F] outline-none"
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          className="px-4 py-2.5 rounded-2xl bg-[#C59A2F] text-white text-xs font-bold hover:bg-[#A67F26] transition cursor-pointer"
        >
          {searching ? "..." : "Find"}
        </button>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          title="Use current GPS location"
          className="p-2.5 rounded-2xl border border-neutral-200 dark:border-neutral-700 hover:border-[#C59A2F] text-[#C59A2F] transition cursor-pointer"
        >
          <Navigation size={15} />
        </button>
      </div>

      {results.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 divide-y divide-neutral-100 dark:divide-neutral-800 max-h-44 overflow-y-auto">
          {results.map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                onChange({
                  lat: Number(r.lat),
                  lng: Number(r.lon || r.lng),
                  city: r.address?.city || r.address?.town || r.address?.village || "",
                  state: r.address?.state || "Uttarakhand",
                  country: r.address?.country || "India",
                  address: r.display_name || "",
                });
                setResults([]);
              }}
              className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-amber-50/50 dark:hover:bg-neutral-800 flex items-center gap-2 cursor-pointer"
            >
              <MapPin size={13} className="text-[#C59A2F] shrink-0" />
              <span className="truncate">{r.display_name}</span>
            </button>
          ))}
        </div>
      )}

      <MapViewer
        lat={lat}
        lng={lng}
        address={value?.address}
        city={value?.city}
        state={value?.state}
      />
    </div>
  );
}
