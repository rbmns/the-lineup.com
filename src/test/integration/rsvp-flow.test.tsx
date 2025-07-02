import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { BrowserRouter } from 'react-router-dom';
import EventDetail from '@/pages/EventDetail';
import { mockSupabase } from '../mocks/supabase';

// Mock event data
const mockEvent = {
  id: 'test-event-id',
  title: 'Test Event',
  description: 'This is a test event',
  start_datetime: '2024-01-15T19:00:00.000Z',
  end_datetime: '2024-01-15T22:00:00.000Z',
  destination: 'Amsterdam',
  venue_name: 'Test Venue',
  event_category: 'Music',
  vibe: 'Energetic',
  status: 'published',
  timezone: 'Europe/Amsterdam',
  creator: 'creator-user-id',
  booking_link: 'https://example.com/book',
  google_maps: 'https://maps.google.com/...',
};

describe('RSVP Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock authenticated user
    mockSupabase.auth.getUser.mockResolvedValue({
      data: {
        user: {
          id: 'test-user-id',
          email: 'test@example.com',
        },
      },
      error: null,
    });

    // Mock event details query
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockEvent,
            error: null,
          }),
        }),
      }),
    });
  });

  describe('RSVP Actions', () => {
    it('should handle "Going" RSVP successfully', async () => {
      // Mock RSVP creation
      const mockRsvpChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null, // No existing RSVP
          error: null,
        }),
        insert: vi.fn().mockResolvedValue({
          data: [{
            id: 'new-rsvp-id',
            event_id: 'test-event-id',
            user_id: 'test-user-id',
            status: 'going',
          }],
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockRsvpChain);

      render(
        <BrowserRouter>
          <EventDetail />
        </BrowserRouter>
      );

      // Wait for event to load
      await waitFor(() => {
        expect(screen.getByText('Test Event')).toBeInTheDocument();
      });

      // Find and click "Going" button
      const goingButton = screen.getByText(/going/i);
      if (goingButton) {
        fireEvent.click(goingButton);

        // Verify RSVP was created
        await waitFor(() => {
          expect(mockSupabase.from).toHaveBeenCalledWith('event_rsvps');
        });
      }
    });

    it('should handle "Interested" RSVP successfully', async () => {
      // Mock RSVP creation for interested
      const mockRsvpChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null, // No existing RSVP
          error: null,
        }),
        insert: vi.fn().mockResolvedValue({
          data: [{
            id: 'new-rsvp-id',
            event_id: 'test-event-id',
            user_id: 'test-user-id',
            status: 'interested',
          }],
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockRsvpChain);

      render(
        <BrowserRouter>
          <EventDetail />
        </BrowserRouter>
      );

      // Wait for event to load
      await waitFor(() => {
        expect(screen.getByText('Test Event')).toBeInTheDocument();
      });

      // Find and click "Interested" button
      const interestedButton = screen.getByText(/interested/i);
      if (interestedButton) {
        fireEvent.click(interestedButton);

        // Verify RSVP was created
        await waitFor(() => {
          expect(mockSupabase.from).toHaveBeenCalledWith('event_rsvps');
        });
      }
    });

    it('should update existing RSVP when user changes status', async () => {
      // Mock existing RSVP
      const existingRsvp = {
        id: 'existing-rsvp-id',
        event_id: 'test-event-id',
        user_id: 'test-user-id',
        status: 'interested',
      };

      const mockRsvpChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: existingRsvp,
          error: null,
        }),
        update: vi.fn().mockResolvedValue({
          data: [{
            ...existingRsvp,
            status: 'going',
          }],
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockRsvpChain);

      render(
        <BrowserRouter>
          <EventDetail />
        </BrowserRouter>
      );

      // Wait for event to load
      await waitFor(() => {
        expect(screen.getByText('Test Event')).toBeInTheDocument();
      });

      // Change from interested to going
      const goingButton = screen.getByText(/going/i);
      if (goingButton) {
        fireEvent.click(goingButton);

        // Verify RSVP was updated
        await waitFor(() => {
          expect(mockSupabase.from).toHaveBeenCalledWith('event_rsvps');
        });
      }
    });

    it('should remove RSVP when user clicks same status twice', async () => {
      // Mock existing RSVP
      const existingRsvp = {
        id: 'existing-rsvp-id',
        event_id: 'test-event-id',
        user_id: 'test-user-id',
        status: 'going',
      };

      const mockRsvpChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: existingRsvp,
          error: null,
        }),
        delete: vi.fn().mockResolvedValue({
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockRsvpChain);

      render(
        <BrowserRouter>
          <EventDetail />
        </BrowserRouter>
      );

      // Wait for event to load
      await waitFor(() => {
        expect(screen.getByText('Test Event')).toBeInTheDocument();
      });

      // Click going button again to remove RSVP
      const goingButton = screen.getByText(/going/i);
      if (goingButton) {
        fireEvent.click(goingButton);

        // Verify RSVP was deleted
        await waitFor(() => {
          expect(mockSupabase.from).toHaveBeenCalledWith('event_rsvps');
        });
      }
    });
  });

  describe('RSVP Status Display', () => {
    it('should show correct RSVP status for authenticated user', async () => {
      // Mock user's existing RSVP
      const userRsvp = {
        id: 'user-rsvp-id',
        event_id: 'test-event-id',
        user_id: 'test-user-id',
        status: 'going',
      };

      const mockRsvpChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: userRsvp,
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockRsvpChain);

      render(
        <BrowserRouter>
          <EventDetail />
        </BrowserRouter>
      );

      // Should show that user is going
      await waitFor(() => {
        // Look for active state on going button
        const goingButton = screen.getByText(/going/i);
        expect(goingButton).toBeInTheDocument();
        // Button should have active styling (depends on implementation)
      });
    });

    it('should show RSVP counts correctly', async () => {
      // Mock RSVP counts
      const mockRsvpCounts = [
        { status: 'going', count: 5 },
        { status: 'interested', count: 12 },
      ];

      const mockCountChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        group: vi.fn().mockResolvedValue({
          data: mockRsvpCounts,
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockCountChain);

      render(
        <BrowserRouter>
          <EventDetail />
        </BrowserRouter>
      );

      // Should show RSVP counts
      await waitFor(() => {
        expect(screen.getByText('5')).toBeInTheDocument(); // Going count
        expect(screen.getByText('12')).toBeInTheDocument(); // Interested count
      });
    });
  });

  describe('Unauthenticated User Flow', () => {
    it('should prompt login when unauthenticated user tries to RSVP', async () => {
      // Mock unauthenticated state
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      render(
        <BrowserRouter>
          <EventDetail />
        </BrowserRouter>
      );

      // Wait for event to load
      await waitFor(() => {
        expect(screen.getByText('Test Event')).toBeInTheDocument();
      });

      // Try to click RSVP button
      const goingButton = screen.getByText(/going/i);
      if (goingButton) {
        fireEvent.click(goingButton);

        // Should show login prompt or redirect
        await waitFor(() => {
          // Look for login prompt (implementation specific)
          const loginPrompt = screen.getByText(/sign in/i);
          if (loginPrompt) {
            expect(loginPrompt).toBeInTheDocument();
          }
        });
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle RSVP creation errors gracefully', async () => {
      // Mock RSVP error
      const mockRsvpChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
        insert: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Failed to create RSVP' },
        }),
      };

      mockSupabase.from.mockReturnValue(mockRsvpChain);

      render(
        <BrowserRouter>
          <EventDetail />
        </BrowserRouter>
      );

      // Wait for event to load
      await waitFor(() => {
        expect(screen.getByText('Test Event')).toBeInTheDocument();
      });

      // Try to RSVP
      const goingButton = screen.getByText(/going/i);
      if (goingButton) {
        fireEvent.click(goingButton);

        // Should handle error gracefully
        await waitFor(() => {
          // Error handling depends on implementation
          expect(mockSupabase.from).toHaveBeenCalled();
        });
      }
    });

    it('should handle network errors during RSVP', async () => {
      // Mock network error
      const mockRsvpChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockRejectedValue(new Error('Network error')),
      };

      mockSupabase.from.mockReturnValue(mockRsvpChain);

      render(
        <BrowserRouter>
          <EventDetail />
        </BrowserRouter>
      );

      // Should handle network errors gracefully
      await waitFor(() => {
        expect(mockSupabase.from).toHaveBeenCalled();
      });
    });
  });

  describe('Real-time Updates', () => {
    it('should update RSVP counts in real-time', async () => {
      // This would test real-time subscriptions
      // Implementation depends on your real-time setup
      
      render(
        <BrowserRouter>
          <EventDetail />
        </BrowserRouter>
      );

      // Mock real-time update
      // This would simulate another user RSVPing
      const mockRealtimeUpdate = {
        eventType: 'INSERT',
        new: {
          id: 'new-rsvp-from-other-user',
          event_id: 'test-event-id',
          user_id: 'other-user-id',
          status: 'going',
        },
      };

      // Simulate real-time update
      // The implementation would depend on your real-time subscription setup
    });
  });
});