"use client";

import { motion } from "framer-motion";
import { GuideLayout, GUIDE_GOLD } from "@/components/guides/guide-layout";

const PLACES = [
  {
    id: "rishikesh",
    title: "Rishikesh",
    image: "https://s7ap1.scene7.com/is/image/incredibleindia/laxman%20jhula-rishikesh-uttrakhand-hero?qlt=82&ts=1726646312953",
    desc: "The Yoga Capital of the World, Rishikesh blends spirituality with adventure — from sacred Ganga aartis to river rafting.",
    bestFor: "Yoga, spirituality, adventure",
    bestSeason: "Feb – May · Sep – Nov",
    type: "Spiritual Town",
  },
  {
    id: "haridwar",
    title: "Haridwar",
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Evening_view_of_Har-ki-Pauri%2C_Haridwar.jpg",
    desc: "One of Hinduism’s holiest cities, where the Ganga descends to the plains. Famous for Ganga Aarti at Har Ki Pauri.",
    bestFor: "Pilgrimage, rituals, culture",
    bestSeason: "Oct – Apr",
    type: "Holy City",
  },
  {
    id: "kedarnath",
    title: "Kedarnath Temple",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/56/Kedarnath_Temple_in_Rainy_season.jpg",
    desc: "One of the Char Dham shrines, Kedarnath is a powerful spiritual destination set against dramatic Himalayan peaks.",
    bestFor: "Pilgrimage, spiritual seekers",
    bestSeason: "May – Jun · Sep",
    type: "Sacred Temple",
  },
  {
    id: "nainital",
    title: "Nainital",
    image: "https://www.epicyatra.com/wp-content/uploads/2023/10/WhatsApp-Image-2023-10-10-at-11.04.54.jpeg",
    desc: "A charming lake town surrounded by hills, ideal for families, honeymooners, and relaxed mountain holidays.",
    bestFor: "Families, couples, leisure",
    bestSeason: "Mar – Jun · Oct",
    type: "Hill Station",
  },
  {
    id: "mussoorie",
    title: "Mussoorie",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/aa/Mussoorie_landscape.jpg",
    desc: "The Queen of Hills offers colonial charm, waterfalls, viewpoints, and a pleasant climate year-round.",
    bestFor: "Sightseeing, couples",
    bestSeason: "Mar – Jun · Sep",
    type: "Hill Station",
  },
  {
    id: "auli",
    title: "Auli",
    image: "https://s3.india.com/wp-content/uploads/2024/08/Skiing-on-Pristine-Slopes.jpg?impolicy=Medium_Widthonly&w=350&h=263",
    desc: "India’s premier skiing destination with stunning Himalayan views, especially magical during winter snowfall.",
    bestFor: "Snow, skiing, views",
    bestSeason: "Dec – Feb · Apr – Jun",
    type: "Snow Destination",
  },
  {
    id: "chopta",
    title: "Chopta",
    image: "https://imgcld.yatra.com/ytimages/image/upload/t_yt_blog_c_fill_q_auto:good_f_auto_w_800_h_500/v1481019868/DO_NOT_USE_DISCOVER_INDIA_EDITORIAL/Chopta_Blog1.jpg",
    desc: "Often called Mini Switzerland of India, Chopta is the base for the Tungnath–Chandrashila trek.",
    bestFor: "Trekking, nature",
    bestSeason: "Apr – Jun · Oct – Nov",
    type: "Trekking Base",
  },
  {
    id: "valley-of-flowers",
    title: "Valley of Flowers",
    image: "https://www.trekupindia.com/wp-content/uploads/2024/05/uttrakhand-valley-of-flowers-trek-1024x576.webp",
    desc: "A UNESCO World Heritage Site famous for alpine flowers, blooming spectacularly during monsoon.",
    bestFor: "Nature lovers, photographers",
    bestSeason: "Jul – Sep",
    type: "National Park",
  },
  {
    id: "jim-corbett",
    title: "Jim Corbett National Park",
    image: "https://uttarakhandtourism.gov.in/assets/media/UTDB_media_1735984081Jungle_safari.jpg",
    desc: "India’s oldest national park, known for tiger safaris, dense forests, and rich wildlife.",
    bestFor: "Wildlife, safaris",
    bestSeason: "Nov – Jun",
    type: "Wildlife Reserve",
  },
];

export default function TopPlacesUttarakhandPage() {
  return (
    <GuideLayout
      heroImage="https://lp-cms-production.imgix.net/2022-03/GettyRF_956963154.jpg?auto=format,compress&q=72&w=1095&fit=crop&crop=faces,edges"
      heroAlt="Uttarakhand"
      title="Top Places to Visit in Uttarakhand"
      subtitle="Spiritual towns, alpine meadows, ski slopes & timeless hill stations — discover Uttarakhand’s best destinations."
    >
      <section className="px-4 md:px-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-14">
          <aside className="hidden lg:block">
            <div className="sticky top-24 bg-white rounded-xl p-5 border border-gray-200 dark:border-neutral-800 dark:bg-neutral-900 transition-colors">
              <h4 className="text-sm font-semibold mb-3" style={{ color: GUIDE_GOLD }}>
                On this page
              </h4>
              <ul className="space-y-2 text-sm">
                {PLACES.map((p) => (
                  <li key={p.id}>
                    <a
                      href={`#${p.id}`}
                      className="text-gray-600 hover:text-[#C59D5F] transition dark:text-neutral-400"
                    >
                      {p.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="space-y-24">
            {PLACES.map((p, i) => (
              <motion.section
                key={p.id}
                id={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid md:grid-cols-2 gap-12 items-center"
              >
                <div className={i % 2 !== 0 ? "md:order-2" : ""}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                      {p.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-2xl font-semibold">{p.title}</h3>
                    <span
                      className="text-xs px-3 py-1 rounded-full bg-[#fffdf8] dark:bg-neutral-900"
                      style={{ border: `1px solid ${GUIDE_GOLD}`, color: GUIDE_GOLD }}
                    >
                      Best: {p.bestSeason}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed dark:text-neutral-300">{p.desc}</p>
                  <p className="text-sm text-gray-600 dark:text-neutral-400">
                    <strong>Best for:</strong> {p.bestFor}
                  </p>
                </div>

                <div className={i % 2 !== 0 ? "md:order-1" : ""}>
                  <div className="relative overflow-hidden rounded-2xl shadow-md">
                    <img
                      loading="lazy"
                      decoding="async"
                      src={p.image}
                      alt={p.title}
                      className="w-full h-80 object-cover transition duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                  </div>
                </div>
              </motion.section>
            ))}
          </div>
        </div>
      </section>
    </GuideLayout>
  );
}

