import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/hooks/useEvents';
import { useRsvpStateManager } from '@/hooks/events/useRsvpStateManager';
import { useCategoryFilterSelection } from '@/hooks/events/useCategoryFilterSelection';
import { useGlobalFilterState } from '@/hooks/events/useGlobalFilterState';
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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Use our new RSVP state manager
  const { handleRsvp: stateManagerHandleRsvp, loadingEventId, isProcessing } = useRsvpStateManager(user?.id);
  
  // Use our new global filter state
  const {
    selectedEventTypes,
    setSelectedEventTypes,
    selectedVenues,
    setSelectedVenues,
    dateRange,
    setDateRange,
    selectedDateFilter,
    setSelectedDateFilter,
    resetFilters,
    handleRemoveVenue,
    handleClearDateFilter,
    hasActiveFilters,
    hasAdvancedFilters,
    isFilterLoading
  } = useGlobalFilterState();
  
  // Get all unique event types from events
  const allEventTypes = React.useMemo(() => {
    const types = events.map(event => event.event_category).filter(Boolean);
    return [...new Set(types)];
  }, [events]);
  
  // Filter events by selected event types
  const {
    selectedCategories,
    toggleCategory,
    selectAll,
    deselectAll,
    isNoneSelected
  } = useCategoryFilterSelection(allEventTypes, selectedEventTypes);
  
  // Keep the category filter and event type filter in sync
  useEffect(() => {
    // When selectedCategories change, update the global filter state
    if (selectedCategories.length > 0) {
      setSelectedEventTypes(selectedCategories);
    }
  }, [selectedCategories, setSelectedEventTypes]);
  
  // When selectedEventTypes change from global state, update categories
  useEffect(() => {
    // This effect needs special handling to prevent infinite loops
    // We're handling this in the useCategoryFilterSelection hook
  }, [selectedEventTypes]);
  
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
  
  // Toggle advanced filters visibility
  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(prev => !prev);
    
    // Store the preference in sessionStorage
    try {
      sessionStorage.setItem('event-advanced-filters', String(!showAdvancedFilters));
    } catch (e) {
      console.error("Error saving advanced filters state:", e);
    }
  };
  
  // Initialize advanced filters state from storage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('event-advanced-filters');
      if (stored) {
        setShowAdvancedFilters(stored === 'true');
      }
    } catch (e) {
      console.error("Error reading advanced filters state:", e);
    }
  }, []);
  
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
    
    // Dispatch a custom event to notify that RSVP is starting
    const rsvpEvent = new CustomEvent('rsvpStarted', {
      detail: {
        eventId,
        status,
        timestamp: Date.now()
      }
    });
    document.dispatchEvent(rsvpEvent);
    
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
