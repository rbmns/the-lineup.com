
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface EventImage {
  url: string;
  alt: string;
  thumbnailUrl?: string;
}

export const eventImageMap: Record<string, string> = {
  'music': '/images/event-types/music.jpg',
  'art': '/images/event-types/art.jpg',
  'food': '/images/event-types/food.jpg',
  'sports': '/images/event-types/sports.jpg',
  'theater': '/images/event-types/theater.jpg',
  'default': '/images/event-types/default.jpg'
};

export const useEventImages = (initialImages?: string[] | string) => {
  const [images, setImages] = useState<EventImage[]>([]);
  const [loading, setLoading] = useState(false);

  const processImageUrl = useCallback((url: string): EventImage => {
    if (url.startsWith('data:image')) {
      return { url, alt: 'Event image' };
    }
    
    // Public URL processing
    if (url.includes('storage.googleapis.com') || url.includes('cloudflare') || url.includes('cdn')) {
      return { url, alt: 'Event image' };
    }
    
    // Handle Supabase storage URLs
    if (url.includes('supabase')) {
      // For now just return the URL as is
      return { url, alt: 'Event image' };
    }
    
    // Default fallback
    return { url, alt: 'Event image' };
  }, []);

  const processInitialImages = useCallback(() => {
    if (!initialImages) return [];
    
    if (typeof initialImages === 'string') {
      return [processImageUrl(initialImages)];
    }
    
    return initialImages.map(url => processImageUrl(url));
  }, [initialImages, processImageUrl]);

  const uploadEventImage = useCallback(async (file: File): Promise<string> => {
    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `event-images/${fileName}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('public')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      const { data: urlData } = supabase.storage.from('public').getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading event image:', error);
      throw new Error('Failed to upload image');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    images,
    processInitialImages,
    uploadEventImage,
    loading
  };
};

export const getDefaultEventImage = (eventType?: string): string => {
  if (!eventType) return eventImageMap.default;
  const normalizedType = eventType.toLowerCase();
  return eventImageMap[normalizedType] || eventImageMap.default;
};
