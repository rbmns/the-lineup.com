import { Event } from '@/types';

interface UseEventImagesProps {
  // Add any props if needed
}

export const useEventImages = (props?: UseEventImagesProps) => {
  const getEventImageUrl = (event: Event): string | undefined => {
    if (!event) return undefined;
    
    // Use event image URLs if available
    if (event.image_urls && event.image_urls.length > 0) {
      return event.image_urls[0];
    }
    
    // If no direct image, construct from tags
    if (event.tags) {
      const eventTags = event.tags ? event.tags.split(',').map(tag => tag.trim().toLowerCase()) : [];
      
      // Prioritize specific tags
      if (eventTags.includes('music')) {
        return 'https://images.unsplash.com/photo-1494947925554-267bb4156296?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80';
      } else if (eventTags.includes('art')) {
        return 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2574&q=80';
      } else if (eventTags.includes('food')) {
        return 'https://images.unsplash.com/photo-1551782450-a2132b4ba212?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2669&q=80';
      }
    }
    
    // Default image if no other match
    return 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2576&q=80';
  };

  const getShareImageUrl = (event: Event): string | undefined => {
    if (!event) return undefined;
    
    // Use event image URLs if available
    if (event.image_urls && event.image_urls.length > 0) {
      return event.image_urls[0];
    }
    
    // If no direct image, construct from tags
    if (event.tags) {
      const eventTags = event.tags ? event.tags.split(',').map(tag => tag.trim().toLowerCase()) : [];
      
      // Prioritize specific tags
      if (eventTags.includes('music')) {
        return 'https://images.unsplash.com/photo-1494947925554-267bb4156296?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80';
      } else if (eventTags.includes('art')) {
        return 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2574&q=80';
      } else if (eventTags.includes('food')) {
        return 'https://images.unsplash.com/photo-1551782450-a2132b4ba212?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2669&q=80';
      }
    }
    
    // Default image if no other match
    return 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2576&q=80';
  };
  
  return { getEventImageUrl, getShareImageUrl };
};
