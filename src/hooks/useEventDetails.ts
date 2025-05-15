import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useRsvpActions } from '@/hooks/useRsvpActions';

interface UseEventDetailsResult {
  event: Event | null;
  isLoading: boolean;
  error: Error | string | null;
  attendees: { going: any[]; interested: any[] };
  rsvpLoading: boolean;
  handleRsvp: (status: 'Going' | 'Interested') => Promise<void>;
  handleRsvpAction: (eventId: string, status: 'Going' | 'Interested') => Promise<void>;
  refreshData: () => Promise<void>;
}

export const useEventDetails = (eventId: string): UseEventDetailsResult => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | string | null>(null);
  const [attendees, setAttendees] = useState<{ going: any[]; interested: any[] }>({ going: [], interested: [] });
  const [rsvpLoading, setRsvpLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { handleRsvp: hookHandleRsvp, loading: rsvpLoadingState } = useRsvpActions();

  // Fetch event data
  const fetchEventDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) {
        console.error('Error fetching event details:', error);
        setError('Failed to load event details.');
      }

      if (data) {
        setEvent(data);
      }
    } catch (err) {
      console.error('Unexpected error fetching event details:', err);
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  // Handle RSVP for a specific event
  const rsvpToEvent = async (status: 'Going' | 'Interested') => {
    if (!user) {
      // Keep this important toast for authentication feedback
      toast({
        title: "Authentication required",
        description: "Please log in to RSVP to events",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    try {
      if (!eventId) {
        console.error("Error: Event ID is missing.");
        return;
      }

      const result = await hookHandleRsvp(eventId, status);
      if (result) {
        // Optimistically update the event state
        setEvent((prevEvent) => {
          if (prevEvent) {
            return { ...prevEvent, rsvp_status: status };
          }
          return prevEvent;
        });
      }
    } catch (err) {
      console.error('Error during RSVP:', err);
    }
  };

  // Handle RSVP for any event (used for passing to components)
  const handleRsvpAction = async (eventId: string, status: 'Going' | 'Interested') => {
    await hookHandleRsvp(eventId, status);
  };

  // Refresh all event data
  const refreshData = async () => {
    await fetchEventDetails();
  };

  return {
    event,
    isLoading,
    error,
    attendees,
    rsvpLoading: rsvpLoadingState,
    handleRsvp: rsvpToEvent,
    handleRsvpAction,
    refreshData
  };
};
