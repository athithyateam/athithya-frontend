export function BrandIntroSection() {
  return (
    <section className="relative overflow-hidden py-10 sm:py-14 md:py-16 bg-gradient-to-b from-amber-50/20 via-white to-white dark:from-neutral-900/30 dark:via-neutral-950 dark:to-neutral-950 transition-colors">
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[250px] bg-gradient-to-b from-[#C59A2F]/10 via-[#C59A2F]/5 to-transparent rounded-full blur-3xl opacity-60 dark:opacity-30" />

      <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-serif font-black text-neutral-900 dark:text-neutral-50 tracking-tight leading-[1.25] sm:leading-[1.3] mb-6 max-w-6xl mx-auto">
          It’s about the <span className="text-[#C59A2F]">experiences</span> you live along the way.
        </h2>

        <div className="w-full max-w-6xl mx-auto">
          <p className="text-base sm:text-lg md:text-xl lg:text-[1.35rem] text-neutral-700 dark:text-neutral-200 font-normal leading-relaxed md:leading-[1.9]">
            At <strong className="font-bold text-neutral-900 dark:text-white">Athithya</strong>, we believe travel is more than just visiting places. It’s about the experiences you live along the way. With Athithya, you can explore different travel experiences in <strong className="font-bold text-[#C59A2F]">Uttarakhand</strong> with <strong className="font-semibold text-neutral-900 dark:text-neutral-100">local hosts</strong>, from treks, rafting, and paragliding to camping, safaris, bungee jumping, and much more. Compare experiences, hosts, prices, reviews, and what’s included, all in one place, and find an experience that makes you feel alive.
          </p>
        </div>
      </div>
    </section>
  );
}
