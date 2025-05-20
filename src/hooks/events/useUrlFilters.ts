
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
) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  
  // Get destination and event type from route parameters
  const destinationParam = params.destination;
  const eventTypeParam = params.eventType;

  // Serialize filter state to URL parameters using standardized naming
  const updateUrlParams = useCallback(() => {
    // Standard filter state object with consistent naming
    const filterState = {
      eventTypes: selectedEventTypes,
      venues: selectedVenues,
      dateRange,
      dateFilter: selectedDateFilter
    };
    
    // Update URL parameters without navigation
    updateUrlParameters(filterState, navigate, location.pathname);
  }, [navigate, location.pathname, selectedEventTypes, selectedVenues, dateRange, selectedDateFilter]);

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
    
    return filtersUpdated;
  }, [
    location.search,
    location.state,
    selectedEventTypes,
    selectedVenues,
    selectedDateFilter,
    dateRange,
    setSelectedEventTypes,
    setSelectedVenues,
    setSelectedDateFilter,
    setDateRange
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
  }, [selectedEventTypes, selectedVenues, dateRange, selectedDateFilter, updateUrlParams]);

  return {
    updateUrlParams,
    parseUrlParams
  };
};
