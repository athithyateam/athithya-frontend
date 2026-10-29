import { calculateTotalPrice } from "./pricing";
import { getOptimizedImage } from "./image-helper";
import { formatExperienceDuration } from "./duration-helper";

export const getItemCategories = (item: Record<string, any> | null | undefined): string[] => {
  if (!item) return [];
  const list: string[] = [];

  if (Array.isArray(item.categories)) {
    item.categories.forEach((c: any) => {
      if (typeof c === "string" && c.trim()) list.push(c.trim());
      else if (c && typeof c === "object") {
        const name = c.name || c.title || c.label;
        if (name) list.push(String(name).trim());
      }
    });
  }

  if (typeof item.category === "string" && item.category.trim()) {
    list.push(item.category.trim());
  } else if (item.category && typeof item.category === "object") {
    const name = item.category.name || item.category.title || item.category.label;
    if (name) list.push(String(name).trim());
  }

  if (typeof item.categoryName === "string" && item.categoryName.trim()) {
    list.push(item.categoryName.trim());
  }

  if (
    typeof item.type === "string" &&
    item.type.trim() &&
    !["post", "service", "experience", "itinerary", "plan"].includes(item.type.toLowerCase())
  ) {
    list.push(item.type.trim());
  }

  return Array.from(new Set(list));
};

export const getItemCategory = (item: Record<string, any> | null | undefined): string => {
  const cats = getItemCategories(item);
  return cats.length > 0 ? cats[0] : "";
};

export const getItemLocation = (item: Record<string, any> | null | undefined): string => {
  if (!item) return "";
  if (typeof item.location === "string") return item.location;
  if (item.location && typeof item.location === "object") {
    const loc =
      item.location.city ||
      item.location.district ||
      item.location.name ||
      item.location.state ||
      item.location.address ||
      "";
    if (loc) return String(loc);
  }
  if (item.hostDetails && typeof item.hostDetails === "object") {
    const hostLoc =
      item.hostDetails.city ||
      item.hostDetails.district ||
      item.hostDetails.state ||
      item.hostDetails.physicalAddress ||
      "";
    if (hostLoc) return String(hostLoc);
  }
  if (typeof item.district === "string" && item.district.trim()) return item.district.trim();
  if (typeof item.city === "string" && item.city.trim()) return item.city.trim();
  return "";
};

export const getItemPrice = (item: Record<string, any> | null | undefined): number => {
  if (!item) return 0;
  if (item.price !== undefined && item.price !== null) {
    if (typeof item.price === "number") return item.price;
    if (typeof item.price === "object") {
      return Number(item.price.amount || item.price.perPerson || item.price.total || 0);
    }
    if (typeof item.price === "string" && !isNaN(Number(item.price))) return Number(item.price);
  }
  if (item.pricePerPerson !== undefined) return Number(item.pricePerPerson);
  if (item.priceTotal !== undefined) return Number(item.priceTotal);
  if (item.cost !== undefined && item.cost !== null) return Number(item.cost);
  if (item.pricing?.amount !== undefined) return Number(item.pricing.amount);
  if (item.startingPrice !== undefined) return Number(item.startingPrice);
  if (item.rate !== undefined) return Number(item.rate);
  return 0;
};

export const getItemDurationDays = (item: Record<string, any> | null | undefined): number => {
  if (!item) return 0;
  if (typeof item.durationDays === "number") return item.durationDays;
  if (typeof item.duration === "number") return item.duration;
  if (item.duration && typeof item.duration === "object") {
    if (item.duration.days) return Number(item.duration.days);
    if (item.duration.hours) return Math.ceil(Number(item.duration.hours) / 24);
  }
  if (typeof item.duration === "string") {
    const match = item.duration.match(/\d+/);
    if (match) return parseInt(match[0], 10);
  }
  if (typeof item.tripDuration === "string") {
    const match = item.tripDuration.match(/\d+/);
    if (match) return parseInt(match[0], 10);
  }
  if (typeof item.days === "number") return item.days;
  if (Array.isArray(item.itinerary) && item.itinerary.length > 0) {
    return item.itinerary.length;
  }
  return 0;
};

export const getItemDifficulty = (item: Record<string, any> | null | undefined): string => {
  if (!item) return "";
  const d = item.difficulty || item.difficultyLevel || item.level || "";
  return typeof d === "string" ? d.toLowerCase() : "";
};

