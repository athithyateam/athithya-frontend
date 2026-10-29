"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { GuideLayout, GUIDE_GOLD } from "@/components/guides/guide-layout";

const GRAY = "#D1D5DB";

const COST_TIERS = [
  {
    title: "Budget Traveller",
    range: "₹1,200 – ₹2,500 / day",
    bestFor: "Backpackers, students, solo travellers",
    includes: [
      "Budget homestays or hostels",
      "Local buses & shared taxis",
      "Simple local food",
      "Short hikes & free attractions",
    ],
    note: "Ideal if you’re flexible with comfort and want to experience Uttarakhand slowly and economically.",
    dailyCosts: {
      food: "₹300 – ₹600 / day",
      transport: "₹500 – ₹1,000 / day",
      stay: "₹800 – ₹2,000 / night",
      treks: "₹2,500 – ₹5,000",
      activities: "₹500 – ₹1,500",
    },
  },
  {
    title: "Mid-Range Traveller",
    range: "₹3,000 – ₹6,000 / day",
    bestFor: "Families, couples",
    includes: [
      "Comfortable hotels or premium homestays",
      "Private taxis for local travel",
      "Restaurants & cafes",
      "Guided sightseeing & short treks",
    ],
    note: "The most popular travel style — balanced comfort, flexibility, and value.",
    dailyCosts: {
      food: "₹600 – ₹1,200 / day",
      transport: "₹1,000 – ₹2,000 / day",
      stay: "₹2,000 – ₹4,000 / night",
      treks: "₹3,000 – ₹7,000",
      activities: "₹1,000 – ₹2,500",
    },
  },
  {
    title: "Luxury Traveller",
    range: "₹8,000 – ₹15,000+ / day",
    bestFor: "Luxury seekers, special occasions",
    includes: [
      "Resorts & boutique stays",
      "Private chauffeurs",
      "Curated experiences",
      "Personal guides & premium activities",
    ],
    note: "For travellers who prefer privacy, premium stays, and curated mountain experiences.",
    dailyCosts: {
      food: "₹1,200 – ₹2,500 / day",
      transport: "₹2,000 – ₹5,000 / day",
      stay: "₹5,000 – ₹12,000 / night",
      treks: "₹5,000 – ₹12,000",
      activities: "₹2,000 – ₹3,500",
    },
  },
];

export default function UttarakhandTravelCostPage() {
  const router = useRouter();

  return (
    <GuideLayout
      heroImage="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
      heroAlt="Uttarakhand travel cost"
      title="Uttarakhand Travel Cost"
      subtitle="A realistic breakdown of how much it costs to travel Uttarakhand — from budget trips to luxury mountain escapes."
    >
      <section className="px-4 md:px-12 pb-20 space-y-28">
        {COST_TIERS.map((tier, i) => (
          <motion.section
            key={tier.title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-14 items-center"
          >
            <div className={i % 2 ? "md:order-2" : ""}>
              <div className="pl-6 border-l-4" style={{ borderColor: GUIDE_GOLD }}>
                <h3 className="text-3xl font-semibold mb-2">{tier.title}</h3>
                <p className="text-xl font-medium mb-4" style={{ color: GUIDE_GOLD }}>
                  {tier.range}
                </p>
                <p className="text-gray-700 mb-4 dark:text-neutral-300">
                  <strong>Best for:</strong> {tier.bestFor}
                </p>
                <ul className="text-gray-700 space-y-2 mb-4 dark:text-neutral-300">
                  {tier.includes.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
                <p className="text-sm text-gray-600 italic dark:text-neutral-400">{tier.note}</p>
              </div>
            </div>

            <div className={i % 2 ? "md:order-1" : ""}>
              <div className="bg-white rounded-2xl p-8 border shadow-sm border-gray-300 dark:bg-neutral-900 dark:border-neutral-600 transition-colors">
                <h4 className="text-lg font-semibold mb-4" style={{ color: GUIDE_GOLD }}>
                  Typical daily expenses
                </h4>
                <div className="space-y-3 text-sm">
                  {Object.entries(tier.dailyCosts).map(([key, cost]) => (
                    <div
                      key={key}
                      className="flex justify-between border-b pb-2"
                      style={{ borderBottomColor: GRAY }}
                    >
                      <span className="text-gray-600 capitalize dark:text-neutral-400">{key}</span>
                      <span className="font-medium">{cost}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        ))}

        <div
          className="bg-white rounded-2xl p-10 border dark:bg-neutral-900 transition-colors"
          style={{ borderColor: GUIDE_GOLD }}
        >
          <h3 className="text-2xl font-semibold mb-4">Money-Saving Tips</h3>
          <ul className="text-gray-700 space-y-2 dark:text-neutral-300">
            <li>• Travel during shoulder seasons (March & September)</li>
            <li>• Book treks & stays together for package discounts</li>
            <li>• Use shared taxis in hill towns</li>
            <li>• Avoid peak holiday weekends</li>
          </ul>
        </div>

        <div
          className="bg-white rounded-2xl p-10 border text-center dark:bg-neutral-900 transition-colors"
          style={{ borderColor: GUIDE_GOLD }}
        >
          <h3 className="text-2xl font-semibold mb-3">Planning within a budget?</h3>
          <p className="text-gray-600 mb-6 dark:text-neutral-400">
            Find treks, stays & itineraries that match your budget.
          </p>
          <button
            onClick={() => router.push("/explore-experience")}
            className="px-8 py-3 rounded-xl text-white cursor-pointer"
            style={{ background: GUIDE_GOLD }}
          >
            Explore Budget-Friendly Trips
          </button>
        </div>
      </section>
    </GuideLayout>
  );
}

