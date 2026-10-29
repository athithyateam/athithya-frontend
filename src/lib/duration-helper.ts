export interface DurationObject {
  minutes?: number | string;
  hours?: number | string;
  days?: number | string;
  nights?: number | string;
}

export const formatExperienceDuration = (
  duration?: unknown,
  pricePeriod?: string,
  postObj?: Record<string, any> | null
): string => {
  const post =
    postObj ||
    (duration &&
    typeof duration === "object" &&
    ("duration" in duration || "price" in duration || "itinerary" in duration)
      ? (duration as Record<string, any>)
      : null);

  const dur = post ? post.duration : duration;
  const period = String(pricePeriod || post?.price?.period || post?.period || "").toLowerCase();

  if (typeof dur === "string" && dur.trim()) {
    const str = dur.trim();
    if (!isNaN(Number(str)) && Number(str) > 0) {
      const num = Number(str);
      if (period.includes("min")) return `${num} ${num === 1 ? "Min" : "Mins"}`;
      if (period.includes("hour")) return `${num} ${num === 1 ? "Hour" : "Hours"}`;
      return `${num} ${num === 1 ? "Day" : "Days"}`;
    }
    return str;
  }

  if (typeof dur === "number" && dur > 0) {
    if (period.includes("min")) return `${dur} ${dur === 1 ? "Min" : "Mins"}`;
    if (period.includes("hour")) return `${dur} ${dur === 1 ? "Hour" : "Hours"}`;
    return `${dur} ${dur === 1 ? "Day" : "Days"}`;
  }

  if (dur && typeof dur === "object") {
    const dObj = dur as DurationObject;
    const minutes = Number(dObj.minutes);
    if (minutes > 0) return `${minutes} ${minutes === 1 ? "Min" : "Mins"}`;

    const hours = Number(dObj.hours);
    if (hours > 0) return `${hours} ${hours === 1 ? "Hour" : "Hours"}`;

    const days = Number(dObj.days);
    const nights = Number(dObj.nights);
    if (days > 0 && nights > 0) {
      return `${days} ${days === 1 ? "Day" : "Days"} / ${nights} ${nights === 1 ? "Night" : "Nights"}`;
    }
    if (days > 0) return `${days} ${days === 1 ? "Day" : "Days"}`;
    if (nights > 0) return `${nights} ${nights === 1 ? "Night" : "Nights"}`;
  }

  if (post) {
    if (typeof post.tripDuration === "string" && post.tripDuration.trim()) {
      return post.tripDuration.trim();
    }
    if (typeof post.durationDays === "number" && post.durationDays > 0) {
      return `${post.durationDays} ${post.durationDays === 1 ? "Day" : "Days"}`;
    }
    if (Array.isArray(post.itinerary) && post.itinerary.length > 0) {
      const count = post.itinerary.length;
      return `${count} ${count === 1 ? "Day" : "Days"}`;
    }
  }

  if (period.includes("min")) return "15 Mins";
  if (period.includes("hour")) return "1 Hour";
  if (period.includes("night")) return "1 Night";
  if (period.includes("day")) return "1 Day";
  if (period.includes("session")) return "1 Session";

  return "1 Day";
};

