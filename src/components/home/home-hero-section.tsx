"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, User, Compass } from "lucide-react";
import { searchAll, geocodeReverseApi } from "@/lib/api/chat-and-notifications-api";
import { HeroCurveDivider } from "./hero-curve-divider";

export function HomeHeroSection() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{ people: any[]; experiences: any[] }>({ people: [], experiences: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    if (!address.trim()) return;
    setShowSuggestions(false);
    router.push(`/explore-experience?q=${encodeURIComponent(address.trim())}`);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) return;
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          localStorage.setItem("user_coords", JSON.stringify(coords));
          const data = await geocodeReverseApi(coords.latitude, coords.longitude);
          const addr = data?.address || {};
          const city = addr.city || addr.town || addr.village || data?.display_name?.split(",")[0] || "Uttarakhand";
          setAddress(city);
        } catch {
          setAddress("Uttarakhand");
        } finally {
          setLocationLoading(false);
        }
      },
      () => setLocationLoading(false),
      { timeout: 8000 }
    );
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (address.trim().length >= 1) {
        try {
          const res = await searchAll(address.trim(), "all", 8);
          if (res?.success || res?.data) {
            const payload = res.data || res;
            setSuggestions({ people: payload.people || [], experiences: payload.posts || [] });
            setShowSuggestions(true);
          }
        } catch {
          setShowSuggestions(false);
        }
      } else {
        setSuggestions({ people: [], experiences: [] });
        setShowSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [address]);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const hasResults = suggestions.people.length > 0 || suggestions.experiences.length > 0;

  return (
    <div className="relative z-20 w-full min-h-[505px] sm:min-h-[565px] md:min-h-[680px] lg:min-h-[720px] flex flex-col justify-center items-center py-20 sm:py-24 md:py-32 px-4 sm:px-6 text-center">
      <div className="absolute inset-0 z-0 overflow-hidden w-full h-full">
        <picture className="w-full h-full block">
          <source srcSet="/images/hero-mobile.jpg" media="(max-width: 767px)" />
          <img src="/images/hero-banner-full.jpg" alt="Athithya Local Travel" className="w-full h-full object-cover object-center block" />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/75" />
      </div>

      <div className="relative z-20 max-w-5xl mx-auto flex flex-col items-center justify-center w-full my-auto">
        <h1 className="text-[1.85rem] xs:text-[2.25rem] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif italic font-black tracking-[0.02em] leading-tight md:leading-none mb-4 sm:mb-8 drop-shadow-2xl px-2 w-full max-w-5xl mx-auto text-center select-none text-white">
          <span className="text-[#C59A2F]">Athithya</span>
          <span> - Your Travel Experience Platform</span>
        </h1>

        <div ref={searchRef} className="relative w-full max-w-3xl mx-auto">
          <div className="w-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-full shadow-2xl p-1.5 md:p-2 flex items-center border border-white/40 dark:border-neutral-800 transition-all">
            <div className="flex-1 flex items-center px-2.5 sm:px-4 md:px-5 py-1.5 sm:py-2 w-full">
              <Search className="text-[#C59A2F] mr-2.5 sm:mr-3 shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onFocus={() => hasResults && setShowSuggestions(true)}
                placeholder="Search Experiences, Hosts, Plans and People"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="bg-transparent focus:outline-none text-neutral-800 dark:text-neutral-100 font-bold text-xs sm:text-sm w-full placeholder:text-neutral-400 placeholder:font-normal"
              />
              <button
                type="button"
                onClick={handleUseLocation}
                className="text-[#C59A2F] text-[10px] md:text-xs font-bold whitespace-nowrap ml-1.5 sm:ml-2 hover:underline px-2.5 py-1.5 rounded-full transition shrink-0 flex items-center gap-1 cursor-pointer"
                title="Detect location"
              >
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{locationLoading ? "Detecting..." : "Use current location"}</span>
              </button>
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className="p-2.5 sm:px-5 sm:py-2.5 rounded-full bg-[#C59A2F] text-white text-xs font-black uppercase tracking-wider hover:bg-[#A67F26] transition shadow-md hidden sm:flex items-center gap-1.5 cursor-pointer"
            >
              <span>Search</span>
            </button>
          </div>

          {showSuggestions && hasResults && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-3 z-50 text-left max-h-80 overflow-y-auto">
              {suggestions.experiences.length > 0 && (
                <div className="mb-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#C59A2F] px-2 py-1">Experiences</p>
                  {suggestions.experiences.map((exp: any) => (
                    <button key={exp._id || exp.id} type="button" onClick={() => { setShowSuggestions(false); router.push(`/post/${exp._id || exp.id}?type=${exp.postType || "experience"}`); }} className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-800 dark:text-neutral-200 cursor-pointer">
                      <Compass size={14} className="text-[#C59A2F] shrink-0" /><span className="truncate">{exp.title}</span>
                    </button>
                  ))}
                </div>
              )}
              {suggestions.people.length > 0 && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#C59A2F] px-2 py-1">Hosts & People</p>
                  {suggestions.people.map((p: any) => (
                    <button key={p._id || p.id} type="button" onClick={() => { setShowSuggestions(false); router.push(`/profile/${p._id || p.id}`); }} className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-800 dark:text-neutral-200 cursor-pointer">
                      <User size={14} className="text-[#C59A2F] shrink-0" /><span className="truncate">{p.firstname} {p.lastname}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <HeroCurveDivider />
    </div>
  );
}
