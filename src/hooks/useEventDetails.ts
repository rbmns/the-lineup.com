
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const { handleRsvp: hookHandleRsvp, loading: rsvpLoadingState } = useRsvpActions();
  
  // Get RSVP status from location state if available
  const initialRsvpStatus = location.state?.rsvpStatus || null;

  // Fetch event data
  const fetchEventDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if eventId is valid before querying
      if (!eventId) {
        console.error('Error: Missing eventId parameter');
        setError('Event ID is missing');
        setIsLoading(false);
        return;
      }

      console.log(`Fetching event details for eventId=${eventId}`);
      
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          creator:profiles(*),
          venues:venue_id(*),
          event_rsvps(id, user_id, status)
        `)
        .eq('id', eventId)
        .single();

      if (error) {
        console.error('Error fetching event details:', error);
        setError('Failed to load event details.');
      } else if (data) {
        console.log('Event data loaded:', data);
        
        // Apply RSVP status from navigation state if available
        if (initialRsvpStatus && !data.rsvp_status) {
          console.log(`Applying initial RSVP status from navigation to loaded event: ${initialRsvpStatus}`);
          data.rsvp_status = initialRsvpStatus;
        }
        
        setEvent(data);
        
        // Fetch attendees
        fetchAttendees(eventId);
      } else {
        setError('Event not found');
      }
    } catch (err) {
      console.error('Unexpected error fetching event details:', err);
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAttendees = async (eventId: string) => {
    try {
      const { data: goingData, error: goingError } = await supabase
        .from('event_rsvps')
        .select('user_id, profiles:user_id(*)')
        .eq('event_id', eventId)
        .eq('status', 'Going');
      
      const { data: interestedData, error: interestedError } = await supabase
        .from('event_rsvps')
        .select('user_id, profiles:user_id(*)')
        .eq('event_id', eventId)
        .eq('status', 'Interested');
      
      if (goingError || interestedError) {
        console.error('Error fetching attendees:', goingError || interestedError);
      } else {
        setAttendees({
          going: goingData?.map(item => item.profiles) || [],
          interested: interestedData?.map(item => item.profiles) || []
        });
      }
    } catch (err) {
      console.error('Error fetching attendees:', err);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);
  
  // Apply RSVP status from location state when it changes
  useEffect(() => {
    if (initialRsvpStatus && event && !event.rsvp_status) {
      console.log(`Applying RSVP status from location state: ${initialRsvpStatus}`);
      setEvent(prev => prev ? {...prev, rsvp_status: initialRsvpStatus} : null);
    }
  }, [initialRsvpStatus, event]);

  // Legacy handler (for backward compatibility)
  const rsvpToEvent = async (status: 'Going' | 'Interested') => {
    if (!user) {
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
        
        // Refresh attendees data
        fetchAttendees(eventId);
      }
    } catch (err) {
      console.error('Error during RSVP:', err);
    }
  };

  // Modern handler (takes eventId parameter directly)
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
