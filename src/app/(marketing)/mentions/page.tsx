import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { MentionsTeamGrid } from "@/components/marketing/mentions-team-grid";

export const metadata: Metadata = {
  title: "Special Mentions & Team | Athithya",
  description:
    "Celebrating the passionate people behind Athithya. A special thanks to our community of users, hosts, and dedicated team members building the future of authentic travel.",
  alternates: { canonical: "https://athithya.in/mentions" },
  openGraph: {
    title: "Special Mentions & Team | Athithya",
    description:
      "Celebrating the passionate people behind Athithya. A special thanks to our community of users, hosts, and dedicated team members building the future of authentic travel.",
    url: "https://athithya.in/mentions",
    type: "website",
  },
};

export default function SpecialMentionsPage() {
  return (
    <div className="text-neutral-900 dark:text-neutral-100 transition-colors duration-300 pb-16 md:pb-24">
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
          <div className="bg-[#FAF8F5] dark:bg-neutral-900 border-l-4 sm:border-l-[6px] border-[#C59A2F] p-6 sm:p-8 rounded-r-3xl shadow-xs border border-neutral-200/70 dark:border-neutral-800 transition-colors">
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
          <div className="border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 md:p-10 bg-[#FAF8F5] dark:bg-neutral-900 shadow-xs">
            <h3 className="font-extrabold mb-3 text-xl sm:text-2xl text-neutral-900 dark:text-neutral-100">
              A special note of thanks
            </h3>
            <p className="text-sm sm:text-base leading-relaxed mb-8 text-neutral-600 dark:text-neutral-300 max-w-3xl">
              To our incredible teammates for their dedication and passion in ensuring Athithya stays true
              to its values, standards, and exceptional service.
            </p>

            <MentionsTeamGrid />
          </div>
        </section>

        {/* Join Journey CTA */}
        <section className="w-full">
          <div className="w-full bg-[#FAF8F5] dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-8 md:p-12 shadow-xs text-center">
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
    </div>
  );
}
