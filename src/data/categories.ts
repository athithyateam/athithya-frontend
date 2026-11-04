export interface CategoryItem {
  id: string;
  label: string;
  slug: string;
  tagline: string;
  count?: string; // Backwards-compatible alias for tagline
  description: string;
  image?: string;
  isCollage?: boolean;
  images?: string[];
  keywords: string[];
}

export const CATEGORIES_DATA: CategoryItem[] = [
  {
    id: "bungee",
    label: "Bungee Jumping",
    slug: "bungee-jumping",
    tagline: "Nervously Excited",
    count: "Nervously Excited",
    description: "Feel the adrenaline rush with India's highest cliff jump in Rishikesh",
    image: "/images/bungee/bungee-1.jpeg",
    keywords: ["bungee", "bungee jumping"],
  },
  {
    id: "paragliding",
    label: "Paragliding",
    slug: "paragliding",
    tagline: "Freedom in Skies",
    count: "Freedom in Skies",
    description: "Soar high over lush green valleys & snow-capped peaks",
    image: "/images/paragliding/paragliding-3.jpeg",
    keywords: ["paragliding"],
  },
  {
    id: "trek",
    label: "Trek",
    slug: "trek",
    tagline: "Find Yourself",
    count: "Find Yourself",
    description: "Conquer scenic Himalayan trails & high-altitude mountain passes",
    image: "/images/trek/trek-1.jpeg",
    keywords: ["trek", "trekking"],
  },
  {
    id: "camping",
    label: "Camping",
    slug: "camping",
    tagline: "Slow Down",
    count: "Slow Down",
    description: "Star-lit night camping amidst pristine valleys & pine woods",
    image: "/images/camping/camping-1.jpeg",
    keywords: ["camping", "camp"],
  },
  {
    id: "rafting",
    label: "Rafting",
    slug: "rafting",
    tagline: "Feel Alive",
    count: "Feel Alive",
    description: "Thrilling white water rafting on the holy Ganges & Alaknanda rivers",
    image: "/images/rafting/rafting-2.jpeg",
    keywords: ["rafting"],
  },
  {
    id: "safari",
    label: "Safari",
    slug: "safari",
    tagline: "Explore Wild",
    count: "Explore Wild",
    description: "Experience thrilling wildlife safaris in Jim Corbett & Rajaji National Parks",
    image: "/images/about-1.jpeg",
    keywords: ["safari", "wildlife", "jungle safari", "jeep safari"],
  },
  {
    id: "other",
    label: "Others",
    slug: "other",
    tagline: "Surprise Yourself",
    count: "Surprise Yourself",
    description: "Rock climbing, flyboarding, and unique mountain activities",
    isCollage: true,
    images: [
      "/images/rock-climbing/rock-climbing-1.jpeg",
      "/images/flyboarding/flyboarding-1.jpeg",
    ],
    keywords: [
      "rock climbing",
      "rock-climbing",
      "climbing",
      "bouldering",
      "flyboarding",
      "guide",
      "experience guide",
      "other",
      "others",
    ],
  },
];

