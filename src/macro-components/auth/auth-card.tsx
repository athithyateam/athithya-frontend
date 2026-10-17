import { AuthHeroBanner } from "./auth-hero-banner";
import { AuthForm } from "./auth-form";
import type { AuthCardProps } from "./types";

export function AuthCard({
  slides,
  intervalMs = 2500,
  className = "",
}: AuthCardProps) {
  return (
    <div
      className={`w-full max-w-md md:max-w-[1035px] mx-auto my-auto rounded-3xl bg-[#0D0D10] border border-[#1F1F24] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] p-2 sm:p-3 md:p-3.5 overflow-hidden ${className}`}
    >
      <div className="flex flex-col md:flex-row w-full min-h-[580px] md:min-h-[665px]">
        {/* Left Side: Athithya Dynamic Travel Carousel Hero */}
        <AuthHeroBanner slides={slides} intervalMs={intervalMs} />

        {/* Right Side: Authentication Form */}
        <AuthForm />
      </div>
    </div>
  );
}
