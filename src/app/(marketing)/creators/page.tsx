"use client";

import { Mail, Phone, Heart, ArrowRight, Check } from "lucide-react";

interface PolaroidProps {
  src: string;
  caption: string;
  rotate?: number;
  className?: string;
}

function PolaroidCard({ src, caption, rotate = 0, className = "" }: PolaroidProps) {
  return (
    <div
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`relative bg-white dark:bg-neutral-800 p-2.5 sm:p-3 pb-4 sm:pb-5 rounded-md shadow-md hover:shadow-2xl border border-neutral-200/80 dark:border-neutral-700/80 transition-all select-none group cursor-pointer hover:scale-105 hover:rotate-0 hover:z-30 ${className}`}
    >
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-3.5 bg-[#C59A2F]/30 backdrop-blur-xs rotate-[-2deg] rounded-xs pointer-events-none shadow-2xs border-t border-b border-[#C59A2F]/40" />

      <div className="relative aspect-[4/3] overflow-hidden rounded-xs bg-neutral-100 dark:bg-neutral-900">
        <img
          src={src}
          alt={caption}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className="mt-2 text-center">
        <p className="font-serif italic text-sm sm:text-base text-neutral-800 dark:text-neutral-200 tracking-wide leading-none">
          {caption}
        </p>
      </div>
    </div>
  );
}

export default function CreatorsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300 pb-16 md:pb-24">
      <section className="pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 relative overflow-hidden text-center">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-neutral-800 text-xs font-bold text-[#C59A2F] border border-amber-200 uppercase tracking-wider mb-3 mx-auto">
            Creator Community
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-tight tracking-wide">
            Inspire &amp; Create with <span className="text-[#C59A2F]">Athithya</span>
          </h1>
          <p className="text-neutral-700 dark:text-neutral-300 text-sm sm:text-base md:text-lg max-w-2xl font-semibold mt-2 leading-relaxed mx-auto">
            Share what you experience. Tell stories behind it. Help people experience travel differently.
          </p>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 space-y-8 md:space-y-12">
        {/* Storytelling & Spotlight */}
        <section className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-[#FAF8F5]/80 dark:bg-neutral-900/60 p-6 sm:p-8 md:p-10 shadow-xs backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1 flex items-center justify-center gap-3 sm:gap-4 py-3 sm:py-6">
              <PolaroidCard
                src="/images/creator-1.jpg"
                caption="Behind the Lens"
                rotate={-3}
                className="w-[145px] sm:w-[185px] md:w-[210px]"
              />
              <PolaroidCard
                src="/images/trek/trek-2.jpeg"
                caption="Sunrise in Garhwal"
                rotate={3}
                className="w-[145px] sm:w-[185px] md:w-[210px]"
              />
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 text-left space-y-4">
              <blockquote className="italic border-l-3 border-[#C59A2F] pl-4 py-1 text-neutral-800 dark:text-neutral-200 font-semibold text-sm sm:text-base">
                &ldquo;We believe in the transformative power of storytelling and the magic that travel experiences bring to our lives.&rdquo;
              </blockquote>

              <p className="text-sm sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                Whether you are a travel blogger, filmmaker, storyteller, photographer or local cultural enthusiast, we provide the platform, audience, and community that helps you turn your passion into lasting influence.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  "Spotlight on You",
                  "Feature your travel content & guides",
                  "Collaborate directly with verified hosts",
                  "Get more visibility",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800/80 p-3.5 rounded-xl border border-neutral-200/70 dark:border-neutral-700/70"
                  >
                    <Check className="text-[#C59A2F] shrink-0 w-4 h-4" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-[#FAF8F5]/80 dark:bg-neutral-900/60 p-6 sm:p-8 md:p-10 shadow-xs backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 text-left space-y-4">
              <div className="flex items-center gap-3.5 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-neutral-800 border border-amber-200 text-[#C59A2F] flex items-center justify-center shrink-0">
                  <Heart size={24} />
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
                  Our Philosophy
                </h2>
              </div>

              <p className="text-sm sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                Meaningful travel experiences come from real, honest storytelling. We empower emerging creators, providing the visibility and recognition they deserve.
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                Through our creator initiatives, we partner with independent travel creators. If you believe you can create a positive impact on conscious travel, we would love to collaborate!
              </p>
              <div className="p-4 rounded-2xl bg-white dark:bg-neutral-800/80 border border-neutral-200/70 dark:border-neutral-700/70">
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  No high follower count required. What matters most is authenticity, real storytelling, and a passion for respectful exploration.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 flex items-center justify-center gap-3 sm:gap-4 py-3 sm:py-6">
              <PolaroidCard
                src="/images/travel-4.jpg"
                caption="Village Warmth"
                rotate={3}
                className="w-[145px] sm:w-[185px] md:w-[210px]"
              />
              <PolaroidCard
                src="/images/creator-2.jpeg"
                caption="Stories Behind Faces"
                rotate={-3}
                className="w-[145px] sm:w-[185px] md:w-[210px]"
              />
            </div>
          </div>
        </section>

        {/* Community Banner */}
        <section className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-[#FAF8F5]/80 dark:bg-neutral-900/60 p-6 sm:p-8 md:p-10 shadow-xs backdrop-blur-sm text-center">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 mb-2">
            Join our Growing Creator Community
          </h3>
          <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed mb-6 max-w-xl mx-auto">
            Share your journey with the world. Let&apos;s collaborate and craft something truly inspiring together.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-white dark:bg-neutral-800 px-4 py-2.5 rounded-full shadow-xs border border-neutral-200/70 dark:border-neutral-700 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              <Phone className="text-[#C59A2F] w-4 h-4" />
              <span>+91 93898 60637</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-neutral-800 px-4 py-2.5 rounded-full shadow-xs border border-neutral-200/70 dark:border-neutral-700 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
              <Mail className="text-[#C59A2F] w-4 h-4" />
              <a href="mailto:teamsathithya@gmail.com" className="hover:text-[#C59A2F] transition">
                teamsathithya@gmail.com
              </a>
            </div>
          </div>

          <a
            href="mailto:teamsathithya@gmail.com?subject=Creator%20Collaboration%20with%20Athithya"
            className="px-8 py-3.5 rounded-full bg-[#C59A2F] text-white text-xs sm:text-sm font-black uppercase tracking-wider hover:bg-[#A67F26] transition shadow-md inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Connect With Us</span>
            <ArrowRight size={15} />
          </a>
        </section>
      </div>
    </main>
  );
}
