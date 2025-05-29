
import { useState, useEffect, useCallback } from 'react';
import { Event } from '@/types';
import { filterEventsByType, filterEventsByVenue } from '@/utils/eventUtils';
import { filterEventsByDate } from '@/utils/date-filtering';
import { useSearchParams } from 'react-router-dom';
import { DateRange } from 'react-day-picker';

interface EventFilterOptions {
  event_category: string;
  venues: { name: string; id: string; };
}

export const useEventsFiltering = (events: Event[] = [], userId: string | undefined = undefined) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [availableEventTypes, setAvailableEventTypes] = useState<Array<{ value: string; label: string }>>([]);
  const [availableVenues, setAvailableVenues] = useState<Array<{ value: string; label: string }>>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events);
  const [showEventTypeFilter, setShowEventTypeFilter] = useState(false);
  const [showVenueFilter, setShowVenueFilter] = useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('');
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  // Initialize selected filters from URL parameters
  useEffect(() => {
    const eventTypesParam = searchParams.get('eventTypes');
    const venuesParam = searchParams.get('venues');
    const dateRangeFromParam = searchParams.get('dateRangeFrom');
    const dateRangeToParam = searchParams.get('dateRangeTo');
    const selectedDateFilterParam = searchParams.get('selectedDateFilter');

    if (eventTypesParam) {
      setSelectedEventTypes(eventTypesParam.split(','));
    }
    if (venuesParam) {
      setSelectedVenues(venuesParam.split(','));
    }
    if (dateRangeFromParam && dateRangeToParam) {
      setDateRange({
        from: new Date(dateRangeFromParam),
        to: new Date(dateRangeToParam),
      });
    }
    if (selectedDateFilterParam) {
      setSelectedDateFilter(selectedDateFilterParam);
    }
  }, [searchParams]);

  // Update URL parameters when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedEventTypes.length > 0) {
      params.set('eventTypes', selectedEventTypes.join(','));
    }
    if (selectedVenues.length > 0) {
      params.set('venues', selectedVenues.join(','));
    }
    if (dateRange?.from && dateRange?.to) {
      params.set('dateRangeFrom', dateRange.from.toISOString());
      params.set('dateRangeTo', dateRange.to.toISOString());
    }
    if (selectedDateFilter) {
      params.set('selectedDateFilter', selectedDateFilter);
    }
    setSearchParams(params);
  }, [selectedEventTypes, selectedVenues, dateRange, selectedDateFilter, setSearchParams]);

  // Extract available event types and venues from events
  useEffect(() => {
    if (events && events.length > 0) {
      // Extract unique event types
      const uniqueEventTypes = [...new Set(events.map(event => event.event_category).filter(Boolean))]
        .map(type => ({ value: type, label: type }))
        .sort((a, b) => a.label.localeCompare(b.label));
      setAvailableEventTypes(uniqueEventTypes);

      // Extract unique venues
      const uniqueVenues = [...new Set(events
        .filter(event => event.venues?.name && event.venue_id)
        .map(event => ({ name: event.venues?.name, id: event.venue_id }))
        .filter(Boolean)
        .map(venue => JSON.stringify(venue)))]
        .map(venueStr => JSON.parse(venueStr))
        .map(venue => ({ value: venue.id, label: venue.name }))
        .sort((a, b) => a.label.localeCompare(b.label));
      
      setAvailableVenues(uniqueVenues);
    }
  }, [events]);

  // Apply filters
  useEffect(() => {
    setIsFilterLoading(true);
    let result = [...events];

    // Apply event type filter
    if (selectedEventTypes.length > 0) {
      result = filterEventsByType(result, selectedEventTypes);
    }

    // Apply venue filter
    if (selectedVenues.length > 0) {
      result = filterEventsByVenue(result, selectedVenues);
    }

    // Apply date filter
    if (dateRange || selectedDateFilter) {
      result = filterEventsByDate(result, selectedDateFilter, dateRange);
    }

    setFilteredEvents(result);
    setIsFilterLoading(false);
  }, [events, selectedEventTypes, selectedVenues, dateRange, selectedDateFilter]);

  // Check if there are any active filters
  useEffect(() => {
    const hasFilters =
      selectedEventTypes.length > 0 ||
      selectedVenues.length > 0 ||
      dateRange !== undefined ||
      selectedDateFilter !== '';
    setHasActiveFilters(hasFilters);
  }, [selectedEventTypes, selectedVenues, dateRange, selectedDateFilter]);

  const resetFilters = useCallback(() => {
    setSelectedEventTypes([]);
    setSelectedVenues([]);
    setDateRange(undefined);
    setSelectedDateFilter('');
  }, [setSelectedEventTypes, setSelectedVenues, setDateRange, setSelectedDateFilter]);

  // Function to fetch similar events based on selected filters
  const fetchSimilarEvents = async (
    selectedEventTypes: string[],
    events: Event[]
  ): Promise<Event[]> => {
    // Simulate fetching similar events
    return new Promise((resolve) => {
      setTimeout(() => {
        const similar = events.filter((event) =>
          selectedEventTypes.includes(event.event_category)
        );
        resolve(similar);
      }, 500);
    });
  };

  return {
    selectedEventTypes,
    setSelectedEventTypes,
    selectedVenues,
    setSelectedVenues,
    dateRange,
    setDateRange,
    availableEventTypes,
    availableVenues,
    filteredEvents,
    showEventTypeFilter,
    setShowEventTypeFilter,
    showVenueFilter,
    setShowVenueFilter,
    showDateFilter,
    setShowDateFilter,
    selectedDateFilter,
    setSelectedDateFilter,
    resetFilters,
    hasActiveFilters,
    isFilterLoading,
    fetchSimilarEvents
  };
};
