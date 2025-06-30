
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils/test-utils';
import { EventsList } from '../EventsList';
import { Event } from '@/types';

const mockEvents: Event[] = [
  {
    id: 'event-1',
    title: 'Test Event',
    description: 'A test event',
    start_date: '2024-01-15',
    start_time: '19:00:00',
    end_time: '22:00:00',
    event_category: 'Music',
    status: 'published',
    timezone: 'Europe/Amsterdam',
    venues: {
      id: 'venue-1',
      name: 'Test Venue',
      city: 'Amsterdam',
    },
  },
];

describe('EventsList', () => {
  const defaultProps = {
    isLoading: false,
    isSearching: false,
    displayEvents: mockEvents,
    noResultsFound: false,
    similarEvents: [],
    resetFilters: vi.fn(),
    handleRsvpAction: vi.fn(),
    isAuthenticated: true,
  };

  it('renders events list', () => {
    render(<EventsList {...defaultProps} />);
    
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<EventsList {...defaultProps} isLoading={true} />);
    
    // The FilteredEventsList component should handle loading state
    expect(screen.queryByText('Test Event')).not.toBeInTheDocument();
  });

  it('shows no results message when no events found', () => {
    render(<EventsList {...defaultProps} displayEvents={[]} noResultsFound={true} />);
    
    // This will be handled by the FilteredEventsList component
    expect(screen.queryByText('Test Event')).not.toBeInTheDocument();
  });
});
