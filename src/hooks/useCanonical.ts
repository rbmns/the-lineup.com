
import { useEffect } from 'react';

/**
 * Hook to set canonical URL for better SEO
 * @param path The canonical path (without domain) - required parameter
 * @param title Optional page title to set
 */
export const useCanonical = (path: string, title?: string) => {
  useEffect(() => {
    // Set the page title if provided
    if (title) {
      document.title = title;
    }
    
    // Get existing canonical link or create a new one
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    
    // Construct the full URL
    const baseUrl = window.location.origin;
    canonicalLink.href = `${baseUrl}${path}`;
    
    // Clean up on component unmount
    return () => {
      // Only remove if we created it
      if (!document.querySelector('link[rel="canonical"]')?.hasAttribute('data-permanent')) {
        canonicalLink.remove();
      }
    };
  }, [path, title]);
};
