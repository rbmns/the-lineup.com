
import { Event } from "@/types";

const EVENT_FALLBACK_IMAGES = {
  community: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop", 
  music: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
  food: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
  sports: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
  art: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
  culture: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
  beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
  surf: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=300&fit=crop",
  yoga: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
  market: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop",
  festival: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=300&fit=crop",
  game: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop",
  party: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop",
  kite: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  wellness: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
  default: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
};

// Export as DEFAULT_EVENT_IMAGES for compatibility
export const DEFAULT_EVENT_IMAGES = {
  yoga: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
  surf: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=300&fit=crop",
  beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
  music: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
  food: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
  workshop: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
  other: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
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
  
  // Fall back to event_category-based image from Unsplash
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
