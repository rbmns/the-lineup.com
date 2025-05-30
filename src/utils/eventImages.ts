
import { Event } from "@/types";

const EVENT_FALLBACK_IMAGES = {
  community: "/img/Community.jpg",
  music: "/img/music.jpg",
  food: "/img/food.jpg",
  sports: "/img/sports.jpg",
  art: "/img/art.jpg",
  culture: "/img/mills.jpg",
  beach: "/img/beach.jpg",
  surf: "/img/surf.jpg",
  yoga: "/img/yoga.jpg",
  market: "/img/shopping.jpg",
  festival: "/img/festival.jpg",
  game: "/img/game.jpg",
  party: "/img/beachparty.jpg",
  kite: "/img/kite.jpg",
  wellness: "/img/yoga.jpg", // Map wellness to yoga image
  default: "/img/default.jpg",
};

// Export as DEFAULT_EVENT_IMAGES for compatibility
export const DEFAULT_EVENT_IMAGES = {
  yoga: "/img/yoga.jpg",
  surf: "/img/surf.jpg",
  beach: "/img/beach.jpg",
  music: "/img/music.jpg",
  food: "/img/food.jpg",
  workshop: "/img/default.jpg",
  other: "/img/default.jpg",
};

export const eventTypeColors = {
  yoga: "#8B5CF6",
  surf: "#06B6D4", 
  beach: "#F59E0B",
  music: "#A855F7",
  food: "#EF4444",
  workshop: "#6B7280",
  other: "#6B7280",
};

export const getEventFallbackImage = (category?: string, tags?: string[]): string => {
  if (!category) return EVENT_FALLBACK_IMAGES.default;
  
  const normalizedCategory = category.toLowerCase().trim();
  
  // Direct category match first
  if (EVENT_FALLBACK_IMAGES[normalizedCategory as keyof typeof EVENT_FALLBACK_IMAGES]) {
    return EVENT_FALLBACK_IMAGES[normalizedCategory as keyof typeof EVENT_FALLBACK_IMAGES];
  }
  
  // Check for partial matches or related categories
  if (normalizedCategory.includes('yoga') || normalizedCategory.includes('wellness')) return EVENT_FALLBACK_IMAGES.yoga;
  if (normalizedCategory.includes('surf')) return EVENT_FALLBACK_IMAGES.surf;
  if (normalizedCategory.includes('beach')) return EVENT_FALLBACK_IMAGES.beach;
  if (normalizedCategory.includes('music') || normalizedCategory.includes('concert')) return EVENT_FALLBACK_IMAGES.music;
  if (normalizedCategory.includes('food') || normalizedCategory.includes('restaurant')) return EVENT_FALLBACK_IMAGES.food;
  if (normalizedCategory.includes('sport')) return EVENT_FALLBACK_IMAGES.sports;
  if (normalizedCategory.includes('art') || normalizedCategory.includes('culture')) return EVENT_FALLBACK_IMAGES.art;
  if (normalizedCategory.includes('festival')) return EVENT_FALLBACK_IMAGES.festival;
  if (normalizedCategory.includes('game')) return EVENT_FALLBACK_IMAGES.game;
  if (normalizedCategory.includes('party')) return EVENT_FALLBACK_IMAGES.party;
  if (normalizedCategory.includes('kite')) return EVENT_FALLBACK_IMAGES.kite;
  if (normalizedCategory.includes('community')) return EVENT_FALLBACK_IMAGES.community;
  if (normalizedCategory.includes('market')) return EVENT_FALLBACK_IMAGES.market;
  
  return EVENT_FALLBACK_IMAGES.default;
};

export const getEventImage = (event: Event): string => {
  // Check for image_urls array first
  if (event.image_urls && event.image_urls.length > 0) {
    return event.image_urls[0];
  }
  
  // Fall back to event_category-based image from /img folder
  return getEventFallbackImage(event.event_category);
};

export const getEventImages = (event: Event): string[] => {
  if (event.image_urls && event.image_urls.length > 0) {
    return event.image_urls;
  }
  
  return [getEventImage(event)];
};

export const hasMultipleImages = (event: Event): boolean => {
  return event.image_urls ? event.image_urls.length > 1 : false;
};
