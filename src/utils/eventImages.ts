
import { Event } from "@/types";

const EVENT_FALLBACK_IMAGES = {
  community: "https://raw.githubusercontent.com/rbmns/images/main/lineup/default.jpg", // Use default since community.jpg doesn't exist
  music: "https://raw.githubusercontent.com/rbmns/images/main/lineup/music.jpg",
  food: "https://raw.githubusercontent.com/rbmns/images/main/lineup/food.jpg",
  sports: "https://raw.githubusercontent.com/rbmns/images/main/lineup/sports.jpg",
  art: "https://raw.githubusercontent.com/rbmns/images/main/lineup/art.jpg",
  culture: "https://raw.githubusercontent.com/rbmns/images/main/lineup/mills.jpg",
  beach: "https://raw.githubusercontent.com/rbmns/images/main/lineup/beach.jpg",
  surf: "https://raw.githubusercontent.com/rbmns/images/main/lineup/surf.jpg",
  yoga: "https://raw.githubusercontent.com/rbmns/images/main/lineup/yoga.jpg",
  market: "https://raw.githubusercontent.com/rbmns/images/main/lineup/shopping.jpg",
  festival: "https://raw.githubusercontent.com/rbmns/images/main/lineup/festival.jpg",
  game: "https://raw.githubusercontent.com/rbmns/images/main/lineup/game.jpg",
  party: "https://raw.githubusercontent.com/rbmns/images/main/lineup/beachparty.jpg",
  kite: "https://raw.githubusercontent.com/rbmns/images/main/lineup/kite.jpg",
  wellness: "https://raw.githubusercontent.com/rbmns/images/main/lineup/yoga.jpg", // Map wellness to yoga image
  default: "https://raw.githubusercontent.com/rbmns/images/main/lineup/default.jpg",
};

// Export as DEFAULT_EVENT_IMAGES for compatibility
export const DEFAULT_EVENT_IMAGES = {
  yoga: "https://raw.githubusercontent.com/rbmns/images/main/lineup/yoga.jpg",
  surf: "https://raw.githubusercontent.com/rbmns/images/main/lineup/surf.jpg",
  beach: "https://raw.githubusercontent.com/rbmns/images/main/lineup/beach.jpg",
  music: "https://raw.githubusercontent.com/rbmns/images/main/lineup/music.jpg",
  food: "https://raw.githubusercontent.com/rbmns/images/main/lineup/food.jpg",
  workshop: "https://raw.githubusercontent.com/rbmns/images/main/lineup/default.jpg",
  other: "https://raw.githubusercontent.com/rbmns/images/main/lineup/default.jpg",
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
  if (normalizedCategory.includes('art') || normalizedCategory.includes('culture')) return EVENT_FALLBACK_IMAGES.culture;
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
  
  // Fall back to event_category-based image from local /img folder
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
