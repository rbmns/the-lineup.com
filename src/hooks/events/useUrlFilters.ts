
import { useCallback, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { DateRange } from 'react-day-picker';

/**
 * Hook to synchronize filter state with URL parameters
 */
export const useUrlFilters = (
  selectedEventTypes: string[],
  setSelectedEventTypes: (types: string[]) => void,
  selectedVenues: string[],
  setSelectedVenues: (venues: string[]) => void,
  dateRange: DateRange | undefined,
  setDateRange: (range: DateRange | undefined) => void,
  selectedDateFilter: string,
  setSelectedDateFilter: (filter: string) => void,
) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  
  // Get destination and event type from route parameters
  const destinationParam = params.destination;
  const eventTypeParam = params.eventType;

  // Serialize filter state to URL parameters
  const updateUrlParams = useCallback(() => {
    // Check if we're using the new URL structure with destinations
    const isDestinationRoute = location.pathname.startsWith('/destinations/');
    const currentParams = new URLSearchParams(location.search);
    
    // If using destination-based route, we handle differently
    if (isDestinationRoute) {
      // Get the current destination from the URL
      const pathParts = location.pathname.split('/');
      const destinationIndex = pathParts.indexOf('destinations') + 1;
      const currentDestination = destinationIndex < pathParts.length ? pathParts[destinationIndex] : null;
      
      // Get the current event type from the URL
      const hasEventType = pathParts.includes('events') && 
                          pathParts.indexOf('events') + 1 < pathParts.length;
      const currentEventType = hasEventType ? pathParts[pathParts.indexOf('events') + 1] : null;
      
      // Handle event type changes
      if (selectedEventTypes.length === 1 && selectedEventTypes[0] !== currentEventType) {
        // If one event type is selected, update the path
        const newPath = `/destinations/${currentDestination}/events/${selectedEventTypes[0]}`;
        navigate(newPath + location.search);
        return;
      } else if (selectedEventTypes.length !== 1 && currentEventType) {
        // If no event type or multiple event types, remove from path
        const newPath = `/destinations/${currentDestination}/events`;
        navigate(newPath + location.search);
        return;
      }
      
      // For regular filters not in the path, use query params
      const params = new URLSearchParams();
      
      // Add venues to URL
      if (selectedVenues.length > 0) {
        params.set('venues', selectedVenues.join(','));
      } else {
        params.delete('venues');
      }
      
      // Add date filter to URL
      if (selectedDateFilter) {
        params.set('dateFilter', selectedDateFilter);
      } else {
        params.delete('dateFilter');
      }
      
      // Add date range to URL if available
      if (dateRange?.from) {
        params.set('dateFrom', dateRange.from.toISOString());
        if (dateRange.to) {
          params.set('dateTo', dateRange.to.toISOString());
        } else {
          params.delete('dateTo');
        }
      } else {
        params.delete('dateFrom');
        params.delete('dateTo');
      }
      
      // Only update search params if we need to
      const paramsString = params.toString();
      if (location.search !== (paramsString ? `?${paramsString}` : '')) {
        navigate(`${location.pathname}${paramsString ? `?${paramsString}` : ''}`, { replace: true });
      }
    } else {
      // Traditional filter approach for non-destination routes
      const params = new URLSearchParams(location.search);
      
      // Handle event types
      if (selectedEventTypes.length > 0) {
        params.set('types', selectedEventTypes.join(','));
      } else {
        params.delete('types');
      }
      
      // Handle venues
      if (selectedVenues.length > 0) {
        params.set('venues', selectedVenues.join(','));
      } else {
        params.delete('venues');
      }
      
      // Handle date filter
      if (selectedDateFilter) {
        params.set('dateFilter', selectedDateFilter);
      } else {
        params.delete('dateFilter');
      }
      
      // Handle date range
      if (dateRange?.from) {
        params.set('dateFrom', dateRange.from.toISOString());
        if (dateRange.to) {
          params.set('dateTo', dateRange.to.toISOString());
        } else {
          params.delete('dateTo');
        }
      } else {
        params.delete('dateFrom');
        params.delete('dateTo');
      }
      
      // Only update URL if we have filters
      const hasFilters = selectedEventTypes.length > 0 || 
                        selectedVenues.length > 0 || 
                        selectedDateFilter || 
                        dateRange?.from;
      
      // Build the new URL with query parameters if filters exist
      const newUrl = hasFilters 
        ? `${location.pathname}?${params.toString()}`
        : location.pathname;
      
      // Debug log before navigation
      console.log(`Updating URL params: ${hasFilters ? params.toString() : 'none'}`);
      
      // Save current URL to sessionStorage to help restore filters after page reloads
      try {
        const filtersString = params.toString();
        sessionStorage.setItem('lastEventFilters', filtersString);
        sessionStorage.setItem('lastEventFiltersTimestamp', Date.now().toString());
      } catch (e) {
        console.error("Failed to save filters to sessionStorage", e);
      }
      
      // Navigate only if URL would actually change
      const currentUrl = `${location.pathname}${location.search}`;
      if (currentUrl !== newUrl) {
        navigate(newUrl, { 
          replace: true,
          state: { 
            fromFilterUpdate: true,
            timestamp: Date.now()
          }
        });
        
        console.log(`URL updated: ${newUrl}`);
      }
    }
  }, [navigate, location.pathname, location.search, selectedEventTypes, selectedVenues, selectedDateFilter, dateRange]);

  // Parse URL parameters and update filter state
  const parseUrlParams = useCallback(() => {
    let filtersUpdated = false;
    
    // Check if we're using the new URL structure with destinations
    const isDestinationRoute = location.pathname.startsWith('/destinations/');
    
    if (isDestinationRoute) {
      // Extract destination and event type from path
      const pathParts = location.pathname.split('/');
      const destinationIndex = pathParts.indexOf('destinations') + 1;
      const hasEventType = pathParts.includes('events') && 
                          pathParts.indexOf('events') + 1 < pathParts.length;
      
      // If there's an event type in the URL and it's not in our selected types, add it
      if (hasEventType) {
        const urlEventType = pathParts[pathParts.indexOf('events') + 1];
        if (!selectedEventTypes.includes(urlEventType)) {
          setSelectedEventTypes([urlEventType]);
          filtersUpdated = true;
          console.log(`Set event type from URL path: ${urlEventType}`);
        }
      }
      
      // Now handle any query parameters
      const queryParams = new URLSearchParams(location.search);
      
      // Get venues from query params
      const venuesParam = queryParams.get('venues');
      if (venuesParam) {
        const venues = venuesParam.split(',');
        if (JSON.stringify(venues) !== JSON.stringify(selectedVenues)) {
          setSelectedVenues(venues);
          filtersUpdated = true;
          console.log(`Parsed venues from URL: ${venues.join(', ')}`);
        }
      } else if (selectedVenues.length > 0) {
        setSelectedVenues([]);
        filtersUpdated = true;
      }
      
      // Get date filter from query params
      const dateFilterParam = queryParams.get('dateFilter');
      if (dateFilterParam && dateFilterParam !== selectedDateFilter) {
        setSelectedDateFilter(dateFilterParam);
        filtersUpdated = true;
        console.log(`Parsed date filter from URL: ${dateFilterParam}`);
      } else if (!dateFilterParam && selectedDateFilter) {
        setSelectedDateFilter('');
        filtersUpdated = true;
      }
      
      // Get date range from query params
      const dateFromParam = queryParams.get('dateFrom');
      const dateToParam = queryParams.get('dateTo');
      
      if (dateFromParam) {
        const newDateRange: DateRange = {
          from: new Date(dateFromParam)
        };
        
        if (dateToParam) {
          newDateRange.to = new Date(dateToParam);
        }
        
        // Only update if different
        const currentFromIso = dateRange?.from?.toISOString();
        const currentToIso = dateRange?.to?.toISOString();
        
        if (
          currentFromIso !== dateFromParam || 
          currentToIso !== dateToParam
        ) {
          setDateRange(newDateRange);
          filtersUpdated = true;
          console.log(`Parsed date range from URL: ${dateFromParam} to ${dateToParam || 'unspecified'}`);
        }
      } else if (dateRange?.from) {
        setDateRange(undefined);
        filtersUpdated = true;
      }
    } else {
      // Handle traditional query params for non-destination routes
      const params = new URLSearchParams(location.search);
      
      // Get event types from URL
      const typesParam = params.get('types');
      if (typesParam) {
        const types = typesParam.split(',');
        if (JSON.stringify(types) !== JSON.stringify(selectedEventTypes)) {
          setSelectedEventTypes(types);
          filtersUpdated = true;
          console.log(`Parsed event types from URL: ${types.join(', ')}`);
        }
      } else if (selectedEventTypes.length > 0) {
        setSelectedEventTypes([]);
        filtersUpdated = true;
        console.log('Cleared event types from URL');
      }
      
      // Get venues from URL
      const venuesParam = params.get('venues');
      if (venuesParam) {
        const venues = venuesParam.split(',');
        if (JSON.stringify(venues) !== JSON.stringify(selectedVenues)) {
          setSelectedVenues(venues);
          filtersUpdated = true;
          console.log(`Parsed venues from URL: ${venues.join(', ')}`);
        }
      } else if (selectedVenues.length > 0) {
        setSelectedVenues([]);
        filtersUpdated = true;
        console.log('Cleared venues from URL');
      }
      
      // Get date filter from URL
      const dateFilterParam = params.get('dateFilter');
      if (dateFilterParam && dateFilterParam !== selectedDateFilter) {
        setSelectedDateFilter(dateFilterParam);
        filtersUpdated = true;
        console.log(`Parsed date filter from URL: ${dateFilterParam}`);
      } else if (!dateFilterParam && selectedDateFilter) {
        setSelectedDateFilter('');
        filtersUpdated = true;
        console.log('Cleared date filter from URL');
      }
      
      // Get date range from URL
      const dateFromParam = params.get('dateFrom');
      const dateToParam = params.get('dateTo');
      
      if (dateFromParam) {
        const newDateRange: DateRange = {
          from: new Date(dateFromParam)
        };
        
        if (dateToParam) {
          newDateRange.to = new Date(dateToParam);
        }
        
        // Only update if different
        const currentFromIso = dateRange?.from?.toISOString();
        const currentToIso = dateRange?.to?.toISOString();
        
        if (
          currentFromIso !== dateFromParam || 
          currentToIso !== dateToParam
        ) {
          setDateRange(newDateRange);
          filtersUpdated = true;
          console.log(`Parsed date range from URL: ${dateFromParam} to ${dateToParam || 'unspecified'}`);
        }
      } else if (dateRange?.from) {
        setDateRange(undefined);
        filtersUpdated = true;
        console.log('Cleared date range from URL');
      }
    }
    
    // Check route params for destination or event type
    if (destinationParam || eventTypeParam) {
      // If event type is in the path but not in selected types, add it
      if (eventTypeParam && !selectedEventTypes.includes(eventTypeParam)) {
        setSelectedEventTypes([eventTypeParam]);
        filtersUpdated = true;
        console.log(`Set event type from URL path: ${eventTypeParam}`);
      }
    }
    
    return filtersUpdated;
  }, [
    location.pathname, 
    location.search, 
    selectedEventTypes, 
    selectedVenues, 
    selectedDateFilter, 
    dateRange, 
    destinationParam, 
    eventTypeParam, 
    setSelectedEventTypes, 
    setSelectedVenues, 
    setSelectedDateFilter, 
    setDateRange
  ]);

  // Try to restore filters from sessionStorage on initial mount
  useEffect(() => {
    const tryRestoreFromStorage = () => {
      try {
        // Don't restore from storage if we're on a destination route
        if (location.pathname.startsWith('/destinations/')) {
          return false;
        }
        
        const storedFilters = sessionStorage.getItem('lastEventFilters');
        const timestamp = sessionStorage.getItem('lastEventFiltersTimestamp');
        
        // Only restore if we have stored filters, no URL params, and timestamp is recent (within last hour)
        if (storedFilters && !location.search) {
          const isRecent = timestamp && (Date.now() - parseInt(timestamp)) < 3600000;
          
          if (isRecent) {
            // If we have stored filters but no current URL params, restore them
            console.log(`Restoring filters from storage: ${storedFilters}`);
            navigate(`${location.pathname}?${storedFilters}`, { replace: true });
            return true;
          }
        }
      } catch (e) {
        console.error("Failed to restore filters from storage", e);
      }
      return false;
    };
    
    // Try to restore from sessionStorage first
    const restored = tryRestoreFromStorage();
    
    // If not restored from storage, parse from URL
    if (!restored) {
      parseUrlParams();
    }
  }, []); // Run once on mount

  // Update URL when filter state changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateUrlParams();
    }, 50);
    
    return () => clearTimeout(timeoutId);
  }, [selectedEventTypes, selectedVenues, dateRange, selectedDateFilter, updateUrlParams]);

  return {
    updateUrlParams,
    parseUrlParams
  };
};
