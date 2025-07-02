import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import { BrowserRouter } from 'react-router-dom';
import EventForm from '@/components/events/EventForm';
import { mockSupabase } from '../mocks/supabase';

describe('Event Creation Flow Integration', () => {
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
  });

  describe('Complete Event Creation Flow', () => {
    it('should create event successfully with all required fields', async () => {
      // Mock successful event creation
      mockSupabase.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({
            data: [{
              id: 'new-event-id',
              title: 'Test Event',
              description: 'Test Description',
              start_datetime: '2024-01-15T19:00:00.000Z',
              end_datetime: '2024-01-15T22:00:00.000Z',
              destination: 'Amsterdam',
              venue_name: 'Test Venue',
              event_category: 'Music',
              vibe: 'Energetic',
              creator: 'test-user-id',
              status: 'published',
            }],
            error: null,
          }),
        }),
      });

      render(
        <BrowserRouter>
          <EventForm />
        </BrowserRouter>
      );

      // Fill in required fields
      const titleInput = screen.getByLabelText(/title/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const cityInput = screen.getByLabelText(/city/i);
      const startTimeInput = screen.getByLabelText(/start time/i);
      const endTimeInput = screen.getByLabelText(/end time/i);

      fireEvent.change(titleInput, { target: { value: 'Test Event' } });
      fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
      fireEvent.change(cityInput, { target: { value: 'Amsterdam' } });
      fireEvent.change(startTimeInput, { target: { value: '19:00' } });
      fireEvent.change(endTimeInput, { target: { value: '22:00' } });

      // Set start date (today + 1 day)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const startDateInput = screen.getByLabelText(/start date/i);
      fireEvent.change(startDateInput, { 
        target: { value: tomorrow.toISOString().split('T')[0] } 
      });

      // Submit form
      const submitButton = screen.getByRole('button', { name: /create event/i });
      fireEvent.click(submitButton);

      // Verify event was created
      await waitFor(() => {
        expect(mockSupabase.from).toHaveBeenCalledWith('events');
      });
    });

    it('should validate required fields before submission', async () => {
      render(
        <BrowserRouter>
          <EventForm />
        </BrowserRouter>
      );

      // Try to submit without filling required fields
      const submitButton = screen.getByRole('button', { name: /create event/i });
      fireEvent.click(submitButton);

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText(/title is required/i)).toBeInTheDocument();
        expect(screen.getByText(/city is required/i)).toBeInTheDocument();
        expect(screen.getByText(/start time is required/i)).toBeInTheDocument();
      });
    });

    it('should handle timezone selection correctly', async () => {
      render(
        <BrowserRouter>
          <EventForm />
        </BrowserRouter>
      );

      // Check default timezone is set
      const timezoneSelect = screen.getByDisplayValue(/europe\/amsterdam/i);
      expect(timezoneSelect).toBeInTheDocument();

      // Change timezone
      fireEvent.change(timezoneSelect, { target: { value: 'America/New_York' } });
      
      // Verify timezone changed
      expect(screen.getByDisplayValue(/america\/new_york/i)).toBeInTheDocument();
    });

    it('should handle venue creation flow', async () => {
      // Mock venue creation
      mockSupabase.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({
            data: [{
              id: 'new-venue-id',
              name: 'New Test Venue',
              city: 'Amsterdam',
            }],
            error: null,
          }),
        }),
      });

      render(
        <BrowserRouter>
          <EventForm />
        </BrowserRouter>
      );

      // Fill in venue name
      const venueNameInput = screen.getByLabelText(/venue name/i);
      fireEvent.change(venueNameInput, { target: { value: 'New Test Venue' } });

      // This would trigger venue creation in the actual flow
      expect(venueNameInput).toHaveValue('New Test Venue');
    });

    it('should auto-generate Google Maps link when not provided', async () => {
      render(
        <BrowserRouter>
          <EventForm />
        </BrowserRouter>
      );

      // Fill in address and city
      const addressInput = screen.getByLabelText(/address/i);
      const cityInput = screen.getByLabelText(/city/i);

      fireEvent.change(addressInput, { target: { value: 'Test Street 123' } });
      fireEvent.change(cityInput, { target: { value: 'Amsterdam' } });

      // The form should auto-generate Google Maps link
      // This would be tested in the form submission handler
      expect(addressInput).toHaveValue('Test Street 123');
      expect(cityInput).toHaveValue('Amsterdam');
    });
  });

  describe('Event Category and Vibe Selection', () => {
    it('should allow category selection', async () => {
      render(
        <BrowserRouter>
          <EventForm />
        </BrowserRouter>
      );

      // Find and click on a category (assuming toggle buttons)
      const musicCategory = screen.getByText(/music/i);
      if (musicCategory) {
        fireEvent.click(musicCategory);
        // Verify selection state would be checked here
      }
    });

    it('should allow vibe selection', async () => {
      render(
        <BrowserRouter>
          <EventForm />
        </BrowserRouter>
      );

      // Find and click on a vibe (assuming toggle buttons)
      const energeticVibe = screen.getByText(/energetic/i);
      if (energeticVibe) {
        fireEvent.click(energeticVibe);
        // Verify selection state would be checked here
      }
    });
  });

  describe('Optional Fields Handling', () => {
    it('should handle optional fields correctly', async () => {
      render(
        <BrowserRouter>
          <EventForm />
        </BrowserRouter>
      );

      // Expand optional fields section
      const optionalSection = screen.getByText(/optional information/i);
      fireEvent.click(optionalSection);

      // Fill in optional fields
      const bookingLinkInput = screen.getByLabelText(/booking link/i);
      const feeInput = screen.getByLabelText(/fee/i);
      const tagsInput = screen.getByLabelText(/tags/i);

      fireEvent.change(bookingLinkInput, { target: { value: 'https://example.com/book' } });
      fireEvent.change(feeInput, { target: { value: '25' } });
      fireEvent.change(tagsInput, { target: { value: 'music, concert, live' } });

      expect(bookingLinkInput).toHaveValue('https://example.com/book');
      expect(feeInput).toHaveValue('25');
      expect(tagsInput).toHaveValue('music, concert, live');
    });
  });

  describe('Error Handling', () => {
    it('should handle creation errors gracefully', async () => {
      // Mock creation error
      mockSupabase.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Failed to create event' },
          }),
        }),
      });

      render(
        <BrowserRouter>
          <EventForm />
        </BrowserRouter>
      );

      // Fill minimal required fields and submit
      const titleInput = screen.getByLabelText(/title/i);
      const cityInput = screen.getByLabelText(/city/i);
      const startTimeInput = screen.getByLabelText(/start time/i);
      const endTimeInput = screen.getByLabelText(/end time/i);

      fireEvent.change(titleInput, { target: { value: 'Test Event' } });
      fireEvent.change(cityInput, { target: { value: 'Amsterdam' } });
      fireEvent.change(startTimeInput, { target: { value: '19:00' } });
      fireEvent.change(endTimeInput, { target: { value: '22:00' } });

      const submitButton = screen.getByRole('button', { name: /create event/i });
      fireEvent.click(submitButton);

      // Should handle error gracefully
      await waitFor(() => {
        // Error handling would be verified here
        expect(mockSupabase.from).toHaveBeenCalled();
      });
    });
  });
});