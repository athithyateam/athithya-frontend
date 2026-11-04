import React from "react";

interface ExperienceJsonLdProps {
  post: Record<string, unknown>;
  id: string;
}

export function ExperienceJsonLd({ post, id }: ExperienceJsonLdProps) {
  if (!post) return null;

  const priceObj = post.price as Record<string, unknown> | undefined;
  const unitPrice = Number(
    priceObj?.perPerson || priceObj?.amount || priceObj?.total || 0
  );

  const photosList = Array.isArray(post.photos) ? post.photos : [];
  const photos = photosList
    .map((p: unknown) => {
      if (typeof p === "string") return p;
      if (p && typeof p === "object" && "url" in p) {
        return (p as { url?: string }).url;
      }
      return null;
    })
    .filter((url): url is string => Boolean(url));

  const locationObj = post.location as Record<string, unknown> | undefined;
  const locationText = [
    locationObj?.city,
    locationObj?.state,
    locationObj?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const userObj = post.user as Record<string, unknown> | undefined;
  const hostName = userObj?.firstname
    ? `${userObj.firstname} ${userObj.lastname || ""}`.trim()
    : "Athithya Host";

  const coordObj = locationObj?.coordinates as Record<string, unknown> | undefined;
  const coordinates = Array.isArray(coordObj?.coordinates)
    ? (coordObj.coordinates as number[])
    : undefined;

  const canonicalUrl = `https://athithya.in/post/${id}`;

  const ratingObj = post.rating as Record<string, unknown> | undefined;
  const ratingCount = Number(ratingObj?.count || 0);
  const ratingAverage = Number(ratingObj?.average || 0);

  const categories = Array.isArray(post.categories) ? post.categories : [];

  const graph: Record<string, unknown>[] = [
    {
      "@type": "TouristTrip",
      "@id": `${canonicalUrl}#trip`,
      name: post.title,
      description: post.subtitle || post.description,
      image: photos,
      touristType: categories.length ? categories : ["Adventure", "Experience"],
      provider: {
        "@type": "Person",
        name: hostName,
      },
      offers: {
        "@type": "Offer",
        price: unitPrice,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: canonicalUrl,
      },
    },
    {
      "@type": "Product",
      "@id": `${canonicalUrl}#product`,
      name: post.title,
      description: post.subtitle || post.description,
      image: photos,
      category: categories[0] || "Travel Experience",
      offers: {
        "@type": "Offer",
        price: unitPrice,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: canonicalUrl,
      },
      ...(ratingCount > 0 && ratingAverage > 0
        ? {
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: ratingAverage,
              reviewCount: ratingCount,
              bestRating: 5,
              worstRating: 1,
            },
          }
        : {}),
    },
  ];

  if (locationText) {
    const place: Record<string, unknown> = {
      "@type": "Place",
      name: locationText,
      address: {
        "@type": "PostalAddress",
        addressLocality: locationObj?.city,
        addressRegion: locationObj?.state,
        addressCountry: locationObj?.country || "IN",
      },
    };

    if (Array.isArray(coordinates) && coordinates.length >= 2) {
      place.geo = {
        "@type": "GeoCoordinates",
        latitude: coordinates[1],
        longitude: coordinates[0],
      };
    }

    graph[0].location = place;
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
