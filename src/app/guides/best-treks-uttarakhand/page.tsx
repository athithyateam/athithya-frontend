"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { GuideLayout, GuideBadge, GUIDE_GOLD } from "@/components/guides/guide-layout";

const TREKS = [
  {
    id: "kedarkantha",
    level: "Beginner",
    name: "Kedarkantha Trek",
    image: "https://montaxe.com/wp-content/uploads/2024/09/Kedarkantha-Winter-Trek-Montaxe-28.webp",
    duration: "5D / 4N",
    altitude: "12,500 ft",
    season: "Dec – Apr",
    desc: "Kedarkantha is one of India’s most loved beginner treks, especially famous for its winter landscapes. The trail passes through dense pine forests, frozen streams, and snow-covered clearings before opening up to a breathtaking summit view. It’s ideal for first-time trekkers who want a true Himalayan experience without extreme difficulty.",
  },
  {
    id: "nag-tibba",
    level: "Beginner",
    name: "Nag Tibba Trek",
    image: "https://moxtain.s3.ap-south-1.amazonaws.com/blogs/NagTibbaBeginnersTrek/nag-tibba-range.jpg",
    duration: "2D / 1N",
    altitude: "9,900 ft",
    season: "Oct – Mar",
    desc: "Nag Tibba is a perfect introduction to trekking in Uttarakhand. Short, scenic, and accessible, this trek offers panoramic views of Bandarpoonch and Swargarohini ranges. It’s ideal for weekend travellers, families, and anyone testing their fitness before attempting longer Himalayan treks.",
  },
  {
    id: "valley-of-flowers",
    level: "Moderate",
    name: "Valley of Flowers",
    image: "https://www.trekupindia.com/wp-content/uploads/2024/05/uttrakhand-valley-of-flowers-trek-1024x576.webp",
    duration: "6D / 5N",
    altitude: "14,100 ft",
    season: "Jul – Sep",
    desc: "A UNESCO World Heritage Site, the Valley of Flowers trek is a visual masterpiece. During monsoon months, the valley transforms into a vibrant carpet of rare alpine flowers, waterfalls, and misty mountain backdrops. The trek combines moderate physical challenge with unmatched natural beauty, making it ideal for nature lovers and photographers.",
  },
  {
    id: "har-ki-dun",
    level: "Moderate",
    name: "Har Ki Dun",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Har_Ki_Dun.jpg",
    duration: "7D / 6N",
    altitude: "11,700 ft",
    season: "Apr – Jun · Sep – Nov",
    desc: "Often called the ‘Valley of Gods’, Har Ki Dun is a culturally rich trek that takes you through ancient Himalayan villages, terraced farms, pine forests, and glacial rivers. The gradual ascent makes it suitable for trekkers looking to move beyond beginner routes while experiencing local mountain life and mythology.",
  },
  {
    id: "roopkund",
    level: "Difficult",
    name: "Roopkund Trek",
    image: "https://himalayanambition.in/wp-content/uploads/2023/10/BlogspotImageUrl44719-Bikat-Adventures.jpg",
    duration: "8D / 7N",
    altitude: "16,500 ft",
    season: "May – Jun · Sep",
    desc: "Roopkund is a high-altitude trek known for its mystery and demanding terrain. The trail crosses alpine meadows, snowfields, and steep climbs before reaching the famous Skeleton Lake. This trek is best suited for experienced trekkers who are comfortable with long days, altitude gain, and unpredictable mountain weather.",
  },
  {
    id: "bali-pass",
    level: "Difficult",
    name: "Bali Pass Trek",
    image: "https://images.prismic.io/indiahike/37839eb1-905d-4697-9f0c-226fcd11dc09_Bali+Pass_BP_3.jpg?auto=compress,format",
    duration: "9D / 8N",
    altitude: "16,200 ft",
    season: "May – Jun · Sep",
    desc: "Bali Pass is an advanced crossover trek connecting Har Ki Dun to Yamunotri. It involves steep ascents, snow crossings, and technical sections at high altitude. This trek is meant for seasoned trekkers seeking adventure, endurance testing, and raw Himalayan wilderness.",
  },
];

export default function BestTreksUttarakhandPage() {
  const router = useRouter();

  return (
    <GuideLayout
      heroImage="https://www.bikatadventures.com/images/BlogspotContents/BlogspotImageUrl64790.jpg"
      heroAlt="Uttarakhand Treks"
      title="Best Treks in Uttarakhand"
      subtitle="Discover Uttarakhand’s most iconic treks — explained by difficulty, season, and experience level."
    >
      <section className="px-4 md:px-12 pb-20 space-y-28">
        {TREKS.map((t, i) => (
          <motion.section
            key={t.id}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-14 items-center"
          >
            <div className={i % 2 ? "md:order-2" : ""}>
              <div className="pl-6 border-l-4" style={{ borderColor: GUIDE_GOLD }}>
                <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                  {t.level} Trek
                </span>
                <h3 className="text-3xl font-semibold mt-2 mb-4">{t.name}</h3>
                <div className="flex flex-wrap gap-2 text-xs mb-5">
                  <GuideBadge label={t.duration} />
                  <GuideBadge label={t.altitude} />
                  <GuideBadge label={`Best season: ${t.season}`} />
                </div>
                <p className="text-gray-700 leading-relaxed text-[15px] dark:text-neutral-300">
                  {t.desc}
                </p>
              </div>
            </div>

            <div className={i % 2 ? "md:order-1" : ""}>
              <div className="relative overflow-hidden rounded-2xl shadow-md">
                <img
                  loading="lazy"
                  decoding="async"
                  src={t.image}
                  alt={t.name}
                  className="h-96 w-full object-cover transition duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
            </div>
          </motion.section>
        ))}

        <div className="bg-white rounded-2xl p-10 border text-center border-[#C5BC42] dark:bg-neutral-900 transition-colors">
          <h3 className="text-2xl font-semibold mb-3">Planning a trek in Uttarakhand?</h3>
          <p className="text-gray-600 mb-6 dark:text-neutral-400">
            Explore curated treks, trusted hosts, and complete itineraries designed for every experience level.
          </p>
          <button
            onClick={() => router.push("/explore-experience")}
            className="px-8 py-3 rounded-xl text-white cursor-pointer"
            style={{ background: GUIDE_GOLD }}
          >
            Explore Treks & Hosts
          </button>
        </div>
      </section>
    </GuideLayout>
  );
}
