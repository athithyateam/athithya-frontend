import Link from "next/link";
import {
  Shield,
  MessageCircle,
  UserCheck,
  MapPin,
  Eye,
  AlertTriangle,
  Lock,
  ArrowRight,
} from "lucide-react";
import { routes } from "@/config/navigation";

const safetyPillars = [
  {
    icon: MessageCircle,
    title: "In-App Secure Messaging",
    points: [
      "Communicate safely through direct encrypted chat before accepting any invitation.",
      "Clarify meeting spots, and schedules without sharing personal numbers.",
      "Full conversation history for transparency and safety audit.",
    ],
  },
  {
    icon: UserCheck,
    title: "Control Over Connections",
    points: [
      "Accept or decline invitations and bookings at your own discretion.",
      "Instant one-click user blocking and profile reporting.",
      "Customizable privacy controls and visibility preferences.",
    ],
  },
  {
    icon: Eye,
    title: "Verified Hosts & Reviews",
    points: [
      "Government-verified host identity badges before listing approval.",
      "Authentic guest ratings and unfiltered feedback timestamps.",
      "Transparent host background, years of local expertise, and past activities.",
    ],
  },
  {
    icon: MapPin,
    title: "Transparent Locations",
    points: [
      "Interactive pinpoint maps with verified start and meeting points.",
      "Detailed difficulty ratings, duration, and terrain disclosures.",
      "Safety instructions and emergency contact details.",
    ],
  },
  {
    icon: Shield,
    title: "Community Guidelines",
    points: [
      "Deep respect for indigenous cultures, ecology, and tradition.",
      "Zero-tolerance stance against harassment, discrimination, or misconduct.",
      "Strict adherence to Leave No Trace principles in natural environments.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Zero-Tolerance Policy",
    points: [
      "Immediate temporary suspension upon safety escalation or report.",
      "Permanent platform ban and device blacklisting for verified violations.",
      "Cooperation with local law enforcement and authorities when required.",
    ],
  },
];

export default function SafetyPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300 pb-16 md:pb-24">
      <section className="pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 relative overflow-hidden text-center">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-tight tracking-wide">
            Safety Guidelines at <span className="text-[#C59A2F]">Athithya</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base md:text-lg max-w-3xl font-medium mt-2 leading-relaxed mx-auto">
            Trust, authentic connections, and safety are at the core of everything we do. We are committed to providing a secure, transparent, and respectful environment for every traveller, guest and host across the platform.
          </p>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 space-y-10 md:space-y-16">
        <section className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-[#FAF8F5]/80 dark:bg-neutral-900/60 p-6 sm:p-8 md:p-10 shadow-xs backdrop-blur-sm">
          <div className="mb-6 md:mb-8 text-center max-w-2xl mx-auto">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-tight tracking-wide">
              Our Safety <span className="text-[#C59A2F]">Standards</span>
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm md:text-base font-semibold mt-1">
              How we protect and support our community across every booking and travel interaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {safetyPillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="bg-white dark:bg-neutral-800/90 rounded-2xl border border-neutral-200/70 dark:border-neutral-700/70 p-5 sm:p-6 shadow-xs hover:border-[#C59A2F]/40 hover:shadow-md transition-all duration-300 flex flex-col h-full text-left"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-neutral-800 border border-amber-200 text-[#C59A2F] mb-4 flex items-center justify-center shrink-0">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-3">
                    {pillar.title}
                  </h3>
                  <ul className="space-y-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 grow">
                    {pillar.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C59A2F] mt-2 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-[#FAF8F5]/80 dark:bg-neutral-900/60 p-6 sm:p-8 md:p-10 shadow-xs backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-neutral-800 border border-amber-200 text-[#C59A2F] flex items-center justify-center shrink-0 mt-0.5">
                <Lock size={22} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-neutral-900 dark:text-neutral-100">
                  Safety is a Shared Commitment
                </h3>
                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-1.5 max-w-2xl leading-relaxed">
                  Help us in making our Safety guidelines strong and effective and for any issues and suggestions, do reach out to us.
                </p>
              </div>
            </div>

            <Link
              href={routes.support}
              className="px-6 py-3 rounded-full bg-[#C59A2F] text-white text-xs font-black uppercase tracking-wider hover:bg-[#A67F26] transition shadow-md inline-flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>Help &amp; Support</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
