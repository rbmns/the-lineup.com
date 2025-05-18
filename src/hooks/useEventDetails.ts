
import { useState, useEffect } from 'react';
import { Event } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEventDetailsFetcher } from './events/useEventDetailsFetcher';
import { useEventAttendees } from './events/useEventAttendees';
import { useEventRsvpHandler } from './events/useEventRsvpHandler';
import { useRsvpActions } from './useRsvpActions';

interface UseEventDetailsResult {
  event: Event | null;
  isLoading: boolean;
  error: Error | string | null;
  attendees: { going: any[]; interested: any[] };
  rsvpLoading: boolean;
  handleRsvp: (status: 'Going' | 'Interested') => Promise<boolean>;
  handleRsvpAction: (eventId: string, status: 'Going' | 'Interested') => Promise<void>;
  refreshData: () => Promise<void>;
}

export const useEventDetails = (eventId: string): UseEventDetailsResult => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { handleRsvp: hookHandleRsvp, loading: rsvpLoadingState } = useRsvpActions();
  
  // Use our new extracted hooks
  const { event, isLoading, error, refreshData } = useEventDetailsFetcher(eventId);
  const { attendees, fetchAttendees } = useEventAttendees(eventId);
  const { handleRsvp: directRsvpHandler, rsvpLoading: localRsvpLoading } = useEventRsvpHandler(eventId);

  // Fetch attendees whenever the event changes
  useEffect(() => {
    if (event) {
      fetchAttendees();
    }
  }, [event]);

  // Handle RSVP for a specific event - Using the directRsvpHandler
  const rsvpToEvent = async (status: 'Going' | 'Interested'): Promise<boolean> => {
    if (!user) {
      navigate('/login');
      return false;
    }

    try {
      if (!eventId) {
        console.error("Error: Event ID is missing.");
        return false;
      }

      console.log(`useEventDetails: RSVP to event ${eventId} with status ${status}`);
      
      // Use the reusable RSVP functionality from useRsvpActions
      const result = await hookHandleRsvp(eventId, status);
      
      if (result) {
        // Optimistically update the event state
        if (event) {
          const newStatus = event.rsvp_status === status ? null : status;
          const updatedEvent = { ...event, rsvp_status: newStatus };
          // We can't directly set the event here as it's managed by useEventDetailsFetcher,
          // but we can refresh the data to get the updated state
          await refreshData();
        }
        
        // Refresh attendees data
        await fetchAttendees();
      }
      
      return result;
    } catch (err) {
      console.error('Error during RSVP:', err);
      return false;
    }
  };

  // Handle RSVP for any event (used for passing to components)
  const handleRsvpAction = async (eventId: string, status: 'Going' | 'Interested') => {
    await hookHandleRsvp(eventId, status);
  };

  return {
    event,
    isLoading,
    error,
    attendees,
    rsvpLoading: rsvpLoadingState || localRsvpLoading,
    handleRsvp: rsvpToEvent,
    handleRsvpAction,
    refreshData
  };
};
