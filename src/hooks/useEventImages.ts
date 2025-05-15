
import { useState, useEffect } from 'react';
import { Event, EventImage } from '@/types';
import { supabase } from '@/lib/supabase';

interface EventImageResult {
  coverImage: string | null;
  shareImage: string | null;
  galleryImages: EventImage[];
  isLoading: boolean;
  error: Error | null;
}

export const useEventImages = (event: Event | null): EventImageResult => {
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [shareImage, setShareImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<EventImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

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
        if (event.cover_image) {
          // Check if cover_image is a full URL or just a path
          if (event.cover_image.startsWith('http')) {
            setCoverImage(event.cover_image);
          } else {
            // Construct URL using Supabase storage
            const storageUrl = supabase.supabaseUrl; // Fix for accessing protected storageUrl property
            setCoverImage(`${storageUrl}/storage/v1/object/public/${event.cover_image}`);
          }
        } else {
          // Default fallback image
          setCoverImage('/placeholder.svg');
        }

        // Process share image
        if (event.share_image) {
          // Check if share_image is a full URL or just a path
          if (event.share_image.startsWith('http')) {
            setShareImage(event.share_image);
          } else {
            // Construct URL using Supabase storage
            const storageUrl = supabase.supabaseUrl; // Fix for accessing protected storageUrl property
            setShareImage(`${storageUrl}/storage/v1/object/public/${event.share_image}`);
          }
        } else {
          // Use cover image as fallback for share image
          setShareImage(coverImage);
        }

        // TODO: Load gallery images if needed

        setIsLoading(false);
      } catch (err) {
        console.error('Error loading event images:', err);
        setError(err instanceof Error ? err : new Error('Failed to load images'));
        setIsLoading(false);
      }
    };

    loadImages();
  }, [event]);

  return { coverImage, shareImage, galleryImages, isLoading, error };
};
