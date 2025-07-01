
import { useMemo } from 'react';
import { Event } from '@/types';
import { filterEventsByDateRange } from '@/utils/date-filtering';
import { DateRange } from 'react-day-picker';

interface UseFilteredEventsProps {
  events: Event[];
  selectedCategories: string[];
  allEventTypes: string[];
  selectedVenues: string[];
  selectedVibes: string[];
  dateRange: DateRange | undefined;
  selectedDateFilter: string;
}

export const useFilteredEvents = ({
  events,
  selectedCategories,
  allEventTypes,
  selectedVenues,
  selectedVibes,
  dateRange,
  selectedDateFilter
}: UseFilteredEventsProps) => {
  return useMemo(() => {
    if (!events || events.length === 0) {
      return [];
    }

    let filteredEvents = [...events];

    // Filter by event category - only apply if some categories are selected (not all or none)
    const hasActiveCategories = selectedCategories.length > 0 && selectedCategories.length < allEventTypes.length;
    if (hasActiveCategories) {
      console.log('Applying category filter:', selectedCategories);
      filteredEvents = filteredEvents.filter(event => 
        event.event_category && selectedCategories.includes(event.event_category)
      );
      console.log('Events after category filter:', filteredEvents.length);
    }

    // Filter by venues
    if (selectedVenues.length > 0) {
      console.log('Applying venue filter:', selectedVenues);
      filteredEvents = filteredEvents.filter(event => 
        event.venue_id && selectedVenues.includes(event.venue_id)
      );
      console.log('Events after venue filter:', filteredEvents.length);
    }

    // Filter by vibes - apply filter if any vibes are selected
    if (selectedVibes.length > 0) {
      console.log('Applying vibe filter:', selectedVibes);
      filteredEvents = filteredEvents.filter(event => 
        event.vibe && selectedVibes.includes(event.vibe)
      );
      console.log('Events after vibe filter:', filteredEvents.length);
    }

    // Filter by date
    if (dateRange || selectedDateFilter) {
      console.log('Applying date filter:', selectedDateFilter, dateRange);
      filteredEvents = filteredEvents.filter(event => filterEventsByDateRange(event, selectedDateFilter, dateRange));
      console.log('Events after date filter:', filteredEvents.length);
    }

    return filteredEvents;
  }, [events, selectedCategories, allEventTypes, selectedVenues, selectedVibes, dateRange, selectedDateFilter]);
};
