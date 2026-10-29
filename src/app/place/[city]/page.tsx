"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Star, IndianRupee, Headphones, Heart, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { MobileFooter } from "@/components/navigation/mobile-footer";
import { placesData } from "@/data/places";
import { searchAll } from "@/lib/api/chat-and-notifications-api";
import { ExperienceCard } from "@/components/cards/experience-card";

const TABS = [
  { key: "detail", label: "Detail" },
  { key: "photos", label: "Photos" },
  { key: "plans", label: "Plans" },
  { key: "map", label: "Map" },
  { key: "itineraries", label: "Itineraries" },
  { key: "experiences", label: "Experiences" },
];

export default function SinglePlacePage() {
  const params = useParams();
  const router = useRouter();
  const city = String(params?.city || "chopta").toLowerCase();
  const [active, setActive] = useState("detail");
  const [localExperiences, setLocalExperiences] = useState<any[]>([]);
  const [loadingLocal, setLoadingLocal] = useState(false);

  const place = placesData.find((p) => p.id === city) || placesData[0];

  useEffect(() => {
    let mounted = true;
    async function fetchLocal() {
      setLoadingLocal(true);
      try {
        const res = await searchAll(city, "all", 100);
        const list = res?.data?.results || res?.data?.posts || res?.posts || [];
        if (mounted) setLocalExperiences(list);
      } catch {
        if (mounted) setLocalExperiences([]);
      } finally {
        if (mounted) setLoadingLocal(false);
      }
    }
    fetchLocal();
    return () => { mounted = false; };
  }, [city]);

  if (!place) return <div className="p-10 text-center">Location not found</div>;

  const allItineraries = localExperiences.filter((exp) => exp.postType === "plan" || exp.postType === "itinerary");
  const allExperiences = localExperiences.filter((exp) => exp.postType !== "plan" && exp.postType !== "itinerary");

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans">
      <Navbar />

      <div className="w-full overflow-hidden relative">
        <img src={place.bannerImage} alt={place.name} className="w-full h-[52vh] md:h-[68vh] lg:h-[72vh] object-cover block" />
      </div>

      <div className="px-4 md:px-12 mt-6 mb-12 max-w-[1400px] mx-auto w-full flex-1">
        <div className="rounded-2xl shadow-lg p-4 md:p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-6 text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:text-[#d4af37] transition-colors group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-[#FFF7E6] transition-colors">
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            </div>
          </button>

          <nav className="flex gap-2 overflow-x-auto pb-2 border-b border-neutral-200 dark:border-neutral-800">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  active === t.key ? "bg-[#D4A017] text-white" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {active === "detail" && (
                  <motion.div key="detail" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="rounded-xl p-6 border border-neutral-200 dark:border-neutral-800 text-left">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">{place.name} — {place.tagline}</h1>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1 text-[#D4A017]">
                        {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={16} className="fill-[#D4A017]" />)}
                      </div>
                      <span className="text-sm text-neutral-500">(Based on traveler reviews)</span>
                    </div>
                    <p className="text-base leading-relaxed mb-6 text-neutral-700 dark:text-neutral-300">{place.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl">
                        <h3 className="font-semibold mb-2">Highlights</h3>
                        <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                          {place.highlights?.map((h, i) => <li key={i}>• {h}</li>)}
                        </ul>
                      </div>
                      <div className="p-4 rounded-xl bg-[#FFF7E6] dark:bg-amber-950/30 border-l-4 border-[#D4A017]">
                        <h4 className="font-bold text-[#B58812] mb-1">Important</h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-300">{place.importantInfo}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {active === "photos" && (
                  <motion.div key="photos" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-6 border border-neutral-200 dark:border-neutral-800 text-left">
                    <h2 className="text-2xl font-semibold mb-4">Photos</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(place.photos || []).map((photo, idx) => (
                        <img key={idx} src={photo} alt={`${place.name} ${idx + 1}`} className="w-full h-56 object-cover rounded-xl" />
                      ))}
                    </div>
                  </motion.div>
                )}

                {active === "plans" && (
                  <motion.div key="plans" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-6 border border-neutral-200 dark:border-neutral-800 text-left">
                    <h2 className="text-2xl font-bold mb-6">Trip Plans</h2>
                    <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-6 border border-neutral-100 dark:border-neutral-800">
                      <ol className="list-decimal ml-5 space-y-4">
                        {place.plans?.map((p, i) => <li key={i} className="pl-2 text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">{p}</li>)}
                      </ol>
                    </div>
                  </motion.div>
                )}

                {active === "map" && (
                  <motion.div key="map" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-6 border border-neutral-200 dark:border-neutral-800 text-left">
                    <h2 className="text-2xl font-semibold mb-3">Map</h2>
                    <div className="w-full h-72 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center text-neutral-400 overflow-hidden">
                      {place.mapEmbed && !place.mapEmbed.includes("PLACEHOLDER") ? (
                        <iframe src={place.mapEmbed} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" />
                      ) : (
                        <span>Map is currently unavailable for {place.name}</span>
                      )}
                    </div>
                  </motion.div>
                )}

                {(active === "itineraries" || active === "experiences") && (
                  <motion.div key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-6 border border-neutral-200 dark:border-neutral-800 text-left">
                    <h2 className="text-2xl font-bold mb-6">{active === "itineraries" ? `Itineraries in ${place.name}` : `Experiences in ${place.name}`}</h2>
                    {loadingLocal ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map((i) => <div key={i} className="h-72 bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-2xl" />)}
                      </div>
                    ) : (active === "itineraries" ? allItineraries : allExperiences).length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(active === "itineraries" ? allItineraries : allExperiences).map((exp) => (
                          <ExperienceCard key={exp._id || exp.id} data={exp} showBookmark className="w-full" />
                        ))}
                      </div>
                    ) : (
                      <p className="text-neutral-500 py-8">No official {active} found for {place.name} in our database yet.</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <aside className="space-y-4 text-left">
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
                  <h4 className="font-semibold text-lg">Why Choose Athithya?</h4>
                </div>
                <ul className="divide-y divide-neutral-200 dark:divide-neutral-800 text-sm">
                  <li className="flex items-start gap-3 p-4"><Star className="text-[#D4A017] shrink-0 mt-0.5" size={18} /><div><strong>Experiences led by locals</strong><p className="text-xs text-neutral-500 mt-1">Travel with people who live here — not agents, not middlemen.</p></div></li>
                  <li className="flex items-start gap-3 p-4"><IndianRupee className="text-[#D4A017] shrink-0 mt-0.5" size={18} /><div><strong>Transparent & fair pricing</strong><p className="text-xs text-neutral-500 mt-1">No hidden charges. What you see is what you pay.</p></div></li>
                  <li className="flex items-start gap-3 p-4"><Headphones className="text-[#D4A017] shrink-0 mt-0.5" size={18} /><div><strong>On-trip human support</strong><p className="text-xs text-neutral-500 mt-1">Real people available before, during, and after your journey.</p></div></li>
                  <li className="flex items-start gap-3 p-4"><Heart className="text-[#D4A017] shrink-0 mt-0.5" size={18} /><div><strong>Community-driven travel</strong><p className="text-xs text-neutral-500 mt-1">Built on trust, stories, and shared experiences — not mass tourism.</p></div></li>
                </ul>
              </div>
              <div className="rounded-xl p-5 text-white bg-gradient-to-b from-[#D4A017] to-[#B58812]">
                <h4 className="text-xl font-bold mb-2">Have a Question?</h4>
                <p className="text-sm mb-4 opacity-95">Feel free to reach out. Our team of experts is here to help you plan your journey.</p>
                <div className="font-bold text-lg mb-1">📞 +91 9389860637</div>
                <div className="font-semibold text-sm">✉️ teamsathithya@gmail.com</div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <Footer />
      <MobileFooter />
    </div>
  );
}

