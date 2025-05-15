
import { Event } from '@/types';
import { getEventFallbackImage } from '@/utils/eventImages';
import { processImageUrls } from '@/utils/imageUtils';

// Default fallback image for any event
const DEFAULT_EVENT_IMAGE = "https://res.cloudinary.com/dita7stkt/image/upload/v1745876584/default_yl5ndt.jpg";

export const useEventImages = () => {
  /**
   * Get a fallback image for an event type and optional tags
   */
  const getDefaultEventImage = (eventType: Event['event_type'], tags?: string[]): string => {
    // Try to get an image based on event type and tags
    const typeFallback = getEventFallbackImage(eventType, tags);
    
    // If no specific type fallback is found, use the default fallback
    return typeFallback || DEFAULT_EVENT_IMAGE;
  };

  /**
   * Processes image URLs from events and returns a valid URL or fallback
   * Ensures consistent image representation across the app
   */
  const getEventImageUrl = (event: Event | null): string => {
    if (!event) return DEFAULT_EVENT_IMAGE;
    
    // If event has valid image URLs, use the first one
    if (event.image_urls && 
        Array.isArray(event.image_urls) && 
        event.image_urls.length > 0 && 
        typeof event.image_urls[0] === 'string') {
      
      const imageUrl = event.image_urls[0];
      if (imageUrl && imageUrl.trim() !== '') {
        return imageUrl;
      }
    }
    
    // Extract tags from the event if available
    let tags: string[] | undefined;
    if (event.tags) {
      // Handle tags whether they're already an array or a string that needs parsing
      if (Array.isArray(event.tags)) {
        tags = event.tags;
      } else if (typeof event.tags === 'string') {
        // Fix: Use type guard to check if event.tags is a string before calling split
        tags = event.tags.split(',').map(tag => tag.trim());
      }
    }
    
    // Use the fallback system to find an appropriate image
    return getDefaultEventImage(event.event_type, tags);
  };

  /**
   * Get the image URL for sharing an event
   */
  const getShareImageUrl = (event: Event | null, fallbackUrl?: string): string => {
    // For sharing, prioritize event image, but fallback to the default OG image
    const imageUrl = getEventImageUrl(event);
    return imageUrl || fallbackUrl || DEFAULT_EVENT_IMAGE;
  };

  return { 
    getDefaultEventImage,
    getEventImageUrl,
    getShareImageUrl
  };
};
