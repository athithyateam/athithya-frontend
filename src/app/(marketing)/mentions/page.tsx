"use client";

import { useState } from "react";
import { Mail, Phone, X } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  img?: string;
  bio: string;
}

const team: TeamMember[] = [
  {
    name: "Shivani",
    role: "Marketing",
    img: "/members/vansh-photo.jpg",
    bio: "Builds campaigns that connect the right audiences with the right experiences.",
  },
  {
    name: "Yuvraj",
    role: "Finance / Legal",
    img: "/members/yuvraj-photo.jpg",
    bio: "Keeps our operations sharp and compliant while enabling smart growth.",
  },
  {
    name: "Suraj",
    role: "Tech Lead",
    img: "/members/suraj-photo.jpg",
    bio: "Leads our engineering stack with a focus on performance, accessibility, and clean DX.",
  },
  {
    name: "Muskan",
    role: "Design Lead",
    img: "/members/muskan-photo.jpg",
    bio: "Crafts human-centered interfaces and visual systems that scale across devices.",
  },
];

export default function SpecialMentionsPage() {
  const [active, setActive] = useState<TeamMember | null>(null);

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300 pb-16 md:pb-24">
      <section className="pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 relative overflow-hidden text-center">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-tight tracking-wide">
            Special <span className="text-[#C59A2F]">Mentions</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base md:text-lg max-w-3xl font-medium mt-2 leading-relaxed mx-auto">
            Celebrating the people behind making every journey on Athithya worth it.
          </p>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 space-y-10 md:space-y-16">
        {/* Community Appreciation */}
        <section className="w-full text-left">
          <div className="bg-[#FAF8F5]/90 dark:bg-neutral-900/60 backdrop-blur-sm border-l-4 sm:border-l-[6px] border-[#C59A2F] p-6 sm:p-8 rounded-r-3xl shadow-xs border border-neutral-200/70 dark:border-neutral-800 transition-colors">
            <h2 className="text-xl sm:text-2xl font-extrabold mb-3 text-neutral-900 dark:text-neutral-100">
              To Our Community
            </h2>
            <blockquote className="text-sm sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-300 italic">
              &ldquo;We extend heartfelt thanks to all our Users and Hosts for placing your trust in us. Your
              confidence fuels our passion, and we are committed to safeguarding this trust for years to
              come.&rdquo;
            </blockquote>
          </div>
        </section>

        {/* Team Grid */}
        <section className="w-full text-left">
          <div className="border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 md:p-10 bg-[#FAF8F5]/80 dark:bg-neutral-900/60 shadow-xs backdrop-blur-sm">
            <h3 className="font-extrabold mb-3 text-xl sm:text-2xl text-neutral-900 dark:text-neutral-100">
              A special note of thanks
            </h3>
            <p className="text-sm sm:text-base leading-relaxed mb-8 text-neutral-600 dark:text-neutral-300 max-w-3xl">
              To our incredible teammates for their dedication and passion in ensuring Athithya stays true
              to its values, standards, and exceptional service.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {team.map((m) => (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => setActive(m)}
                  className="w-full text-left rounded-2xl border border-neutral-200/70 dark:border-neutral-700/70 bg-white dark:bg-neutral-800/90 hover:border-[#C59A2F]/40 transition-all duration-300 shadow-xs hover:shadow-md p-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-amber-200/60 dark:ring-neutral-700 shrink-0">
                      <img
                        src={m.img || "/members/suraj-photo.jpg"}
                        alt={m.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-neutral-900 dark:text-neutral-100 truncate">
                        {m.name}
                      </div>
                      <div className="text-xs text-[#C59A2F] font-bold truncate uppercase tracking-wider">
                        {m.role}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Join Journey CTA */}
        <section className="w-full">
          <div className="w-full bg-[#FAF8F5]/80 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-8 md:p-12 shadow-xs text-center backdrop-blur-sm">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 mb-3">
              Join Our Journey
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
              We’re always looking for passionate individuals to join our team. If you share our love for
              making travel and experiences easier and more enjoyable, we’d love to hear from you.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-neutral-700 dark:text-neutral-300 mb-8">
              <div className="flex items-center gap-2 bg-white dark:bg-neutral-800 px-5 py-2.5 rounded-full shadow-xs border border-neutral-200/70 dark:border-neutral-700 font-semibold">
                <Phone className="text-[#C59A2F] w-4 h-4" />
                <span>+91-9389860637</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-neutral-800 px-5 py-2.5 rounded-full shadow-xs border border-neutral-200/70 dark:border-neutral-700 font-semibold">
                <Mail className="text-[#C59A2F] w-4 h-4" />
                <a href="mailto:teamsathithya@gmail.com" className="hover:text-[#C59A2F] transition">
                  teamsathithya@gmail.com
                </a>
              </div>
            </div>

            <a
              href="mailto:teamsathithya@gmail.com?subject=Joining%20the%20Athithya%20Team"
              className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-white font-black text-xs uppercase tracking-wider shadow-md bg-[#C59A2F] hover:bg-[#A67F26] transition cursor-pointer"
            >
              <span>Send us an Email</span>
              <Mail size={15} />
            </a>
          </div>
        </section>
      </div>

      {/* Team Member Modal */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setActive(null)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 p-6 shadow-2xl border border-neutral-200 dark:border-neutral-700"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute right-3 top-3 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
            >
              <X className="w-5 h-5 text-[#C59A2F]" />
            </button>
            <div className="flex items-center gap-4 mb-4 text-left">
              <img
                src={active.img || "/members/suraj-photo.jpg"}
                alt={active.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-amber-200"
              />
              <div>
                <h4 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  {active.name}
                </h4>
                <div className="text-xs font-bold text-[#C59A2F] uppercase tracking-wider">
                  {active.role}
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 text-left">
              {active.bio}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
