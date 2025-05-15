
import { Event } from '@/types';
import { getEventFallbackImage } from '@/utils/eventImages';
import { processImageUrls } from '@/utils/imageUtils';
import { defaultSeoTags } from '@/utils/seoUtils';

// Default fallback image for any event
const DEFAULT_EVENT_IMAGE = "https://res.cloudinary.com/dita7stkt/image/upload/v1745876584/default_yl5ndt.jpg";

export const useEventImages = () => {
  /**
   * Get a fallback image for an event type and optional tags
   */
  const getDefaultEventImage = (eventType: Event['event_type'], tags?: string[]) => {
    // Try to get an image based on event type
    const typeFallback = getEventFallbackImage(eventType, tags);
    
    // If no specific type fallback is found, use the default fallback
    return typeFallback || DEFAULT_EVENT_IMAGE;
  };

  /**
   * Processes image URLs from events and returns a valid URL or fallback
   * Ensures consistent image representation across the app
   * @param event The event object containing possible image URLs
   * @returns A valid image URL or fallback image URL
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
    
    // Get tags from the event if available
    let tags: string[] | undefined;
    if (event.tags) {
      // Handle tags whether they're already an array or a string that needs parsing
      if (Array.isArray(event.tags)) {
        tags = event.tags;
      } else if (typeof event.tags === 'string') {
        // Explicitly check the type again to help TypeScript narrow the type
        const tagString: string = event.tags;
        tags = tagString.split(',').map(tag => tag.trim());
      }
      // If event.tags exists but is neither array nor string,
      // tags will remain undefined
    }
    
    // Use consistent fallback logic, with DEFAULT_EVENT_IMAGE as the ultimate fallback
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
