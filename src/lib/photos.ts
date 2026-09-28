/**
 * Curated real photography, served straight from Unsplash's CDN — no stock
 * illustrations, no icon-style cartoon art. Each entry also carries a mood
 * gradient used by <Photo> as the loading state and as a graceful fallback
 * if a particular image ever 404s, so a bad load never shows a broken-image
 * icon on a page that's meant to look premium.
 */
export type PhotoKey = keyof typeof PHOTO_LIBRARY;

function unsplash(id: string, w: number, q = 80) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}`;
}

export const PHOTO_LIBRARY = {
  hero: {
    id: "photo-1488646953014-85cb44e25828",
    alt: "Lake Wanaka at sunrise, New Zealand",
    gradient: "from-[#0b2a2c] via-[#123f42] to-[#1b5c58]",
  },
  mountains: {
    id: "photo-1506905925346-21bda4d32df4",
    alt: "Mountain range above the clouds",
    gradient: "from-[#1c2d3a] via-[#2c4256] to-[#3f5a6e]",
  },
  paris: {
    id: "photo-1519501025264-65ba15a82390",
    alt: "The Eiffel Tower, Paris",
    gradient: "from-[#2b2440] via-[#3d3560] to-[#5a4e82]",
  },
  santorini: {
    id: "photo-1493558103817-58b2924bce98",
    alt: "Blue-domed churches, Santorini",
    gradient: "from-[#0d3a5c] via-[#1a5c8a] to-[#3a86c8]",
  },
  bali: {
    id: "photo-1502602898657-3e91760cbb34",
    alt: "Rice terraces, Bali",
    gradient: "from-[#1f3d1f] via-[#2f5c2c] to-[#4c7a3a]",
  },
  machuPicchu: {
    id: "photo-1509835550159-ba90b4f11c3a",
    alt: "Machu Picchu at dawn, Peru",
    gradient: "from-[#1a2f28] via-[#284238] to-[#3c5c48]",
  },
  tropicalBeach: {
    id: "photo-1523906834658-6e24ef2386f9",
    alt: "Palm-lined tropical beach",
    gradient: "from-[#04304a] via-[#0c5478] to-[#1f92b8]",
  },
  desert: {
    id: "photo-1500835556837-99ac94a94552",
    alt: "Sand dunes at golden hour",
    gradient: "from-[#4a2f14] via-[#6b451e] to-[#a06a2c]",
  },
  kyoto: {
    id: "photo-1526772662000-3f88f10405ff",
    alt: "Vermilion torii gates, Kyoto",
    gradient: "from-[#4a1420] via-[#6b1e2c] to-[#8a2c3a]",
  },
  newYork: {
    id: "photo-1496442226666-8d4d0e62e6e9",
    alt: "New York City skyline",
    gradient: "from-[#12202e] via-[#1c3348] to-[#2e4d68]",
  },
  airplaneWing: {
    id: "photo-1436491865332-7a61a109cc05",
    alt: "Airplane wing above the clouds at sunset",
    gradient: "from-[#3a1f38] via-[#5c2e4a] to-[#a8562c]",
  },
  roadTrip: {
    id: "photo-1473625247593-df82929de3cf",
    alt: "Open road through a mountain pass",
    gradient: "from-[#1c2a1c] via-[#324a2c] to-[#4a6a3a]",
  },
} satisfies Record<
  string,
  { id: string; alt: string; gradient: string }
>;

export function photoUrl(key: PhotoKey, width: number): string {
  return unsplash(PHOTO_LIBRARY[key].id, width);
}

export const DESTINATION_PHOTO_KEYS: PhotoKey[] = [
  "santorini",
  "bali",
  "machuPicchu",
  "kyoto",
  "tropicalBeach",
  "mountains",
  "paris",
  "newYork",
  "desert",
  "roadTrip",
];
