
import { useEffect } from 'react';
import { useCanonical } from '@/hooks/useCanonical';
import { pageSeoTags } from '@/utils/seoUtils';

export const useCategoryPageSeo = () => {
  // Apply meta tags
  useEffect(() => {
    document.title = pageSeoTags.events.title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', pageSeoTags.events.description);
  }, []);
  
  // Add canonical URL for SEO
  useCanonical('/events', pageSeoTags.events.title);
};
