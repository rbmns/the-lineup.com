
/**
 * Utility functions for handling canonical URLs and SEO improvements
 */

/**
 * Get the canonical URL for the current page
 * @param path - Optional specific path to use instead of current path
 * @returns The full canonical URL
 */
export const getCanonicalUrl = (path?: string): string => {
  const baseUrl = window.location.origin;
  const currentPath = path || window.location.pathname;
  return `${baseUrl}${currentPath}`;
};

/**
 * Create a slug from an event's unique_id or generate one from title and date
 * @param event - The event object
 * @returns URL-friendly slug in format YYYY-MM-DD-title
 */
export const createEventSlug = (event: { 
  id: string; 
  unique_id?: string; 
  title?: string; 
  start_time?: string | Date;
}): string => {
  // If we have a unique_id, use that
  if (event.unique_id) {
    return encodeURIComponent(event.unique_id);
  }
  
  // Otherwise generate from title and date
  let slug = '';
  
  // Add date if available - comes first in the new format
  if (event.start_time) {
    const date = new Date(event.start_time);
    slug = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  }
  
  // Add the title after the date with a separator
  if (event.title) {
    // Convert title to URL-friendly format
    const titleSlug = event.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-')     // Replace spaces with dashes
      .replace(/-+/g, '-');     // Replace multiple dashes with single dash
    
    slug = slug ? `${slug}-${titleSlug}` : titleSlug;
  }
  
  return slug || event.id; // Fallback to ID if no slug could be generated
};

/**
 * Gets the URL for an event, formatting it according to SEO best practices
 * @param event The event object or ID
 * @param useSeoFormat Whether to use the SEO-friendly format with slugs
 * @returns The formatted URL string
 */
export const getEventUrl = (event: any, useSeoFormat: boolean = true): string => {
  if (!event) return '/events';
  
  // Simple case: just an ID was passed
  if (typeof event === 'string') {
    return `/events/${event}`;
  }
  
  // If we're using SEO format, implement URL priority hierarchy
  if (useSeoFormat) {
    // First priority: destination + slug (city-based URLs)
    if (event.destination && event.slug) {
      return `/events/${encodeURIComponent(event.destination)}/${encodeURIComponent(event.slug)}`;
    }
    // Second priority: just slug in the new events/slug format
    else if (event.slug) {
      return `/events/${encodeURIComponent(event.slug)}`;
    }
  }
  
  // Use plain ID as fallback
  return `/events/${event.id}`;
};

/**
 * Gets the URL for filtered events by destination and optionally event type
 * @param destination The destination name
 * @param eventType Optional event type for filtering
 * @returns The formatted URL string
 */
export const getFilteredEventsUrl = (destination: string, eventType?: string): string => {
  if (!destination) return '/events';
  
  const destinationSlug = encodeURIComponent(destination.toLowerCase());
  const baseUrl = `/destinations/${destinationSlug}/events`;
  
  if (eventType) {
    const eventTypeSlug = encodeURIComponent(eventType.toLowerCase());
    return `${baseUrl}/${eventTypeSlug}`;
  }
  
  return baseUrl;
};

/**
 * Gets the URL for a venue page
 * @param venueSlug The slug of the venue
 * @returns The formatted URL string for the venue page
 */
export const getVenueUrl = (venueSlug: string): string => {
  if (!venueSlug) return '/venues';
  return `/venues/${encodeURIComponent(venueSlug)}`;
};

/**
 * Set the canonical link in the document head
 * @param url - The canonical URL to set
 */
export const setCanonicalLink = (url: string): void => {
  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    document.head.appendChild(canonicalLink);
  }
  
  canonicalLink.href = url;
};

/**
 * Helper function to create an event slug resolver for navigation
 * @param navigate - The React Router navigate function
 * @returns A function that will navigate to an event using the SEO-friendly URL
 */
export const createEventNavigator = (navigate: any) => {
  return (event: { 
    id: string; 
    unique_id?: string; 
    title?: string; 
    start_time?: string | Date; 
    destination?: string; 
    slug?: string 
  }) => {
    const url = getEventUrl(event, true);
    navigate(url);
  };
};

/**
 * Extract destination from a venue name or location string
 * @param venue - The venue name or location string
 * @returns A cleaned destination name suitable for URLs
 */
export const extractDestination = (venue?: string): string | null => {
  if (!venue) return null;
  
  // Try to extract city or location from venue name
  // This is a simple implementation - you may want to enhance this
  // with more sophisticated city name extraction logic
  const parts = venue.split(',');
  if (parts.length > 1) {
    // If there's a comma, assume the format is "Venue Name, City"
    return parts[1].trim().toLowerCase();
  }
  
  // If no comma, just return the venue name as is
  return venue.trim().toLowerCase();
};
