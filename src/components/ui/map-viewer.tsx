"use client";

import { MapPin, ExternalLink } from "lucide-react";

export interface MapViewerProps {
  lat?: number;
  lng?: number;
  address?: string;
  city?: string;
  state?: string;
  className?: string;
}

export function MapViewer({
  lat = 30.0869,
  lng = 78.2676,
  address,
  city,
  state,
  className = "",
}: MapViewerProps) {
  const safeLat = Number(lat) || 30.0869;
  const safeLng = Number(lng) || 78.2676;
  const bbox = `${safeLng - 0.04},${safeLat - 0.03},${safeLng + 0.04},${safeLat + 0.03}`;
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${safeLat},${safeLng}`;
  const gmapsLink = `https://www.google.com/maps/search/?api=1&query=${safeLat},${safeLng}`;
  const label = [address, city, state].filter(Boolean).join(", ") || "Uttarakhand, India";

  return (
    <div
      className={`rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 ${className}`}
    >
      <div className="relative h-64 sm:h-72 w-full bg-neutral-100 dark:bg-neutral-800">
        <iframe
          title={`Map of ${label}`}
          src={osmUrl}
          className="w-full h-full border-0"
          loading="lazy"
        />
      </div>
      <div className="p-4 flex items-center justify-between gap-3 bg-white dark:bg-neutral-900">
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 min-w-0">
          <MapPin size={15} className="text-[#C59A2F] shrink-0" />
          <span className="truncate">{label}</span>
        </div>
        <a
          href={gmapsLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs font-black text-[#C59A2F] hover:underline shrink-0"
        >
          <span>Open in Maps</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}

