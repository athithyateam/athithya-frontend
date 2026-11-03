import { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { MobileFooter } from "@/components/navigation/mobile-footer";

export const metadata: Metadata = {
  title: "Experience Details | Athithya",
  description: "Experience details on Athithya.",
};

async function ExperienceDetailContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight">Experience: {slug}</h1>
    </div>
  );
}

export default function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="relative min-h-screen flex flex-col pb-16 md:pb-0 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      <Navbar />
      <main className="grow pt-24">
        <Suspense
          fallback={
            <div className="min-h-screen pt-28 text-center text-sm text-neutral-400">
              Loading experience...
            </div>
          }
        >
          <ExperienceDetailContent params={params} />
        </Suspense>
      </main>
      <Footer />
      <MobileFooter />
    </div>
  );
}
