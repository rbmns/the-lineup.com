
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
      // Check if eventId is valid before querying
      if (!eventId) {
        console.error('Error: Missing eventId parameter');
        setError('Event ID is missing');
        setIsLoading(false);
        return;
      }

      console.log(`Fetching event details for eventId=${eventId}, userId=${user?.id}`);
      
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          creator:profiles(*),
          venues:venue_id(*),
          event_rsvps!inner(id, user_id, status)
        `)
        .eq('id', eventId)
        .single();

      if (error) {
        // Maybe the event exists but user hasn't RSVP'd - try without inner join
        const { data: dataNoRsvp, error: errorNoRsvp } = await supabase
          .from('events')
          .select(`
            *,
            creator:profiles(*),
            venues:venue_id(*)
          `)
          .eq('id', eventId)
          .single();
          
        if (errorNoRsvp) {
          console.error('Error fetching event details:', errorNoRsvp);
          setError('Failed to load event details.');
          toast({
            title: "Error loading event",
            description: "We couldn't load the event details. Please try again.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        } else {
          // Successfully got event, but no RSVP
          console.log('Event data loaded (no RSVP):', dataNoRsvp);
          
          // If user is logged in, check for RSVP separately
          if (user) {
            const { data: rsvpData } = await supabase
              .from('event_rsvps')
              .select('status')
              .eq('event_id', eventId)
              .eq('user_id', user.id)
              .maybeSingle();
              
            if (rsvpData) {
              // Add RSVP status to event data
              dataNoRsvp.rsvp_status = rsvpData.status;
              console.log(`Found RSVP status for event ${eventId}:`, rsvpData.status);
            }
          }
          
          setEvent(dataNoRsvp);
          fetchAttendees(eventId);
        }
      } else if (data) {
        console.log('Event data loaded with RSVP:', data);
        
        // Extract RSVP status for the current user
        if (user && data.event_rsvps && data.event_rsvps.length > 0) {
          const userRsvp = data.event_rsvps.find((rsvp: any) => rsvp.user_id === user.id);
          if (userRsvp) {
            data.rsvp_status = userRsvp.status;
            console.log(`Set RSVP status for event ${eventId}:`, data.rsvp_status);
          }
        }
        
        setEvent(data);
        fetchAttendees(eventId);
      } else {
        setError('Event not found');
        toast({
          title: "Event not found",
          description: "The event you're looking for doesn't exist or has been removed.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Unexpected error fetching event details:', err);
      setError('An unexpected error occurred.');
      toast({
        title: "Error",
        description: "Something went wrong while loading the event. Please try again.",
        variant: "destructive"
      });
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

  // Handle RSVP for a specific event
  const rsvpToEvent = async (status: 'Going' | 'Interested') => {
    if (!user) {
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

      console.log(`useEventDetails: RSVP to event ${eventId} with status ${status}`);
      const result = await hookHandleRsvp(eventId, status);
      if (result) {
        // Optimistically update the event state
        setEvent((prevEvent) => {
          if (prevEvent) {
            return { 
              ...prevEvent, 
              rsvp_status: prevEvent.rsvp_status === status ? null : status 
            };
          }
          return prevEvent;
        });
        
        // Refresh attendees data
        fetchAttendees(eventId);
        
        toast({
          title: "RSVP Updated",
          description: `You're now ${status.toLowerCase()} to this event.`
        });
      }
    } catch (err) {
      console.error('Error during RSVP:', err);
      toast({
        title: "RSVP Failed",
        description: "We couldn't update your RSVP. Please try again.",
        variant: "destructive"
      });
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
