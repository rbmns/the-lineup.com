
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
  getEventImageUrl: (event: Event) => string | null;
}

export const useEventImages = (event?: Event | null): EventImageResult => {
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [shareImage, setShareImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<EventImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Function to get image URL for any event (useful when rendering lists)
  const getEventImageUrl = (eventData: Event): string | null => {
    // Check for image_urls array first
    if (eventData.image_urls && eventData.image_urls.length > 0) {
      return eventData.image_urls[0];
    }
    
    // Use fallback based on event type
    return getEventFallbackImage(eventData.event_type);
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

        // Process cover image
        if (event.image_urls && event.image_urls.length > 0) {
          setCoverImage(event.image_urls[0]);
        } else {
          // Use fallback image based on event type
          const fallbackImage = getEventFallbackImage(event.event_type);
          setCoverImage(fallbackImage);
        }

        // Use the same image for share image or fallback
        setShareImage(coverImage || getEventFallbackImage(event.event_type));

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
