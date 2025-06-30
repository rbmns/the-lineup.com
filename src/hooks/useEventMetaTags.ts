
import { useEffect } from 'react';
import { Event } from '@/types';

interface MetaTags {
  title: string;
  description: string;
  imageUrl: string;
  path: string;
}

export const useEventMetaTags = (event: Event | null | undefined) => {
  const setMetaTags = ({ title, description, imageUrl, path }: MetaTags) => {
    // Set page title using event title
    document.title = `${title} | the lineup`;
    
    // Set meta tags
    const metaTags = {
      'og:title': title, // Use event title as OG title
      'og:description': description,
      'og:image': imageUrl,
      'og:url': `${window.location.origin}${path}`,
      'twitter:title': title, // Use event title for Twitter too
      'twitter:description': description,
      'twitter:image': imageUrl,
      'description': description
    };
    
    // Update or create meta tags
    Object.entries(metaTags).forEach(([name, content]) => {
      if (!content) return;
      
      let meta = document.querySelector(`meta[property="${name}"]`) || 
                 document.querySelector(`meta[name="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        if (name.startsWith('og:') || name.startsWith('twitter:')) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    });
    
    // Set canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${window.location.origin}${path}`);
  };

  useEffect(() => {
    if (event) {
      const description = event.description ? 
        event.description.replace(/<[^>]*>/g, '').substring(0, 160) + '...' :
        `Join us for ${event.title}`;
      
      const imageUrl = event.image_urls?.[0] || 'https://raw.githubusercontent.com/rbmns/images/main/lineup/default.jpg';
      
      setMetaTags({
        title: event.title, // Use event title directly
        description,
        imageUrl,
        path: `/events/${event.id}`
      });
    }
  }, [event]);
  
  return { setMetaTags };
};
