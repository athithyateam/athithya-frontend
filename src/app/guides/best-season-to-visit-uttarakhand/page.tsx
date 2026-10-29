"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { GuideLayout, GUIDE_GOLD } from "@/components/guides/guide-layout";

function SeasonCard({
  title,
  badge,
  points,
  bestFor,
  tip,
}: {
  title: string;
  badge: string;
  points: string[];
  bestFor: string;
  tip: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl p-6 shadow-sm dark:bg-neutral-900 transition-colors"
    >
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-xl font-semibold">{title}</h3>
        <span className="text-xs px-3 py-1 rounded-full bg-[#fff7e6] dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 transition-colors">
          {badge}
        </span>
      </div>

      <ul className="list-disc pl-5 text-gray-700 space-y-1 mb-4 dark:text-neutral-300 transition-colors">
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>

      <p className="text-sm text-gray-600 mb-2 dark:text-neutral-400 transition-colors">
        <strong>Best for:</strong> {bestFor}
      </p>
      <p className="text-sm text-gray-500 dark:text-neutral-400 transition-colors">📌 {tip}</p>
    </motion.div>
  );
}

function PurposeCard({ title, value }: { title: string; value: string }) {
  return (
    <div
      className="bg-[#fffdf8] dark:bg-neutral-800 rounded-xl p-6 border text-center"
      style={{ borderColor: GUIDE_GOLD }}
    >
      <h4 className="text-lg font-medium mb-2">{title}</h4>
      <p className="text-gray-700 dark:text-neutral-300 transition-colors">{value}</p>
    </div>
  );
}

export default function BestSeasonUttarakhandPage() {
  const router = useRouter();
  return (
    <GuideLayout
      heroImage="https://www.peakadventuretour.com/assets/imgs/uttarakhand-tourism-01.webp"
      heroAlt="Uttarakhand mountains"
      title="Best Season to Visit Uttarakhand"
      subtitle="Weather, treks, temples & local tips — discover when Uttarakhand is perfect for your kind of travel."
      badges={
        <>
          <span>📍 Himalayas, India</span>
          <span>⏱ 4 min read</span>
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur">Travel Guide</span>
        </>
      }
    >
      <section className="px-4 md:px-12 pb-6 relative z-10">
        <div
          className="bg-white border-l-4 p-6 rounded-xl shadow-sm dark:bg-neutral-900 transition-colors"
          style={{ borderColor: GUIDE_GOLD }}
        >
          <p className="text-gray-800 text-lg dark:text-neutral-200 transition-colors">
            💡 <strong>Best time to visit:</strong>{" "}
            <span className="font-medium">March–June</span> for most travellers,{" "}
            <span className="font-medium">October–November</span> for trekking and clear mountain views.
          </p>
        </div>
      </section>

      <section className="px-4 md:px-12 py-12 space-y-14">
        <SeasonCard
          title="Spring & Summer (March – June)"
          badge="Best for most travellers"
          points={[
            "Pleasant weather (10°C – 25°C)",
            "Ideal for families & first-time visitors",
            "Perfect for sightseeing & hill stations",
          ]}
          bestFor="Sightseeing, families, couples"
          tip="Carry light woollens — evenings can be cool."
        />
        <SeasonCard
          title="Monsoon (July – September)"
          badge="Travel with caution"
          points={[
            "Heavy rainfall & landslides",
            "Lush green valleys",
            "Lower crowds & budget stays",
          ]}
          bestFor="Nature lovers, photographers"
          tip="Avoid high-altitude routes. Check road updates daily."
        />
        <SeasonCard
          title="Autumn (October – November)"
          badge="Trekker’s favourite"
          points={[
            "Crystal-clear Himalayan views",
            "Best trekking conditions",
            "Crisp, dry weather",
          ]}
          bestFor="Trekkers, adventure seekers"
          tip="Pack thermals — nights get cold."
        />
        <SeasonCard
          title="Winter (December – February)"
          badge="Snow lovers only"
          points={[
            "Snowfall in Auli, Chopta, Munsiyari",
            "Skiing & winter landscapes",
            "Very cold temperatures",
          ]}
          bestFor="Snow experience, skiing"
          tip="Check accessibility before booking."
        />
      </section>

      <section className="bg-white py-16 dark:bg-neutral-900 transition-colors">
        <div className="px-4 md:px-12">
          <h2 className="text-2xl font-semibold mb-8" style={{ color: GUIDE_GOLD }}>
            Best time by travel purpose
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <PurposeCard title="🏞 Sightseeing" value="March – June" />
            <PurposeCard title="🥾 Trekking" value="April – June · Oct – Nov" />
            <PurposeCard title="🕉 Pilgrimage" value="May – June · Sep – Oct" />
          </div>
        </div>
      </section>

      <section className="mx-6 px-6 py-20">
        <div
          className="rounded-2xl p-10 text-center shadow-sm bg-[#fffdf8] dark:bg-neutral-900"
          style={{ border: `1px solid ${GUIDE_GOLD}` }}
        >
          <h3 className="text-2xl font-semibold mb-3">Planning your Uttarakhand trip?</h3>
          <p className="text-gray-600 mb-6 dark:text-neutral-400 transition-colors">
            Explore curated treks, stays & experiences by local hosts.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => router.push("/explore-experience")}
              className="px-6 py-3 rounded-xl text-white cursor-pointer"
              style={{ background: GUIDE_GOLD }}
            >
              View Treks
            </button>
            <button
              onClick={() => router.push("/explore-experience")}
              className="px-6 py-3 rounded-xl border cursor-pointer"
              style={{ borderColor: GUIDE_GOLD, color: GUIDE_GOLD }}
            >
              Browse Homestays
            </button>
          </div>
        </div>
      </section>
    </GuideLayout>
  );
}
