"use client";

import { useState } from "react";
import { X } from "lucide-react";

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

export function MentionsTeamGrid() {
  const [active, setActive] = useState<TeamMember | null>(null);

  return (
    <>
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
    </>
  );
}

