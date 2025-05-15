
import { useEffect } from 'react';
import { Event } from '@/types';
import { useEventImages } from '@/hooks/useEventImages';

export const useEventMetaTags = (event: Event | null) => {
  const { getShareImageUrl } = useEventImages();

  useEffect(() => {
    if (!event) return;

    // Set page title
    document.title = event.title 
      ? `${event.title} - Event Details` 
      : 'Event Details';

    // Get OG image
    const imageUrl = getShareImageUrl(event);

    // Set Open Graph meta tags
    const metaTags = {
      'og:title': event.title,
      'og:description': event.description || `Join us for ${event.title}`,
      'og:type': 'website',
      'og:url': window.location.href,
      'twitter:card': 'summary_large_image',
      'twitter:title': event.title,
      'twitter:description': event.description || `Join us for ${event.title}`,
    };

    if (imageUrl) {
      metaTags['og:image'] = imageUrl;
      metaTags['twitter:image'] = imageUrl;
    }

    // Update or create meta tags
    Object.entries(metaTags).forEach(([name, content]) => {
      let meta = document.querySelector(`meta[property="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    });

    // Clean up function to remove meta tags when component unmounts
    return () => {
      // We could remove the tags here, but typically it's better to leave them
      // in case the page is indexed while navigating away
    };
  }, [event, getShareImageUrl]);
};
