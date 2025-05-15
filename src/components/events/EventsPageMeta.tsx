
import { useEffect } from 'react';
import { useCanonical } from '@/hooks/useCanonical';
import { pageSeoTags } from '@/utils/seoUtils';

export const useEventPageMeta = () => {
  useCanonical('/events', pageSeoTags.events.title);
  
  // Set page metadata
  useEffect(() => {
    document.title = pageSeoTags.events.title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', pageSeoTags.events.description);
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    
    if (ogTitle) ogTitle.setAttribute('content', pageSeoTags.events.title);
    if (ogDesc) ogDesc.setAttribute('content', pageSeoTags.events.description);
  }, []);
};
