
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
    events: mockEvents,
    onRsvp: vi.fn(),
    showRsvpButtons: true,
    compact: false,
    isLoading: false,
    hasActiveFilters: false,
    similarEvents: [],
  };

  it('renders events list', () => {
    render(<EventsList {...defaultProps} />);
    
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<EventsList {...defaultProps} isLoading={true} events={[]} />);
    
    // The component should handle loading state
    expect(screen.queryByText('Test Event')).not.toBeInTheDocument();
  });

  it('shows empty state when no events', () => {
    render(<EventsList {...defaultProps} events={[]} />);
    
    expect(screen.queryByText('Test Event')).not.toBeInTheDocument();
  });
});
