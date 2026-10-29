export interface PlaceEntry {
  id: string;
  name: string;
  tagline: string;
  description: string;
  bannerImage: string;
  highlights: string[];
  importantInfo: string;
  photos: string[];
  plans: string[];
  mapEmbed: string;
}

export const placesData: PlaceEntry[] = [
  {
    id: "chopta",
    name: "Chopta",
    tagline: "The Mini Switzerland of India",
    description:
      "Chopta is a picturesque hamlet which is still unexplored by travelers. It is famous for its meadows and evergreen forest area which is part of Kedarnath wildlife sanctuary not to be confused with Chopta village. It is the base for trekking to Tungnath, the third temple of Panch Kedar, which lies 3.5 km away.",
    bannerImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200",
    highlights: ["Trek to Tungnath (World's Highest Shiva Temple)", "Chandrashila Summit View", "Bird Watching", "Camping in Meadows"],
    importantInfo: "Electricity is limited in Chopta. Carry power banks. ATMs are available only in Ukhimath (30km away).",
    photos: [
      "https://images.unsplash.com/photo-1588102303036-7917462c0ba2?w=1200",
      "https://images.unsplash.com/photo-1589136777351-fdc9c9c85f68?w=1200",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200",
    ],
    plans: [
      "Arrival at Sari Village / Chopta Base Camp.",
      "Acclimatization and short nature walk.",
      "Trek to Tungnath and Chandrashila Summit early morning.",
      "Return to camp for bonfire and dinner.",
      "Departure after breakfast.",
    ],
    mapEmbed: "https://www.google.com/maps/embed?pb=PLACEHOLDER_FOR_CHOPTA",
  },
  {
    id: "kedarnath",
    name: "Kedarnath",
    tagline: "The Land of Lord Shiva",
    description:
      "Kedarnath is one of the most sacred pilgrimages of Lord Shiva situated in Rudraprayag district of Garhwal region in Uttarakhand. Kedarnath is one of the Char Dhams in the Himalayas and is flanked by breathtaking snow-clad peaks.",
    bannerImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200",
    highlights: ["Kedarnath Temple Darshan", "Bhairavnath Temple", "Vasuki Tal Trek", "Scenic Helicopter Ride (Optional)"],
    importantInfo: "Biometric registration is mandatory. Carry warm woolen clothes even in summer. Medical fitness certificate may be required.",
    photos: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200",
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200",
      "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=1200",
    ],
    plans: [
      "Drive from Haridwar/Rishikesh to Guptkashi/Sonprayag.",
      "Trek from Gaurikund to Kedarnath Base Camp (16km).",
      "Darshan of Kedarnath Ji and overnight stay.",
      "Trek down to Gaurikund and drive to Guptkashi.",
      "Departure to Haridwar.",
    ],
    mapEmbed: "https://www.google.com/maps/embed?pb=PLACEHOLDER_FOR_KEDARNATH",
  },
  {
    id: "rishikesh",
    name: "Rishikesh",
    tagline: "Yoga Capital of the World",
    description:
      "Gateway to the Garhwal Himalayas, Rishikesh is a city in India’s northern state of Uttarakhand, beside the Ganges River. The river is considered holy, and the city is renowned as a center for studying yoga and meditation.",
    bannerImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200",
    highlights: ["River Rafting in Ganga", "Ganga Aarti at Triveni Ghat", "Bungee Jumping", "Beatles Ashram Visit"],
    importantInfo: "Alcohol and non-vegetarian food are strictly prohibited in Rishikesh town limits.",
    photos: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200",
      "https://images.unsplash.com/photo-1510784722466-f2aa9c52fe6f?w=1200",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200",
    ],
    plans: [
      "Arrival in Rishikesh, check-in to camp/hotel.",
      "River Rafting session (16km or 24km).",
      "Evening Ganga Aarti and local market exploration.",
      "Morning Yoga session and visit Neer Garh Waterfall.",
      "Departure.",
    ],
    mapEmbed: "https://www.google.com/maps/embed?pb=PLACEHOLDER_FOR_RISHIKESH",
  },
  {
    id: "auli",
    name: "Auli",
    tagline: "Skiing Destination of India",
    description:
      "Auli is a Himalayan ski resort and hill station in the north Indian state of Uttarakhand. It consists of coniferous and oak forests, plus the Nar Parbat and Nanda Devi mountains are visible.",
    bannerImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200",
    highlights: ["Skiing and Snowboarding", "Cable Car Ride (Asia's Longest)", "View of Nanda Devi Peak", "Gorson Bugyal Trek"],
    importantInfo: "Roads can be blocked during heavy snowfall. Carry heavy woolens in winter (Dec-Feb).",
    photos: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200",
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200",
      "https://images.unsplash.com/photo-1541410965313-d53b3c16ef90?w=1200",
    ],
    plans: [
      "Drive to Joshimath from Haridwar/Dehradun.",
      "Cable car ride from Joshimath to Auli.",
      "Skiing lessons or trek to Gorson Bugyal.",
      "Visit Auli artificial lake.",
      "Departure.",
    ],
    mapEmbed: "https://www.google.com/maps/embed?pb=PLACEHOLDER_FOR_AULI",
  },
  {
    id: "mussoorie",
    name: "Mussoorie",
    tagline: "The Queen of Hills",
    description:
      "Mussoorie is a hill station and a municipal board in the Dehradun district of the Indian state of Uttarakhand. It is located about 35 kilometres from the state capital of Dehradun.",
    bannerImage: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=1200",
    highlights: ["Kempty Falls", "Gun Hill Viewpoint", "Mall Road Stroll", "Landour Bakehouse Visit"],
    importantInfo: "Weekends can be very crowded. Booking hotels in advance is recommended.",
    photos: [
      "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=1200",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200",
    ],
    plans: ["Arrival in Mussoorie and Mall Road visit.", "Visit Kempty Falls and Company Garden.", "Trip to Landour and Lal Tibba.", "Departure."],
    mapEmbed: "https://www.google.com/maps/embed?pb=PLACEHOLDER_FOR_MUSSOORIE",
  },
  {
    id: "nainital",
    name: "Nainital",
    tagline: "The City of Lakes",
    description:
      "Nainital is a Himalayan resort town in the Kumaon region of India’s Uttarakhand state. It’s set around Nainital Lake, a popular boating site with Naina Devi Hindu Temple on its north shore.",
    bannerImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200",
    highlights: ["Naini Lake Boating", "Naina Devi Temple", "Snow View Point", "Tiffin Top Trek"],
    importantInfo: "Mall Road is a no-parking and no-entry zone for vehicles during peak hours (6 PM - 9 PM usually).",
    photos: [
      "https://images.unsplash.com/photo-1510784722466-f2aa9c52fe6f?w=1200",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200",
    ],
    plans: ["Arrival at Nainital and boating in Naini Lake.", "Visit Naina Devi Temple and Snow View Point.", "Day trip to Bhimtal and Sattal.", "Departure."],
    mapEmbed: "https://www.google.com/maps/embed?pb=PLACEHOLDER_FOR_NAINITAL",
  },
  {
    id: "purola",
    name: "Purola",
    tagline: "Gateway to the Har Ki Dun Trek",
    description:
      "Purola is a scenic town in the Uttarkashi district, serving as a gateway to the famous Har Ki Dun and Kedarkantha treks. The town is steeped in local folklore, where the villagers still follow age-old traditions of worshiping the 'Someshwar Devta'.",
    bannerImage: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1200",
    highlights: ["Kamal River Valley", "Ancient Temples", "Gateway to High Altitudes", "Traditional Wooden Houses"],
    importantInfo: "Last town with proper markets and ATMs before heading into the high-altitude remote treks of Uttarkashi.",
    photos: ["https://images.unsplash.com/photo-1533512163351-5120fc6ea562?w=1200", "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200"],
    plans: ["Arrival in Purola via Dehradun/Mussoorie.", "Exploring the Kamal River banks and local markets.", "Visit to ancient local temples.", "Drive to starting points of Har Ki Dun or Kedarkantha treks."],
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13734.618641944885!2d78.0838128359426!3d30.86546377317789",
  },
  {
    id: "sankri",
    name: "Sankri",
    tagline: "The Trekker's Basecamp",
    description:
      "Sankri is a small, vibrant village located deep inside the Govind Wildlife Sanctuary. It is the crucial basecamp for some of India's most loved treks. The village is famous for its distinct wooden houses adorned with intricate carvings.",
    bannerImage: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1200",
    highlights: ["Stunning Sunset Views", "Base of Govind Wildlife Sanctuary", "Starting point of Har Ki Dun", "Authentic Himalayan Stays"],
    importantInfo: "No mobile network usually available except for BSNL. Electricity can be erratic; carry power banks.",
    photos: ["https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200", "https://images.unsplash.com/photo-1541410965313-d53b3c16ef90?w=1200"],
    plans: ["Drive from Dehradun to Sankri (approx 8-10 hours).", "Evening stroll through the village to see traditional Garhwali houses.", "Preparation and briefing for upcoming treks.", "Acclimatization day or start of the mountain ascent."],
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13712.986341944885",
  },
  {
    id: "mana",
    name: "Mana",
    tagline: "The Last Indian Village",
    description:
      "Mana is the last village before the Tibet border. It holds immense mythological significance as the place where Ved Vyas is believed to have composed the epic Mahabharata. Visitors can still see the 'Vyas Gufa' and the 'Bheem Pul'.",
    bannerImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1374&auto=format&fit=crop",
    highlights: ["Vyas Gufa (Vyas Cave)", "Bheem Pul (Stone Bridge)", "Saraswati River Source", "Mana Pass Border Area"],
    importantInfo: "High altitude village (3200m). Accessible only from May to October. Roads close in winter due to snow.",
    photos: ["https://images.unsplash.com/photo-1589136777351-fdc9c9c85f68?w=1200", "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200"],
    plans: ["Short walk from Badrinath Temple to Mana Village.", "Visit the Ganesha Gufa and Vyas Gufa where scriptures were written.", "Witness the confluence of Saraswati and Alaknanda.", "Tea at the 'India's Last Tea Stall' and local shawl shopping."],
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3434.618641944885",
  },
  {
    id: "lansdowne",
    name: "Lansdowne",
    tagline: "The Silent Hill Station",
    description:
      "Lansdowne is a pristine hill station established by the British as a cantonment for the Garhwal Rifles. While it offers colonial charm, it's the legend of 'Tarkeshwar Mahadev' that draws many.",
    bannerImage: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=1200",
    highlights: ["Tip-in-Top Viewpoint", "Bhulla Tal Lake", "Garhwal Rifles Museum", "St. John's Church"],
    importantInfo: "It's a disciplined army area. No loud music allowed. Booking in advance is necessary as it's small.",
    photos: ["https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=1200", "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200"],
    plans: ["Arrival and afternoon at Bhulla Tal.", "Sunrise at Tip-in-Top viewpoint.", "Visit Garhwal Rifles Regimental Museum.", "Forest walk to Tarkeshwar Mahadev Temple (nearby)."],
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13834.618641944885",
  },
  {
    id: "munsiyari",
    name: "Munsiyari",
    tagline: "Little Kashmir of Kumaon",
    description:
      "Munsiyari is the base for glacier explorers and bird watchers. The most famous sight here is the Panchachuli peaks, representing the 'Five Cooking Hearths' where the Pandavas cooked their last meal before ascending to heaven.",
    bannerImage: "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=1200",
    highlights: ["Panchachuli Peak View", "Birthi Falls", "Nanda Devi Temple", "Base of Himalayan Glaciers"],
    importantInfo: "Long travel distance (approx 10-12 hours from Haldwani). Plan for at least 3-4 days stay.",
    photos: ["https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?w=1200", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200"],
    plans: ["Arrival in Munsiyari and evening visit to Nanda Devi Temple.", "Trip to Birthi Falls and Darkot Village.", "Trek to Khaliya Top for 360-degree Himalayan view.", "Explore local markets for Bal Mithai and woolens."],
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13712.986341944885",
  },
  {
    id: "binsar",
    name: "Binsar",
    tagline: "Wilderness of the Sanctuary",
    description:
      "Binsar was once the summer capital of the Chand Kings of Kumaon. Today, it is a protected wildlife sanctuary offering a staggering 300km panoramic view of the Himalayas.",
    bannerImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200",
    highlights: ["Zero Point Peaks View", "Binsar Wildlife Sanctuary", "Kasar Devi Temple (nearby)"],
    importantInfo: "There's an entry fee for the sanctuary. Limited road access inside the forest; prepare for gentle trekking.",
    photos: ["https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200", "https://images.unsplash.com/photo-1510784722466-f2aa9c52fe6f?w=1200"],
    plans: ["Entry to Binsar Wildlife Sanctuary and drive to forest guest house.", "Morning trek to 'Zero Point' for peak views.", "Bird watching walk in the deodar forests.", "Visit ancient Bineshwar Mahadev Temple."],
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13834.618641944885",
  },
  {
    id: "dayara-bugyal",
    name: "Dayara Bugyal",
    tagline: "Nature's Infinity Carpet",
    description:
      "Dayara Bugyal is one of India's most breathtaking alpine meadows. It is famous for the Butter Festival (Anduri Utsav) celebrating the seasonal return of cattle from the high meadows.",
    bannerImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200",
    highlights: ["Vast Alpine Meadows", "Barnala Tal Lake", "Panoramic Bandarpoonch Peaks", "High-Altitude Camping"],
    importantInfo: "Trek starts from Barsu or Raithal village. Permit required for camping. Carry warm clothes even in summer.",
    photos: ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200", "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200"],
    plans: ["Drive to Barsu/Raithal from Uttarkashi/Dehradun.", "Ascent to Barnala Bugyal and overnight camp.", "Summit day to Dayara Bugyal meadows (3400m).", "Optional trek to Bakaria Top for higher views."],
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13834.618641944885",
  },
];
