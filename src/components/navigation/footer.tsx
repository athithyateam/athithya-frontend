import Link from "next/link";
import { Mail } from "lucide-react";
import { routes } from "@/config/navigation";
import { FooterCurveDivider } from "./footer-curve";

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function YoutubeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#fbf8f0] via-[#f7f2e4] to-[#f2ebd4] dark:from-[#0d0d0d] dark:via-[#090909] dark:to-[#050505] transition-colors relative text-neutral-900 dark:text-neutral-100">
      <FooterCurveDivider />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 pb-8 sm:pb-12 md:pb-14 pt-8 sm:pt-10 md:pt-12">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 sm:gap-10 lg:gap-12 text-left">
          {/* Office Address */}
          <div className="col-span-2 lg:col-span-2 text-left">
            <address className="not-italic text-neutral-700 dark:text-neutral-300 text-sm sm:text-base font-medium leading-relaxed max-w-xs mb-4 sm:mb-5 border-l-2 border-[#C59A2F] pl-3.5 sm:pl-4 transition-colors">
              <span className="font-black text-[#C59A2F] uppercase tracking-widest text-xs mb-1.5 block">
                Registered Office
              </span>
              Athithya Brands<br />
              Clement Town<br />
              Dehradun, Uttarakhand — 248001
            </address>
            <Link
              href={routes.about}
              className="inline-flex items-center text-sm font-bold text-[#C59A2F] hover:text-[#A67F26] transition-colors border-b border-[#C59A2F]/40 pb-0.5"
            >
              Read Our Story &rarr;
            </Link>
          </div>

          {/* Explore Links */}
          <div className="col-span-1 text-left">
            <h4 className="font-black text-neutral-900 dark:text-neutral-100 text-sm uppercase tracking-wider mb-3 sm:mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 sm:space-y-3 text-neutral-600 dark:text-neutral-400 text-sm font-semibold">
              <li><Link href={routes.host} className="hover:text-[#C59A2F] transition-colors">For Host</Link></li>
              <li><Link href={routes.creators} className="hover:text-[#C59A2F] transition-colors">For Creators</Link></li>
              <li><Link href={routes.support} className="hover:text-[#C59A2F] transition-colors">Support</Link></li>
              <li><Link href={routes.safety} className="hover:text-[#C59A2F] transition-colors">Safety</Link></li>
              <li><Link href={routes.howItWorks} className="hover:text-[#C59A2F] transition-colors">How It Works</Link></li>
            </ul>
          </div>

          {/* Information Links */}
          <div className="col-span-1 text-left">
            <h4 className="font-black text-neutral-900 dark:text-neutral-100 text-sm uppercase tracking-wider mb-3 sm:mb-4">
              Information
            </h4>
            <ul className="space-y-2.5 sm:space-y-3 text-neutral-600 dark:text-neutral-400 text-sm font-semibold">
              <li><Link href={routes.terms} className="hover:text-[#C59A2F] transition-colors">Terms & Conditions</Link></li>
              <li><Link href={routes.privacy} className="hover:text-[#C59A2F] transition-colors">Privacy Policy</Link></li>
              <li><Link href={routes.mentions} className="hover:text-[#C59A2F] transition-colors">Special Mentions</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="col-span-2 text-left">
            <h4 className="font-black text-neutral-900 dark:text-neutral-100 text-sm uppercase tracking-wider mb-3 sm:mb-4">
              Stay Inspired
            </h4>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/athithya.in"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-[#E1306C] rounded-full shadow-xs border border-neutral-200/60 dark:border-neutral-700/60 transition-all cursor-pointer"
                aria-label="Instagram"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href="https://www.linkedin.com/company/athithya"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-[#0077b5] rounded-full shadow-xs border border-neutral-200/60 dark:border-neutral-700/60 transition-all cursor-pointer"
                aria-label="LinkedIn"
              >
                <LinkedinIcon size={18} />
              </a>
              <a
                href="https://www.youtube.com/@Athithyadotin"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-[#FF0000] rounded-full shadow-xs border border-neutral-200/60 dark:border-neutral-700/60 transition-all cursor-pointer"
                aria-label="YouTube"
              >
                <YoutubeIcon size={18} />
              </a>
              <a
                href="mailto:teamsathithya@gmail.com"
                className="p-2.5 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-[#C59A2F] rounded-full shadow-xs border border-neutral-200/60 dark:border-neutral-700/60 transition-all cursor-pointer"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-[#C59A2F]/20 dark:border-neutral-800/90 transition-colors">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 py-6 text-center">
          <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium">
            &copy; 2026{" "}
            <Link href={routes.home} className="text-[#C59A2F] hover:text-[#A67F26] font-bold hover:underline">
              Athithya
            </Link>
            . All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
