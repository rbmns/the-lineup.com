
import React from 'react';
import { Event } from '@/types';
import { EventsList } from '@/components/home/EventsList';

interface FilteredEventsListProps {
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

export const FilteredEventsList: React.FC<FilteredEventsListProps> = (props) => {
  // Pass all props directly to the EventsList component
  return <EventsList {...props} />;
};
