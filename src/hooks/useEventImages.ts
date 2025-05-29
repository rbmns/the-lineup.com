
import { useState, useEffect } from 'react';
import { Event } from '@/types';
import { getEventFallbackImage } from '@/utils/eventImages';

export const useEventImages = () => {
  const [cachedImages, setCachedImages] = useState<Record<string, string>>({});

  const preloadImage = (src: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  };

  const getEventImageUrl = (event: Event): string => {
    // Check if we have a cached result
    if (cachedImages[event.id]) {
      return cachedImages[event.id];
    }

    // Priority order for images:
    // 1. First image from image_urls array
    // 2. cover_image
    // 3. share_image 
    // 4. Fallback based on event category/tags

    let imageUrl = '';

    if (event.image_urls && event.image_urls.length > 0) {
      imageUrl = event.image_urls[0];
    } else if (event.cover_image) {
      imageUrl = event.cover_image;
    } else if (event.share_image) {
      imageUrl = event.share_image;
    } else {
      // Use fallback image based on event category
      imageUrl = getEventFallbackImage(event.event_category, event.tags);
    }

    // Cache the result
    setCachedImages(prev => ({
      ...prev,
      [event.id]: imageUrl
    }));

    return imageUrl;
  };

  const preloadEventImages = async (events: Event[]): Promise<void> => {
    const imagePromises = events.map(event => {
      const imageUrl = getEventImageUrl(event);
      return preloadImage(imageUrl).catch(() => {
        // On error, try to use fallback
        const fallbackUrl = getEventFallbackImage(event.event_category, event.tags);
        return preloadImage(fallbackUrl);
      });
    });

    try {
      await Promise.all(imagePromises);
    } catch (error) {
      console.warn('Some event images failed to preload:', error);
    }
  };

  return {
    getEventImageUrl,
    preloadEventImages,
    cachedImages
  };
};
