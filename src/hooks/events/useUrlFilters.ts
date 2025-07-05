
import { useCallback, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { DateRange } from 'react-day-picker';
import { updateUrlParameters } from '@/utils/navigationUtils';

/**
 * Hook to synchronize filter state with standardized URL parameters
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
  selectedVibes?: string[],
  setSelectedVibes?: (vibes: string[]) => void,
  selectedLocation?: string | null,
  setSelectedLocation?: (location: string | null) => void,
) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  
  // Get destination and event type from route parameters
  const destinationParam = params.destination;
  const eventTypeParam = params.eventType;

  // Serialize filter state to URL parameters using standardized naming
  const updateUrlParams = useCallback(() => {
    // Extended filter state object with vibes and location
    const filterState = {
      eventTypes: selectedEventTypes,
      venues: selectedVenues,
      dateRange,
      dateFilter: selectedDateFilter,
      vibes: selectedVibes || [],
      location: selectedLocation
    };
    
    // Update URL parameters without navigation
    updateUrlParameters(filterState, navigate, location.pathname);
  }, [navigate, location.pathname, selectedEventTypes, selectedVenues, dateRange, selectedDateFilter, selectedVibes, selectedLocation]);

  // Parse URL parameters and update filter state
  const parseUrlParams = useCallback(() => {
    let filtersUpdated = false;
    const urlParams = new URLSearchParams(location.search);
    
    // Get event types with standardized name 'type'
    const typeParams = urlParams.getAll('type');
    if (typeParams.length > 0) {
      if (JSON.stringify(typeParams) !== JSON.stringify(selectedEventTypes)) {
        setSelectedEventTypes(typeParams);
        filtersUpdated = true;
        console.log(`Parsed event types from URL: ${typeParams.join(', ')}`);
      }
    } else if (selectedEventTypes.length > 0 && !location.state?.preserveFilters) {
      setSelectedEventTypes([]);
      filtersUpdated = true;
    }
    
    // Get venues with standardized name 'venue'
    const venueParams = urlParams.getAll('venue');
    if (venueParams.length > 0) {
      if (JSON.stringify(venueParams) !== JSON.stringify(selectedVenues)) {
        setSelectedVenues(venueParams);
        filtersUpdated = true;
        console.log(`Parsed venues from URL: ${venueParams.join(', ')}`);
      }
    } else if (selectedVenues.length > 0 && !location.state?.preserveFilters) {
      setSelectedVenues([]);
      filtersUpdated = true;
    }
    
    // Get date filter with standardized name 'dateFilter'
    const dateFilterParam = urlParams.get('dateFilter');
    if (dateFilterParam && dateFilterParam !== selectedDateFilter) {
      setSelectedDateFilter(dateFilterParam);
      filtersUpdated = true;
      console.log(`Parsed date filter from URL: ${dateFilterParam}`);
    } else if (!dateFilterParam && selectedDateFilter && !location.state?.preserveFilters) {
      setSelectedDateFilter('');
      filtersUpdated = true;
    }
    
    // Get date range with standardized names 'dateFrom' and 'dateTo'
    const dateFromParam = urlParams.get('dateFrom');
    const dateToParam = urlParams.get('dateTo');
    
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
    } else if (dateRange?.from && !location.state?.preserveFilters) {
      setDateRange(undefined);
      filtersUpdated = true;
    }
    
    // Get vibes with standardized name 'vibe'
    if (selectedVibes && setSelectedVibes) {
      const vibeParams = urlParams.getAll('vibe');
      if (vibeParams.length > 0) {
        if (JSON.stringify(vibeParams) !== JSON.stringify(selectedVibes)) {
          setSelectedVibes(vibeParams);
          filtersUpdated = true;
          console.log(`Parsed vibes from URL: ${vibeParams.join(', ')}`);
        }
      } else if (selectedVibes.length > 0 && !location.state?.preserveFilters) {
        setSelectedVibes([]);
        filtersUpdated = true;
      }
    }
    
    // Get location with standardized name 'location'  
    if (setSelectedLocation) {
      const locationParam = urlParams.get('location');
      
      if (locationParam && locationParam !== selectedLocation) {
        setSelectedLocation(locationParam);
        filtersUpdated = true;
      } 
      // FIXED: Only reset location if we're explicitly navigating without preserveFilters
      // Don't reset just because URL doesn't have the param yet (race condition)
    }
    
    return filtersUpdated;
  }, [
    location.search,
    location.state,
    selectedEventTypes,
    selectedVenues,
    selectedDateFilter,
    dateRange,
    selectedVibes,
    selectedLocation,
    setSelectedEventTypes,
    setSelectedVenues,
    setSelectedDateFilter,
    setDateRange,
    setSelectedVibes,
    setSelectedLocation
  ]);

  // Try to restore filters from URL on initial mount
  useEffect(() => {
    parseUrlParams();
  }, [parseUrlParams]);

  // Update URL when filter state changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateUrlParams();
    }, 50);
    
    return () => clearTimeout(timeoutId);
  }, [selectedEventTypes, selectedVenues, dateRange, selectedDateFilter, selectedVibes, selectedLocation, updateUrlParams]);

  return {
    updateUrlParams,
    parseUrlParams
  };
};
