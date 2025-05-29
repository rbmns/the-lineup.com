
import { Event } from "@/types";

const EVENT_FALLBACK_IMAGES = {
  community: "/img/Community.jpg",
  music: "/img/music.jpg",
  food: "/img/food.jpg",
  sports: "/img/default.jpg",
  art: "/img/default.jpg",
  culture: "/img/default.jpg",
  beach: "/img/beach.jpg",
  surf: "/img/surf.jpg",
  yoga: "/img/yoga.jpg",
  market: "/img/shopping.jpg",
  festival: "/img/concert.jpg",
  game: "/img/default.jpg",
  party: "/img/beachparty.jpg",
  kite: "/img/kite.jpg",
  default: "/img/default.jpg",
};

export const getEventFallbackImage = (category?: string): string => {
  if (!category) return EVENT_FALLBACK_IMAGES.default;
  
  const normalizedCategory = category.toLowerCase();
  return EVENT_FALLBACK_IMAGES[normalizedCategory as keyof typeof EVENT_FALLBACK_IMAGES] || EVENT_FALLBACK_IMAGES.default;
};

export const getEventImage = (event: Event): string => {
  // Check for image_urls array first
  if (event.image_urls && event.image_urls.length > 0) {
    return event.image_urls[0];
  }
  
  // Check for share_image property
  if (event.share_image) {
    return event.share_image;
  }
  
  // Fall back to category-based image
  return getEventFallbackImage(event.event_type);
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
