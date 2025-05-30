
import { useMemo } from 'react';
import { Event } from '@/types';
import { filterEventsByDate } from '@/utils/date-filtering';
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

    // Filter by event category/type
    // If categories are selected, filter by them; otherwise show all
    if (selectedCategories.length > 0 && selectedCategories.length < allEventTypes.length) {
      filteredEvents = filteredEvents.filter(event => 
        event.event_category && selectedCategories.includes(event.event_category)
      );
    }

    // Filter by venues
    if (selectedVenues.length > 0) {
      filteredEvents = filteredEvents.filter(event => 
        event.venue_id && selectedVenues.includes(event.venue_id)
      );
    }

    // Filter by vibes
    if (selectedVibes.length > 0) {
      filteredEvents = filteredEvents.filter(event => 
        event.vibe && selectedVibes.includes(event.vibe)
      );
    }

    // Filter by date
    if (dateRange || selectedDateFilter) {
      filteredEvents = filterEventsByDate(filteredEvents, selectedDateFilter, dateRange);
    }

    return filteredEvents;
  }, [events, selectedCategories, allEventTypes, selectedVenues, selectedVibes, dateRange, selectedDateFilter]);
};
