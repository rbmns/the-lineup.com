import { useState, useCallback, useMemo } from 'react';
import { Event, EventImage } from '@/types';
import { supabase } from '@/lib/supabase';

export type UseEventImagesReturn = {
  images: EventImage[];
  processInitialImages: () => EventImage[];
  uploadEventImage: (file: File) => Promise<string>;
  loading: boolean;
  getEventImageUrl: (event: Event) => string | null;
  getShareImageUrl: (event: Event) => string | null;
};

export const useEventImages = (): UseEventImagesReturn => {
  const [images, setImages] = useState<EventImage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const processInitialImages = useCallback(() => {
    // This is a placeholder for processing initial images
    return images;
  }, [images]);

  const uploadEventImage = useCallback(async (file: File): Promise<string> => {
    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `event-images/${fileName}`;

      const { data, error } = await supabase.storage.from('public').upload(filePath, file);

      if (error) {
        console.error('Error uploading image:', error);
        throw error;
      }

      const imageUrl = `${supabase.storageUrl}/public/${data.path}`;
      
      // Add to local state
      setImages(prev => [...prev, { url: imageUrl, file_name: fileName }]);
      
      return imageUrl;
    } catch (error) {
      console.error('Error in uploadEventImage:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to get the main event image URL
  const getEventImageUrl = useCallback((event: Event): string | null => {
    if (!event) return null;

    // First check for image_urls array
    if (event.image_urls && event.image_urls.length > 0) {
      return event.image_urls[0];
    }

    // Then check for a cover_image property 
    if (event.cover_image) {
      return event.cover_image;
    }

    // Fallback to a default image
    return null;
  }, []);
  
  // Function to get the image URL specifically for sharing
  const getShareImageUrl = useCallback((event: Event): string | null => {
    if (!event) return null;
    
    // For sharing, we might want to use a specific sharing image if available
    if (event.share_image) {
      return event.share_image;
    }
    
    // Otherwise fall back to the regular image
    return getEventImageUrl(event);
  }, [getEventImageUrl]);

  return {
    images,
    processInitialImages,
    uploadEventImage,
    loading,
    getEventImageUrl,
    getShareImageUrl
  };
};
