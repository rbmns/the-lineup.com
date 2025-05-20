import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/hooks/useEvents';
import { useRsvpStateManager } from '@/hooks/events/useRsvpStateManager';
import { useCategoryFilterSelection } from '@/hooks/events/useCategoryFilterSelection';
import { useEventFilterState } from '@/hooks/events/useEventFilterState';
import { useFilteredEvents } from '@/hooks/events/useFilteredEvents';
import { useSimilarEventsHandler } from '@/hooks/events/useSimilarEventsHandler';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

// Props type for children as render prop function
interface EventsDataProviderProps {
  children: (props: EventsDataContextProps) => React.ReactNode;
}

// Context props that will be passed to children
interface EventsDataContextProps {
  filteredEvents: any[];
  similarEvents: any[];
  eventsLoading: boolean;
  isVenuesLoading: boolean;
  isFilterLoading: boolean;
  allEventTypes: string[];
  selectedCategories: string[];
  toggleCategory: (type: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  isNoneSelected: boolean;
  hasActiveFilters: boolean;
  showAdvancedFilters: boolean;
  toggleAdvancedFilters: () => void;
  dateRange: any;
  setDateRange: (range: any) => void;
  selectedDateFilter: string;
  setSelectedDateFilter: (filter: string) => void;
  venues: Array<{ value: string, label: string }>;
  selectedVenues: string[];
  setSelectedVenues: (venues: string[]) => void;
  locations: Array<{ value: string, label: string }>;
  hasAdvancedFilters: boolean;
  handleRemoveVenue: (venue: string) => void;
  handleClearDateFilter: () => void;
  resetFilters: () => void;
  handleRsvp: (eventId: string, status: 'Going' | 'Interested') => Promise<boolean | void>;
  showRsvpButtons: boolean;
  loadingEventId: string | null;
}

export const EventsDataProvider: React.FC<EventsDataProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: events = [], isLoading: eventsLoading } = useEvents(user?.id);
  const [venues, setVenues] = useState<Array<{ value: string, label: string }>>([]);
  const [locations, setLocations] = useState<Array<{ value: string, label: string }>>([]);
  const [isVenuesLoading, setIsVenuesLoading] = useState(true);
  
  // Use our new RSVP state manager
  const { handleRsvp: stateManagerHandleRsvp, loadingEventId, isProcessing } = useRsvpStateManager(user?.id);
  
  // Get all unique event types from events
  const allEventTypes = React.useMemo(() => {
    const types = events.map(event => event.event_type).filter(Boolean);
    return [...new Set(types)];
  }, [events]);
  
  // Event filter state management
  const {
    selectedEventTypes,
    setSelectedEventTypes,
    selectedVenues,
    setSelectedVenues,
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    isFilterLoading,
    showAdvancedFilters,
    toggleAdvancedFilters,
    hasActiveFilters,
    hasAdvancedFilters,
    resetFilters,
    handleRemoveEventType,
    handleRemoveVenue,
    handleClearDateFilter,
  } = useEventFilterState();
  
  // Filter events by selected event types
  const {
    selectedCategories,
    toggleCategory,
    selectAll,
    deselectAll,
    isNoneSelected
  } = useCategoryFilterSelection(allEventTypes);
  
  // Keep the category filter and event type filter in sync
  useEffect(() => {
    if (selectedCategories.length === 0 && allEventTypes.length > 0) {
      // If no categories are selected but we have event types, select all by default
      selectAll();
    } else {
      // Otherwise, sync the selected event types with the categories
      setSelectedEventTypes(selectedCategories);
    }
  }, [selectedCategories, allEventTypes, selectAll, setSelectedEventTypes]);
  
  // Fetch all venues for the filter
  useEffect(() => {
    const fetchVenues = async () => {
      setIsVenuesLoading(true);
      try {
        const { data, error } = await supabase
          .from('venues')
          .select('id, name')
          .order('name');
          
        if (error) throw error;
        
        if (data) {
          const venueOptions = data.map(venue => ({
            value: venue.id,
            label: venue.name
          }));
          setVenues(venueOptions);
        }
        
        // Create sample locations
        setLocations([
          { value: 'zandvoort-area', label: 'Zandvoort Area' }
        ]);
      } catch (err) {
        console.error('Error fetching venues:', err);
      } finally {
        setIsVenuesLoading(false);
      }
    };

    fetchVenues();
  }, []);
  
  // Listen for filter restoration events
  useEffect(() => {
    const handleFilterRestoration = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('Filter restoration event detected in EventsDataProvider:', customEvent.detail);
      
      // Update filter state if event types are provided
      if (customEvent.detail?.eventTypes && Array.isArray(customEvent.detail.eventTypes)) {
        setSelectedEventTypes(customEvent.detail.eventTypes);
      }
    };
    
    document.addEventListener('filtersRestored', handleFilterRestoration);
    
    return () => {
      document.removeEventListener('filtersRestored', handleFilterRestoration);
    };
  }, [setSelectedEventTypes]);
  
  // Use the filtered events hook
  const filteredEvents = useFilteredEvents({
    events,
    selectedCategories,
    allEventTypes,
    selectedVenues,
    dateRange,
    selectedDateFilter
  });
  
  // Use similar events handler
  const { similarEvents } = useSimilarEventsHandler({
    mainEvents: filteredEvents,
    hasActiveFilters,
    selectedEventTypes: selectedCategories,
    dateRange,
    selectedDateFilter,
    userId: user?.id
  });

  // Handle RSVP with navigation to login if needed
  const handleRsvpWithAuth = useCallback(async (eventId: string, status: 'Going' | 'Interested') => {
    if (!user) {
      navigate('/login');
      return false;
    }
    
    return stateManagerHandleRsvp(eventId, status);
  }, [user, navigate, stateManagerHandleRsvp]);
  
  // Context props that will be passed to children
  const contextProps: EventsDataContextProps = {
    filteredEvents,
    similarEvents,
    eventsLoading,
    isVenuesLoading,
    isFilterLoading,
    allEventTypes,
    selectedCategories,
    toggleCategory,
    selectAll,
    deselectAll,
    isNoneSelected,
    hasActiveFilters,
    showAdvancedFilters,
    toggleAdvancedFilters,
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    venues,
    selectedVenues,
    setSelectedVenues,
    locations,
    hasAdvancedFilters,
    handleRemoveVenue,
    handleClearDateFilter,
    resetFilters,
    handleRsvp: handleRsvpWithAuth,
    showRsvpButtons: !!user,
    loadingEventId
  };
  
  return <>{children(contextProps)}</>;
};
