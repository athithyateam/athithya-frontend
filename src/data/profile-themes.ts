export interface ProfileTheme {
  key: string;
  label: string;
  emoji: string;
  image: string | null;
  overlay: string | null;
  textColor: string | null;
  subColor: string | null;
  accentBorder: string | null;
  divider: string | null;
}

export const DEFAULT_THEME_KEY = "mountain";

export const PROFILE_THEMES: ProfileTheme[] = [
  {
    key: "trekking",
    label: "Trekking",
    emoji: "🥾",
    image: "/images/trek/trek-1.jpeg",
    overlay: "linear-gradient(175deg, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.60) 100%)",
    textColor: "#ffffff",
    subColor: "rgba(255,255,255,0.70)",
    accentBorder: "rgba(255,255,255,0.18)",
    divider: "rgba(255,255,255,0.10)",
  },
  {
    key: "rafting",
    label: "Rafting",
    emoji: "🚣",
    image: "/images/rafting/rafting-2.jpeg",
    overlay: "linear-gradient(175deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.58) 100%)",
    textColor: "#ffffff",
    subColor: "rgba(255,255,255,0.70)",
    accentBorder: "rgba(255,255,255,0.18)",
    divider: "rgba(255,255,255,0.10)",
  },
  {
    key: "camping",
    label: "Camping",
    emoji: "⛺",
    image: "/images/camping/camping-1.jpeg",
    overlay: "linear-gradient(175deg, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.62) 100%)",
    textColor: "#ffffff",
    subColor: "rgba(255,255,255,0.70)",
    accentBorder: "rgba(255,255,255,0.18)",
    divider: "rgba(255,255,255,0.10)",
  },
  {
    key: "bungee",
    label: "Bungee",
    emoji: "🪂",
    image: "/images/bungee/bungee-1.jpeg",
    overlay: "linear-gradient(175deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.58) 100%)",
    textColor: "#ffffff",
    subColor: "rgba(255,255,255,0.70)",
    accentBorder: "rgba(255,255,255,0.18)",
    divider: "rgba(255,255,255,0.10)",
  },
  {
    key: "paragliding",
    label: "Paragliding",
    emoji: "🪂",
    image: "/images/paragliding/paragliding-3.jpeg",
    overlay: "linear-gradient(175deg, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.56) 100%)",
    textColor: "#ffffff",
    subColor: "rgba(255,255,255,0.70)",
    accentBorder: "rgba(255,255,255,0.18)",
    divider: "rgba(255,255,255,0.10)",
  },
  {
    key: "safari",
    label: "Safari",
    emoji: "🚙",
    image:
      "https://athithya-app-bucket.s3.eu-north-1.amazonaws.com/posts/1000049861-353bfc2d-3a72-4054-8275-d3ab12b245d9.webp",
    overlay: "linear-gradient(175deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.58) 100%)",
    textColor: "#ffffff",
    subColor: "rgba(255,255,255,0.70)",
    accentBorder: "rgba(255,255,255,0.18)",
    divider: "rgba(255,255,255,0.10)",
  },
  {
    key: "mountain",
    label: "Mountain",
    emoji: "🏔️",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920&auto=format&fit=crop",
    overlay: "linear-gradient(175deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.62) 100%)",
    textColor: "#ffffff",
    subColor: "rgba(255,255,255,0.65)",
    accentBorder: "rgba(255,255,255,0.15)",
    divider: "rgba(255,255,255,0.08)",
  },
  {
    key: "forest",
    label: "Forest",
    emoji: "🌲",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1920&auto=format&fit=crop",
    overlay: "linear-gradient(175deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.60) 100%)",
    textColor: "#ffffff",
    subColor: "rgba(255,255,255,0.65)",
    accentBorder: "rgba(255,255,255,0.15)",
    divider: "rgba(255,255,255,0.08)",
  },
  {
    key: "beach",
    label: "Beach",
    emoji: "🏖️",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop",
    overlay: "linear-gradient(175deg, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.55) 100%)",
    textColor: "#ffffff",
    subColor: "rgba(255,255,255,0.65)",
    accentBorder: "rgba(255,255,255,0.15)",
    divider: "rgba(255,255,255,0.08)",
  },
  {
    key: "sunset",
    label: "Sunset",
    emoji: "🌅",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1920&auto=format&fit=crop",
    overlay: "linear-gradient(175deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.58) 100%)",
    textColor: "#ffffff",
    subColor: "rgba(255,255,255,0.65)",
    accentBorder: "rgba(255,255,255,0.15)",
    divider: "rgba(255,255,255,0.08)",
  },
  {
    key: "classic",
    label: "Classic",
    emoji: "✦",
    image: null,
    overlay: null,
    textColor: null,
    subColor: null,
    accentBorder: null,
    divider: null,
  },
];

