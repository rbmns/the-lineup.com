
import React from 'react';
import { Event } from '@/types';
import { FilteredEventsList } from '@/components/events/FilteredEventsList';

interface EventsListProps {
  isLoading: boolean;
  isSearching: boolean;
  displayEvents: Event[];
  queryOnlyResults?: Event[] | null;
  searchQuery?: string;
  noResultsFound: boolean;
  similarEvents: Event[];
  resetFilters: () => void;
  handleRsvpAction: (eventId: string, status: 'Going' | 'Interested') => Promise<void>;
  isAuthenticated: boolean;
}

export const EventsList: React.FC<EventsListProps> = (props) => {
  // Simply pass all props to the FilteredEventsList component
  return <FilteredEventsList {...props} />;
};
