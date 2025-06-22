
import { useEffect } from 'react';
import { Event } from '@/types';
import { useEventImages } from '@/hooks/useEventImages';

export const useEventMetaTags = (event: Event | null | undefined) => {
  const { getEventImageUrl } = useEventImages();

  useEffect(() => {
    if (!event) return;

    // Get event image or fallback to default
    const eventImage = getEventImageUrl(event);
    const fallbackImage = 'https://vbxhcqlcbusqwsqesoxw.supabase.co/storage/v1/object/public/branding//OG%20Image.png';
    const imageUrl = eventImage || fallbackImage;

    // Create description from event description or fallback
    let description = '';
    if (event.description) {
      // Strip HTML and truncate
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = event.description;
      const plainText = tempDiv.textContent || tempDiv.innerText || '';
      description = plainText.length > 160 ? plainText.substring(0, 160) + '...' : plainText;
    } else {
      description = `Join ${event.title} and connect with locals and friends.`;
    }

    const title = `${event.title} | the lineup`;
    const eventUrl = `${window.location.origin}/events/${event.id}`;

    // Set page title
    document.title = title;

    // Helper function to update or create meta tags
    const updateMetaTag = (selector: string, content: string) => {
      let metaTag = document.querySelector(selector);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        if (selector.includes('property=')) {
          const property = selector.match(/property="([^"]+)"/)?.[1];
          if (property) metaTag.setAttribute('property', property);
        } else if (selector.includes('name=')) {
          const name = selector.match(/name="([^"]+)"/)?.[1];
          if (name) metaTag.setAttribute('name', name);
        }
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    };

    // Update meta tags
    updateMetaTag('meta[name="description"]', description);
    updateMetaTag('meta[property="og:title"]', title);
    updateMetaTag('meta[property="og:description"]', description);
    updateMetaTag('meta[property="og:image"]', imageUrl);
    updateMetaTag('meta[property="og:url"]', eventUrl);
    updateMetaTag('meta[property="og:type"]', 'article');
    updateMetaTag('meta[name="twitter:card"]', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', title);
    updateMetaTag('meta[name="twitter:description"]', description);
    updateMetaTag('meta[name="twitter:image"]', imageUrl);

    // Set canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', eventUrl);

  }, [event, getEventImageUrl]);
};
