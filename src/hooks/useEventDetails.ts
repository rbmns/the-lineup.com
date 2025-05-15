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
  error: string | null;
  handleRsvp: (status: 'Going' | 'Interested') => Promise<void>;
}

export const useEventDetails = (eventId: string): UseEventDetailsResult => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { handleRsvp } = useRsvpActions();

  useEffect(() => {
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

    fetchEventDetails();
  }, [eventId]);

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
        toast({
          title: "Error",
          description: "Event ID is missing.",
          variant: "destructive",
        });
        return;
      }

      const result = await handleRsvp(eventId, status);
      if (result) {
        // success handling
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
      toast({
        title: "RSVP Error",
        description: "Failed to update RSVP status",
        variant: "destructive",
      });
    }
  };

  return {
    event,
    isLoading,
    error,
    handleRsvp: rsvpToEvent,
  };
};
