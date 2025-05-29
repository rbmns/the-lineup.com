
import { Event } from '@/types';

// Default event images mapping
const DEFAULT_EVENT_IMAGES = {
  festival: '/img/concert.jpg',
  wellness: '/img/yoga.jpg',
  kite: '/img/kite.jpg',
  beach: '/img/beach.jpg',
  game: '/img/default.jpg',
  other: '/img/default.jpg',
  sports: '/img/default.jpg',
  surf: '/img/surf.jpg',
  party: '/img/beachparty.jpg',
  yoga: '/img/yoga.jpg',
  community: '/img/Community.jpg',
  music: '/img/music.jpg',
  food: '/img/food.jpg',
  market: '/img/shopping.jpg',
  art: '/img/default.jpg'
};

// Event type colors for styling
export const eventTypeColors = {
  festival: '#FF6B6B',
  wellness: '#4ECDC4',
  kite: '#45B7D1',
  beach: '#F7DC6F',
  game: '#BB8FCE',
  other: '#95A5A6',
  sports: '#58D68D',
  surf: '#5DADE2',
  party: '#F1948A',
  yoga: '#85C1E9',
  community: '#F8C471',
  music: '#D2B4DE',
  food: '#FADBD8',
  market: '#ABEBC6',
  art: '#F9E79F'
};

/**
 * Get the appropriate image URL for an event
 */
export const getEventImageUrl = (event: Event): string => {
  // If event has a cover image, use it
  if (event.cover_image) {
    return event.cover_image;
  }
  
  // If event has a share image, use it
  if (event.share_image) {
    return event.share_image;
  }
  
  // Fall back to default image based on event type/category
  const eventType = event.event_category || event.event_type || 'other';
  return DEFAULT_EVENT_IMAGES[eventType as keyof typeof DEFAULT_EVENT_IMAGES] || DEFAULT_EVENT_IMAGES.other;
};

/**
 * Get the share image URL for an event
 */
export const getEventShareImageUrl = (event: Event): string => {
  // Prefer share image for sharing
  if (event.share_image) {
    return event.share_image;
  }
  
  // Fall back to cover image
  if (event.cover_image) {
    return event.cover_image;
  }
  
  // Fall back to default
  return getEventImageUrl(event);
};
