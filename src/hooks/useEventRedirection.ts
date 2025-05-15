
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '@/types';
import { getEventUrl, setCanonicalLink } from '@/utils/canonicalUtils';

export const useEventRedirection = (
  event: Event | null,
  isSlugRoute: boolean,
  isDestinationRoute: boolean,
  location: { pathname: string } | undefined
) => {
  const navigate = useNavigate();
  const isMounted = useRef(true);
  
  // Set canonical URL and handle redirects
  useEffect(() => {
    // Safety check - if any required data is missing, do nothing
    if (!event || !location || !location.pathname) {
      console.log("Missing required data for event redirection, skipping");
      return;
    }
    
    if (isMounted.current) {
      try {
        // Set canonical URL
        const canonicalUrl = `${window.location.origin}${getEventUrl(event, true)}`;
        setCanonicalLink(canonicalUrl);
        
        const pathname = location.pathname;
        
        // Check if the current URL follows the date-first pattern (YYYY-MM-DD-title)
        const hasDateFirstSlug = event.slug && /^\d{4}-\d{2}-\d{2}/.test(event.slug);
        
        // Handle redirections based on URL format
        if (!isSlugRoute && !isDestinationRoute && event.destination && event.slug) {
          // Preferred format: /events/destination/date-title
          const newUrl = `/events/${encodeURIComponent(event.destination)}/${event.slug}`;
          if (pathname !== newUrl) {
            navigate(newUrl, { replace: true });
          }
        } 
        // If we're on the old-style URL and we have a date-first slug but no destination
        else if (!isSlugRoute && !isDestinationRoute && event.slug && !event.destination) {
          // Second best option: /events/date-title
          const newUrl = `/events/${event.slug}`;
          if (pathname !== newUrl) {
            navigate(newUrl, { replace: true });
          }
        }
        // If we're on the old-style URL with just an ID, redirect to slug-based URL when available
        else if (!isSlugRoute && !isDestinationRoute && event.id) {
          const seoUrl = getEventUrl(event, true);
          if (seoUrl !== `/events/${event.id}` && pathname !== seoUrl) {
            navigate(seoUrl, { replace: true });
          }
        }
        // If we're on a slug route but the slug doesn't have date first, try to redirect
        else if (isSlugRoute && event.slug && hasDateFirstSlug && !pathname.includes(event.slug)) {
          const newUrl = `/events/${event.slug}`;
          navigate(newUrl, { replace: true });
        }
      } catch (error) {
        console.error("Error in redirection handler:", error);
      }
    }
    
    // Cleanup function
    return () => {
      isMounted.current = false;
      
      // Remove canonical link when component unmounts
      try {
        const canonicalLink = document.querySelector('link[rel="canonical"]');
        if (canonicalLink) {
          document.head.removeChild(canonicalLink);
        }
      } catch (e) {
        console.error("Error cleaning up canonical link:", e);
      }
    };
  }, [event, location, isSlugRoute, isDestinationRoute, navigate]);
};