export const getItemRating = (item: Record<string, any> | null | undefined): number => {
  if (!item) return 0;
  if (typeof item.rating === "number" && !isNaN(item.rating)) return item.rating;
  if (item.rating && typeof item.rating === "object") {
    const r = Number(item.rating.average ?? item.rating.score ?? item.rating.rate ?? 0);
    if (!isNaN(r) && r > 0) return r;
  }
  if (typeof item.rating === "string" && !isNaN(Number(item.rating)) && item.rating.trim()) {
    return Number(item.rating);
  }
  if (item.averageRating !== undefined && !isNaN(Number(item.averageRating))) {
    return Number(item.averageRating);
  }
  if (item.hostRating !== undefined && !isNaN(Number(item.hostRating))) {
    return Number(item.hostRating);
  }
  if (item.reviewSummary?.rating !== undefined) return Number(item.reviewSummary.rating);
  if (item.reviewSummary?.average !== undefined) return Number(item.reviewSummary.average);
  return 0;
};

export const getItemImage = (item: Record<string, any> | null | undefined): string => {
  if (!item) return "";
  if (typeof item.image === "string" && item.image) return item.image;
  if (typeof item.photo === "string" && item.photo) return item.photo;
  if (Array.isArray(item.photos) && item.photos.length > 0) {
    const first = item.photos[0];
    return typeof first === "string" ? first : first?.url || first?.src || "";
  }
  if (Array.isArray(item.images) && item.images.length > 0) {
    const first = item.images[0];
    return typeof first === "string" ? first : first?.url || first?.src || "";
  }
  if (item.coverImage) return typeof item.coverImage === "string" ? item.coverImage : item.coverImage.url || "";
  return "";
};

export const getItemHostName = (item: Record<string, any> | null | undefined): string => {
  if (!item) return "Local Host";
  const u = item.user || item.host || item.author || item.creator;
  if (u && typeof u === "object") {
    const full = [u.firstname, u.lastname].filter(Boolean).join(" ").trim();
    if (full) return full;
    if (u.name) return String(u.name);
    if (u.username) return String(u.username);
  }
  if (typeof u === "string" && !/^[0-9a-fA-F]{24}$/.test(u.trim()) && !/^\d+$/.test(u.trim())) {
    return u;
  }
  return item.hostName || item.hostDetails?.name || "Local Host";
};

export const extractExperienceCardMeta = (data: Record<string, any> | null | undefined, compact = false, defaultType = "experience") => {
  const id = data?._id || data?.id || "";
  const postType = data?.postType || defaultType || "experience";
  const basePrice = Number(data?.price?.perPerson || data?.price?.amount || getItemPrice(data) || 0);
  const totalPrice = calculateTotalPrice(basePrice);
  const rawImg = getItemImage(data);
  const firstImage = rawImg
    ? getOptimizedImage(rawImg, { width: compact ? 400 : 500 })
    : "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800";

  const isNew = Boolean(data?.isNew);

  let displayDuration = "1 Day";
  if (data?.duration) displayDuration = formatExperienceDuration(data.duration, data?.price?.period);
  else if (data?.durationDays) displayDuration = `${data.durationDays} ${data.durationDays === 1 ? "Day" : "Days"}`;
  else if (data?.days) displayDuration = `${data.days} ${data.days === 1 ? "Day" : "Days"}`;
  else if (Array.isArray(data?.itinerary) && data.itinerary.length > 0) {
    displayDuration = `${data.itinerary.length} ${data.itinerary.length === 1 ? "Day" : "Days"}`;
  }

  const hostName = getItemHostName(data);
  const u = data?.user || data?.host || data?.author;
  const hostId =
    (typeof u === "object" && u ? u._id || u.id : typeof u === "string" && (/^[0-9a-fA-F]{24}$/.test(u.trim()) || /^\d+$/.test(u.trim())) ? u.trim() : null) ||
    data?.userId ||
    data?.hostId ||
    null;

  const rawAvatar =
    (typeof u === "object" && u ? u.profilePic || u.avatar?.url || u.avatar || u.photo : null) ||
    data?.hostAvatar ||
    data?.hostDetails?.avatar ||
    null;
  const hostAvatar = getOptimizedImage(rawAvatar, { width: 80 }, hostName);
  const displayLocation = getItemLocation(data) || "Uttarakhand";
  const pricePeriod = String(data?.price?.period || data?.period || data?.pricingUnit || "person").toLowerCase() === "night" ? "night" : "person";

  return { id, postType, basePrice, totalPrice, firstImage, isNew, displayDuration, hostName, hostId, hostAvatar, displayLocation, pricePeriod };
};
