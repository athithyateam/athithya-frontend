"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, AlertTriangle } from "lucide-react";
import "leaflet/dist/leaflet.css";
import uttarakhandBoundary from "@/data/uttarakhand-boundary.json";

export interface PickedLocation {
  lat: number | null;
  lng: number | null;
  latitude?: number | null;
  longitude?: number | null;
  city?: string;
  state?: string;
  country?: string;
  address?: string;
}

export interface MapPickerProps {
  value?: PickedLocation;
  latitude?: number | null;
  longitude?: number | null;
  onLocationChange?: (loc: PickedLocation) => void;
  onChange?: (loc: PickedLocation) => void;
}

export function MapPicker({
  value,
  latitude: propLat,
  longitude: propLng,
  onLocationChange,
  onChange,
}: MapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const activeLat = propLat ?? value?.lat ?? value?.latitude ?? null;
  const activeLng = propLng ?? value?.lng ?? value?.longitude ?? null;

  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(() => {
    if (activeLat && activeLng) return { lat: activeLat, lng: activeLng };
    return null;
  });
  const [address, setAddress] = useState<string>(value?.address || "");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState("");
  const [searching, setSearching] = useState(false);
  const [resolvedName, setResolvedName] = useState("");

  const triggerChange = (loc: PickedLocation) => {
    if (onLocationChange) onLocationChange(loc);
    if (onChange) onChange(loc);
  };

  // Sync external props to state
  useEffect(() => {
    if (activeLat && activeLng) {
      setPosition({ lat: activeLat, lng: activeLng });
      if (value?.address) setAddress(value.address);
    }
  }, [activeLat, activeLng, value?.address]);

  // Initialize Leaflet map
  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    // Dynamically import Leaflet on client side
    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Fix icon issues
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });

      if (!mapInstanceRef.current) {
        const defaultCenter: [number, number] = [30.0668, 79.0193]; // Uttarakhand center
        const center: [number, number] = position ? [position.lat, position.lng] : defaultCenter;

        const map = L.map(mapContainerRef.current, {
          center,
          zoom: position ? 13 : 8,
          minZoom: 8,
          maxBounds: [
            [28.2, 77.0],
            [31.9, 81.5],
          ],
          maxBoundsViscosity: 1.0,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        if (uttarakhandBoundary) {
          L.geoJSON(uttarakhandBoundary as any, {
            style: {
              color: "#C59A2F",
              weight: 2.5,
              fillColor: "#C59A2F",
              fillOpacity: 0.04,
              dashArray: "5, 5",
            },
          }).addTo(map);
        }

        if (position) {
          markerRef.current = L.marker([position.lat, position.lng]).addTo(map);
        }

        // Handle map clicks
        map.on("click", (e: any) => {
          const { lat, lng } = e.latlng;
          // Latitude: 28.4 to 31.6, Longitude: 77.3 to 81.2
          if (lat >= 28.4 && lat <= 31.6 && lng >= 77.3 && lng <= 81.2) {
            setSearchError("");
            setResolvedName("");
            setPosition({ lat, lng });

            if (markerRef.current) {
              markerRef.current.setLatLng([lat, lng]);
            } else {
              markerRef.current = L.marker([lat, lng]).addTo(map);
            }
          } else {
            setSearchError("Please select a location within Uttarakhand.");
          }
        });

        mapInstanceRef.current = map;
      }
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  // Update marker & fly to position when position changes
  useEffect(() => {
    if (mapInstanceRef.current && position) {
      import("leaflet").then((L) => {
        if (!mapInstanceRef.current) return;
        if (markerRef.current) {
          markerRef.current.setLatLng([position.lat, position.lng]);
        } else {
          markerRef.current = L.marker([position.lat, position.lng]).addTo(mapInstanceRef.current);
        }
        mapInstanceRef.current.flyTo([position.lat, position.lng], 13);
      });
    }
  }, [position]);

  // Reverse geocoding when user clicks on map directly
  useEffect(() => {
    if (!position || resolvedName) return;

    let active = true;
    setLoading(true);

    const reverseUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`;

    fetch(reverseUrl)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        const addr = data.address || {};
        const state = addr.state || "";

        // Strict state validation
        if (!state || state.toLowerCase() !== "uttarakhand") {
          setSearchError("We only allow experiences in Uttarakhand. Please choose a location within Uttarakhand.");
          setPosition(null);
          setAddress("");
          if (markerRef.current && mapInstanceRef.current) {
            mapInstanceRef.current.removeLayer(markerRef.current);
            markerRef.current = null;
          }
          triggerChange({
            lat: null,
            lng: null,
            latitude: null,
            longitude: null,
            city: "",
            state: "",
            country: "",
            address: "",
          });
          setLoading(false);
          return;
        }

        const city = addr.city || addr.town || addr.village || addr.county || "";
        const country = addr.country || "India";
        const parts = [
          addr.village || addr.town || addr.city || addr.suburb || "",
          addr.county || addr.district || "",
          state,
        ].filter(Boolean);
        const cleanAddress = parts.join(", ") || data.display_name || "";

        setAddress(cleanAddress);
        triggerChange({
          lat: position.lat,
          lng: position.lng,
          latitude: position.lat,
          longitude: position.lng,
          city,
          state,
          country,
          address: cleanAddress,
        });
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        console.error("Geocoding error:", err);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [position, resolvedName]);

  // Forward geocoding search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearchError("");

    try {
      // 1. Search bounded to Uttarakhand viewport
      const searchUrl1 = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchQuery
      )}&viewbox=77.3,31.5,81.1,28.7&bounded=1&addressdetails=1`;
      let res = await fetch(searchUrl1);
      let data = await res.json();

      let foundValid = false;
      if (data && data.length > 0) {
        const first = data[0];
        const newLat = parseFloat(first.lat);
        const newLng = parseFloat(first.lon);
        const resultState = first.address?.state || "";
        const resultDisplayName = first.display_name || "";
        const isUttarakhand =
          resultState.toLowerCase() === "uttarakhand" ||
          resultDisplayName.toLowerCase().includes("uttarakhand");

        if (isUttarakhand && newLat >= 28.4 && newLat <= 31.6 && newLng >= 77.3 && newLng <= 81.2) {
          const name = first.name || first.display_name?.split(",")[0] || searchQuery;
          const cleanAddress = name.toLowerCase().includes("uttarakhand") ? name : `${name}, Uttarakhand`;
          setResolvedName(cleanAddress);
          setAddress(cleanAddress);
          setPosition({ lat: newLat, lng: newLng });

          const addr = first.address || {};
          triggerChange({
            lat: newLat,
            lng: newLng,
            latitude: newLat,
            longitude: newLng,
            city: addr.city || addr.town || addr.village || addr.county || name,
            state: addr.state || "Uttarakhand",
            country: addr.country || "India",
            address: cleanAddress,
          });

          setSearchQuery("");
          foundValid = true;
        }
      }

      // 2. Retry with ", Uttarakhand" appended if not found
      if (!foundValid && !searchQuery.toLowerCase().includes("uttarakhand")) {
        const targetQuery = `${searchQuery}, Uttarakhand`;
        const searchUrl2 = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          targetQuery
        )}&viewbox=77.3,31.5,81.1,28.7&bounded=1&addressdetails=1`;
        res = await fetch(searchUrl2);
        data = await res.json();

        if (data && data.length > 0) {
          const first = data[0];
          const newLat = parseFloat(first.lat);
          const newLng = parseFloat(first.lon);
          const resultState = first.address?.state || "";
          const resultDisplayName = first.display_name || "";
          const isUttarakhand =
            resultState.toLowerCase() === "uttarakhand" ||
            resultDisplayName.toLowerCase().includes("uttarakhand");

          if (isUttarakhand && newLat >= 28.4 && newLat <= 31.6 && newLng >= 77.3 && newLng <= 81.2) {
            const name = first.name || first.display_name?.split(",")[0] || searchQuery;
            const cleanAddress = name.toLowerCase().includes("uttarakhand") ? name : `${name}, Uttarakhand`;
            setResolvedName(cleanAddress);
            setAddress(cleanAddress);
            setPosition({ lat: newLat, lng: newLng });

            const addr = first.address || {};
            triggerChange({
              lat: newLat,
              lng: newLng,
              latitude: newLat,
              longitude: newLng,
              city: addr.city || addr.town || addr.village || addr.county || name,
              state: addr.state || "Uttarakhand",
              country: addr.country || "India",
              address: cleanAddress,
            });

            setSearchQuery("");
            foundValid = true;
          }
        }
      }

      if (!foundValid) {
        setSearchError("We only allow experiences in Uttarakhand. Please choose a location within Uttarakhand.");
      }
    } catch (err) {
      console.error("Search error:", err);
      setSearchError("Failed to search location. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar matching athithya-app */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                searchError ? "text-red-400" : "text-gray-400"
              }`}
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (searchError) setSearchError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search location (e.g. Rishikesh, Chopta)"
              className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-sm focus:outline-none transition-all shadow-sm dark:bg-neutral-900 ${
                searchError
                  ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-red-900 dark:text-red-400 placeholder-red-300 dark:bg-neutral-900"
                  : "border-gray-200 dark:border-neutral-800 focus:border-[#C59A2F] focus:ring-1 focus:ring-[#C59A2F] dark:bg-neutral-900"
              }`}
            />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            disabled={searching || !searchQuery.trim()}
            className="px-6 py-2 bg-[#C59A2F] text-white rounded-xl font-medium text-sm hover:bg-[#a67f26] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm min-w-[100px] cursor-pointer"
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Error message */}
        {searchError && (
          <div className="mt-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 px-3 py-2 rounded-lg flex items-center gap-2">
            <AlertTriangle size={16} />
            <span>{searchError}</span>
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="relative mt-2">
        <div
          ref={mapContainerRef}
          style={{ height: "400px", width: "100%", borderRadius: "1rem", zIndex: 0 }}
          className="z-0 border-2 border-neutral-100 dark:border-neutral-800 transition-colors"
        />

        {/* Instruction badge when no position */}
        {!position && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg z-[400] pointer-events-none border border-gray-100 dark:border-neutral-800 transition-colors">
            <p className="text-xs font-bold text-neutral-700 uppercase tracking-wide flex items-center gap-2 dark:text-neutral-300 transition-colors">
              <span>📍</span> Click map or search above
            </p>
          </div>
        )}
      </div>

      {/* Selected Location Info Card */}
      {position && (
        <div className="bg-[#FDFBF7] dark:bg-neutral-950/40 border border-[#f0e6d2] dark:border-neutral-800 rounded-xl p-4 transition-colors">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C59A2F] flex items-center justify-center shrink-0 mt-0.5 shadow-sm text-white">
              <MapPin size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-black text-neutral-900 uppercase mb-1 dark:text-neutral-100 transition-colors">
                Selected Location
              </h4>
              {loading ? (
                <p className="text-xs text-neutral-500 italic dark:text-neutral-400 transition-colors">
                  Fetching address details...
                </p>
              ) : (
                <>
                  <p className="text-xs text-neutral-600 mb-2 font-medium break-words leading-relaxed dark:text-neutral-400 transition-colors">
                    {address || "Address latitude/longitude only"}
                  </p>
                  <div className="flex gap-4 text-[10px] text-neutral-400 font-mono bg-white/50 dark:bg-neutral-900/50 inline-block px-2 py-1 rounded-md border border-neutral-100 dark:border-neutral-800 transition-colors">
                    <span>Lat: {position.lat.toFixed(5)}</span>
                    <span className="text-neutral-300">|</span>
                    <span>Lng: {position.lng.toFixed(5)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
