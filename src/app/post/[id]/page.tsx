import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { getCachedExperience } from "@/lib/api/experience-detail-data";
import { PostHeroGallery } from "@/components/post/post-hero-gallery";
import { BookingWidget } from "@/components/post/booking-widget";
import { HostReviewsSection } from "@/components/post/host-reviews-section";
import { MapViewer } from "@/components/ui/map-viewer";
import { ExperienceCard } from "@/components/cards/experience-card";
import { ExperienceNavTabs } from "@/components/post/experience-nav-tabs";
import { ExperienceDescription } from "@/components/post/experience-description";
import { ExperienceJsonLd } from "@/components/post/experience-json-ld";
import { ChecklistSection } from "@/components/post/checklist-section";

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const data = await getCachedExperience(id);
  const post = data?.experience;

  if (!post) {
    return {
      title: "Experience Not Found | Athithya",
      description: "The requested experience could not be found on Athithya.",
      robots: { index: false, follow: false },
    };
  }

  const titleStr = typeof post.title === "string" ? post.title : "Experience";
  const title = `${titleStr} | Athithya`;
  const descStr =
    typeof post.subtitle === "string"
      ? post.subtitle
      : typeof post.description === "string"
      ? post.description.slice(0, 160)
      : `Book ${titleStr} with local hosts on Athithya.`;

  const rawPhotos = Array.isArray(post.photos) ? post.photos : [];
  const images = rawPhotos
    .map((p: unknown) => {
      if (typeof p === "string") return p;
      if (p && typeof p === "object" && "url" in p) {
        return (p as { url?: string }).url;
      }
      return null;
    })
    .filter((url): url is string => Boolean(url));

  const primaryImage = images[0] || "https://athithya.in/og-image.jpg";

  return {
    title,
    description: descStr,
    alternates: {
      canonical: `/post/${id}`,
    },
    openGraph: {
      title,
      description: descStr,
      url: `https://athithya.in/post/${id}`,
      siteName: "Athithya",
      images: images.slice(0, 4).map((url: string) => ({
        url,
        alt: titleStr,
      })),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: descStr,
      images: [primaryImage],
    },
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: postId } = await params;
  const data = await getCachedExperience(postId);
  const post = data?.experience;
  const similarExperiences = data?.similarExperiences || [];

  if (!post) {
    notFound();
  }

  const locationObj = post.location as Record<string, unknown> | undefined;
  const locationText = [
    locationObj?.city,
    locationObj?.state,
    locationObj?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const userObj = post.user as Record<string, unknown> | undefined;
  const hostId = (userObj?._id || userObj?.id) as string | undefined;

  const titleStr = typeof post.title === "string" ? post.title : "Experience";
  const descStr = typeof post.description === "string" ? post.description : "";
  const longDescStr =
    typeof post.longDescription === "string" ? post.longDescription : undefined;

  const categories = Array.isArray(post.categories)
    ? (post.categories as string[])
    : [];
  const postTypeStr =
    typeof post.postType === "string" ? post.postType : "Experience";

  const privacyPolicy = Array.isArray(post.privacyPolicy)
    ? (post.privacyPolicy as string[])
    : [];
  const amenities = Array.isArray(post.amenities)
    ? (post.amenities as string[])
    : [];

  const coordObj = locationObj?.coordinates as Record<string, unknown> | undefined;
  const coordArray = Array.isArray(coordObj?.coordinates)
    ? (coordObj.coordinates as number[])
    : undefined;

  return (
    <>
      <ExperienceJsonLd post={post} id={postId} />
      <PostHeroGallery post={post} />

      <header className="text-left space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {categories.length > 0 ? (
            categories.map((cat: string, idx: number) => (
              <span
                key={idx}
                className="bg-[#C59A2F]/10 text-[#C59A2F] border border-[#C59A2F]/20 px-3 py-1 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-wider"
              >
                {cat}
              </span>
            ))
          ) : (
            <span className="bg-[#C59A2F]/10 text-[#C59A2F] border border-[#C59A2F]/20 px-3 py-1 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-wider">
              {postTypeStr}
            </span>
          )}
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
          {titleStr}
        </h1>

        {locationText && (
          <div className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-neutral-700 dark:text-neutral-300 pb-2">
            <MapPin className="text-[#C59A2F] shrink-0" size={14} />
            <span>{locationText}</span>
          </div>
        )}
      </header>

      <ExperienceNavTabs
        hasRules={Boolean(privacyPolicy.length)}
        hasAmenities={Boolean(amenities.length)}
        hasLocation={Boolean(coordArray && coordArray.length >= 2)}
        hasReviews={true}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 pt-4">
        <article className="lg:col-span-7 xl:col-span-8 space-y-8 min-w-0">
          <ExperienceDescription
            description={descStr}
            longDescription={longDescStr}
          />

          <ChecklistSection
            id="section-rules"
            title="Rules"
            items={privacyPolicy}
            iconColor="text-[#C59A2F]"
          />

          <ChecklistSection
            id="section-amenities"
            title="Amenities"
            items={amenities}
            iconColor="text-emerald-500"
          />

          {coordArray && coordArray.length >= 2 && (
            <section id="section-location" className="scroll-mt-32 space-y-4">
              <h3 className="text-base md:text-xl font-black uppercase tracking-tight">
                Pinned Location
              </h3>
              <div className="rounded-3xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800">
                <MapViewer
                  lat={coordArray[1]}
                  lng={coordArray[0]}
                  city={typeof locationObj?.city === "string" ? locationObj.city : undefined}
                  state={typeof locationObj?.state === "string" ? locationObj.state : undefined}
                  address={typeof locationObj?.address === "string" ? locationObj.address : undefined}
                />
              </div>
            </section>
          )}
        </article>

        <aside className="lg:col-span-5 xl:col-span-4 w-full">
          <div className="lg:sticky lg:top-28 z-20">
            <BookingWidget post={post} />
          </div>
        </aside>
      </div>

      <HostReviewsSection
        host={userObj}
        hostId={hostId}
        postId={postId}
        initialReviewsData={null}
      />

      {similarExperiences.length > 0 && (
        <section className="mt-16 pt-8 border-t border-neutral-100 dark:border-neutral-800">
          <h3 className="text-xl font-black uppercase tracking-tight mb-6">
            Similar <span className="text-[#C59A2F]">Experiences</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {similarExperiences.map((item: Record<string, unknown>) => (
              <ExperienceCard
                key={String(item._id || item.id)}
                data={item}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
