
import { useState, useEffect } from 'react';
import { Event } from '@/types';
import { supabase } from '@/lib/supabase';
import { getEventFallbackImage } from '@/utils/eventImages';

export interface EventImage {
  id: string;
  url: string;
  alt?: string;
  type: 'cover' | 'gallery' | 'share';
}

interface EventImageResult {
  coverImage: string | null;
  shareImage: string | null;
  galleryImages: EventImage[];
  isLoading: boolean;
  error: Error | null;
  getEventImageUrl: (event: Event) => string;
}

export const useEventImages = (event?: Event | null): EventImageResult => {
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [shareImage, setShareImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<EventImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Function to get image URL for any event (useful when rendering lists)
  const getEventImageUrl = (eventData: Event): string => {
    console.log(`[EventImage] Getting image for: "${eventData.title}" (ID: ${eventData.id})`);
    
    // Check for image_urls array first
    if (eventData.image_urls) {
      let imageUrl: string | null = null;
      
      // Handle different formats of image_urls
      if (Array.isArray(eventData.image_urls)) {
        // If it's already an array, get the first valid URL
        for (const url of eventData.image_urls) {
          if (typeof url === 'string' && url.trim().length > 0) {
            imageUrl = url;
            break;
          }
        }
      } else if (typeof eventData.image_urls === 'string') {
        // If it's a string, try to parse it or use it directly
        const urlString: string = eventData.image_urls;
        const trimmedString = urlString.trim();
        if (trimmedString.startsWith('[') && trimmedString.endsWith(']')) {
          // Looks like a JSON array string
          try {
            const parsed = JSON.parse(trimmedString);
            if (Array.isArray(parsed)) {
              for (const url of parsed) {
                if (typeof url === 'string' && url.trim().length > 0) {
                  imageUrl = url;
                  break;
                }
              }
            }
          } catch (e) {
            console.warn(`[EventImage] Failed to parse image_urls JSON: ${trimmedString}`);
          }
        } else if (trimmedString.length > 0) {
          // Treat as a single URL
          imageUrl = trimmedString;
        }
      }
      
      // Return the uploaded image URL directly (treatments will be applied by LineupImage component)
      if (imageUrl && imageUrl.startsWith('http')) {
        console.log(`[EventImage] Found valid uploaded image: ${imageUrl}`);
        return imageUrl;
      } else if (imageUrl) {
        console.warn(`[EventImage] Invalid uploaded image URL: ${imageUrl}`);
      }
    }
    
    // Use fallback based on event category
    console.log(`[EventImage] No valid uploaded image. Using fallback for category: "${eventData.event_category}"`);
    const fallbackImage = getEventFallbackImage(eventData.event_category);
    console.log(`[EventImage] Fallback image is: ${fallbackImage}`);
    return fallbackImage;
  };

  useEffect(() => {
    const loadImages = async () => {
      if (!event) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Use the same logic as getEventImageUrl
        const imageUrl = getEventImageUrl(event);
        setCoverImage(imageUrl);
        setShareImage(imageUrl);

        setIsLoading(false);
      } catch (err) {
        console.error('Error loading event images:', err);
        setError(err instanceof Error ? err : new Error('Failed to load images'));
        setIsLoading(false);
      }
    };

    loadImages();
  }, [event]);

  return { 
    coverImage, 
    shareImage, 
    galleryImages, 
    isLoading, 
    error, 
    getEventImageUrl 
  };
};
