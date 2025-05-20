
import { NavigateFunction } from 'react-router-dom';
import { Event } from '@/types';

/**
 * Navigates to an event detail page with standardized URL parameters
 * to track the source of navigation and maintain filter state
 */
export const navigateToEvent = (
  eventId: string, 
  navigate: NavigateFunction, 
  event?: Event, 
  fromRelated: boolean = false
) => {
  if (!eventId) {
    console.error('Cannot navigate to event: missing event ID');
    return;
  }
  
  try {
    // Build the URL with standardized parameters
    let url = `/events/${eventId}`;
    
    // Add source parameter to track where the user came from
    const params = new URLSearchParams();
    
    // Add source parameter
    if (fromRelated) {
      params.append('source', 'related');
    }
    
    // Add event type if available for potential filtering when returning to list
    if (event?.event_type) {
      params.append('type', event.event_type);
    }
    
    // Add current URL search params to maintain filter state
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.forEach((value, key) => {
      // Only add parameters we want to preserve (standardized naming)
      if (['type', 'venue', 'dateFrom', 'dateTo', 'dateFilter'].includes(key)) {
        params.append(key, value);
      }
    });
    
    // Append parameters to URL if we have any
    const paramString = params.toString();
    if (paramString) {
      url = `${url}?${paramString}`;
    }
    
    console.log(`Navigating to: ${url}`);
    
    navigate(url, {
      state: {
        fromEventList: true,
        eventData: event,
        timestamp: Date.now()
      }
    });
  } catch (error) {
    console.error('Navigation error:', error);
  }
};

/**
 * Updates URL search parameters without navigation
 * to reflect the current filter state
 */
export const updateUrlParameters = (
  filterState: {
    eventTypes?: string[];
    venues?: string[];
    dateRange?: any;
    dateFilter?: string;
  },
  navigate: NavigateFunction,
  pathname: string = window.location.pathname
) => {
  const params = new URLSearchParams();
  
  // Add event types with standardized name 'type'
  if (filterState.eventTypes && filterState.eventTypes.length > 0) {
    filterState.eventTypes.forEach(type => {
      params.append('type', type);
    });
  }
  
  // Add venues with standardized name 'venue'
  if (filterState.venues && filterState.venues.length > 0) {
    filterState.venues.forEach(venue => {
      params.append('venue', venue);
    });
  }
  
  // Add date range with standardized names 'dateFrom' and 'dateTo'
  if (filterState.dateRange?.from) {
    params.set('dateFrom', filterState.dateRange.from.toISOString());
    
    if (filterState.dateRange.to) {
      params.set('dateTo', filterState.dateRange.to.toISOString());
    }
  }
  
  // Add date filter with standardized name 'dateFilter'
  if (filterState.dateFilter) {
    params.set('dateFilter', filterState.dateFilter);
  }
  
  // Update URL without navigation
  const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
  window.history.replaceState({}, '', newUrl);
  
  return params.toString();
};
