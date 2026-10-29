"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { GuideLayout, GUIDE_GOLD } from "@/components/guides/guide-layout";

const SEASON_PACKING = [
  {
    title: "Summer (March – June)",
    desc: "Pleasant days but cool evenings in the hills. Ideal for sightseeing, treks & family trips.",
    items: [
      "Light cotton clothes",
      "Light jacket or fleece",
      "Comfortable walking shoes",
      "Cap / sunglasses",
      "Sunscreen & lip balm",
      "Reusable water bottle",
    ],
  },
  {
    title: "Monsoon (July – September)",
    desc: "Lush greenery but frequent rains. Roads can be slippery — pack smart & waterproof.",
    items: [
      "Rain jacket / poncho",
      "Quick-dry clothes",
      "Waterproof backpack cover",
      "Good grip footwear",
      "Insect repellent",
      "Extra socks",
    ],
  },
  {
    title: "Autumn (October – November)",
    desc: "Clear skies, crisp air & best trekking season. Nights can get cold.",
    items: [
      "Warm layers",
      "Thermals (light)",
      "Windproof jacket",
      "Trekking shoes",
      "Gloves & beanie",
      "Day backpack",
    ],
  },
  {
    title: "Winter (December – February)",
    desc: "Cold temperatures & snowfall in higher regions like Auli, Chopta & treks.",
    items: [
      "Heavy woollens",
      "Thermal innerwear",
      "Down jacket",
      "Woollen cap & gloves",
      "Snow-friendly shoes",
      "Moisturiser & lip care",
    ],
  },
];

const TREK_ESSENTIALS = [
  "Backpack (40–60L)",
  "Trekking shoes (broken-in)",
  "Trekking poles",
  "Quick-dry t-shirts",
  "Thermals & fleece",
  "Rain cover",
  "Headlamp / torch",
  "Personal medicines",
  "Sunscreen & sunglasses",
  "Reusable cutlery",
];

const DOCUMENTS = [
  "Government ID (Aadhaar / Passport)",
  "Hotel or trek bookings",
  "Emergency contact list",
  "Offline maps",
  "Cash (ATMs limited in hills)",
];

export default function UttarakhandPackingListPage() {
  const router = useRouter();

  return (
    <GuideLayout
      heroImage="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
      heroAlt="Uttarakhand packing list"
      title="Uttarakhand Packing List"
      subtitle="What to pack for Uttarakhand — season-wise, trek-wise & practical essentials so you don’t overpack or forget the basics."
    >
      <section className="px-4 md:px-12 pb-20 space-y-20">
        <section className="space-y-12">
          <h2 className="text-3xl font-semibold" style={{ color: GUIDE_GOLD }}>
            Season-wise Packing
          </h2>
          <div className="grid md:grid-cols-2 gap-10">
            {SEASON_PACKING.map((s) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border shadow-sm dark:bg-neutral-900 transition-colors"
                style={{ borderColor: GUIDE_GOLD }}
              >
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 mb-4 dark:text-neutral-400">{s.desc}</p>
                <ul className="space-y-2 text-gray-700 dark:text-neutral-300">
                  {s.items.map((i) => (
                    <li key={i}>• {i}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        <section
          className="bg-white rounded-2xl p-10 border dark:bg-neutral-900 transition-colors"
          style={{ borderColor: GUIDE_GOLD }}
        >
          <h2 className="text-2xl font-semibold mb-4" style={{ color: GUIDE_GOLD }}>
            Trekking Essentials (Must-have)
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700 dark:text-neutral-300">
            {TREK_ESSENTIALS.map((i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-lg">✓</span>
                <span>{i}</span>
              </div>
            ))}
          </div>
        </section>

        <section
          className="bg-white rounded-2xl p-10 border dark:bg-neutral-900 transition-colors"
          style={{ borderColor: GUIDE_GOLD }}
        >
          <h2 className="text-2xl font-semibold mb-4" style={{ color: GUIDE_GOLD }}>
            Important Documents
          </h2>
          <ul className="space-y-2 text-gray-700 dark:text-neutral-300">
            {DOCUMENTS.map((d) => (
              <li key={d}>• {d}</li>
            ))}
          </ul>
        </section>

        <section
          className="bg-white rounded-2xl p-10 border dark:bg-neutral-900 transition-colors"
          style={{ borderColor: GUIDE_GOLD }}
        >
          <h3 className="text-2xl font-semibold mb-4">Smart Packing Tips</h3>
          <ul className="text-gray-700 space-y-2 dark:text-neutral-300">
            <li>• Layering is better than heavy clothing</li>
            <li>• Avoid new shoes just before treks</li>
            <li>• Carry medicines even for minor issues</li>
            <li>• Pack light — hill travel involves walking</li>
          </ul>
        </section>

        <div
          className="bg-white rounded-2xl p-10 border text-center dark:bg-neutral-900 transition-colors"
          style={{ borderColor: GUIDE_GOLD }}
        >
          <h3 className="text-2xl font-semibold mb-3">Planning a trek or itinerary?</h3>
          <p className="text-gray-600 mb-6 dark:text-neutral-400">
            Explore curated treks & trips with packing guidance included.
          </p>
          <button
            onClick={() => router.push("/explore-experience")}
            className="px-8 py-3 rounded-xl text-white cursor-pointer"
            style={{ background: GUIDE_GOLD }}
          >
            Explore Treks & Trips
          </button>
        </div>
      </section>
    </GuideLayout>
  );
}

