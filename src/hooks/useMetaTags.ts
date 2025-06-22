
import { useEffect } from 'react';

interface MetaTagsData {
  title: string;
  description: string;
  image: string;
  url?: string;
  type?: string;
}

export const useMetaTags = (data: MetaTagsData) => {
  useEffect(() => {
    // Set page title
    document.title = data.title;
    
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

    // Update basic meta tags
    updateMetaTag('meta[name="description"]', data.description);
    
    // Update Open Graph tags
    updateMetaTag('meta[property="og:title"]', data.title);
    updateMetaTag('meta[property="og:description"]', data.description);
    updateMetaTag('meta[property="og:image"]', data.image);
    updateMetaTag('meta[property="og:type"]', data.type || 'website');
    
    if (data.url) {
      updateMetaTag('meta[property="og:url"]', data.url);
    }
    
    // Update Twitter Card tags
    updateMetaTag('meta[name="twitter:card"]', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', data.title);
    updateMetaTag('meta[name="twitter:description"]', data.description);
    updateMetaTag('meta[name="twitter:image"]', data.image);

    // Set canonical URL if provided
    if (data.url) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', data.url);
    }
  }, [data.title, data.description, data.image, data.url, data.type]);
};
