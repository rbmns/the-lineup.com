
import { useEffect } from 'react';
import { Event } from '@/types';

// Define the MetaTags interface if it doesn't exist
interface MetaTags {
  title: string;
  description: string;
  imageUrl: string;
  path: string;
}

export const useEventMetaTags = (event: Event | null | undefined) => {
  if (!event) {
    return null;
  }
  
  const setMetaTags = ({ title, description, imageUrl, path }: MetaTags) => {
    // Set page title
    document.title = title;
    
    // Set meta tags
    const metaTags = {
      'og:title': title,
      'og:description': description,
      'og:image': imageUrl,
      'og:url': `${window.location.origin}${path}`,
      'twitter:title': title,
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
  
  return { setMetaTags };
};
