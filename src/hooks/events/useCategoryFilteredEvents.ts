
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { processEventsData } from '@/utils/eventProcessorUtils';
import { useRsvpActions } from '@/hooks/useRsvpActions';

export const useCategoryFilteredEvents = (categorySlug: string | undefined) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { handleRsvp, loading: rsvpLoading } = useRsvpActions();
  
  useEffect(() => {
    const fetchEvents = async () => {
      if (!categorySlug) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            venues:venue_id (*),
            creator:profiles (*),
            event_rsvps (*)
          `)
          .eq('event_type', categorySlug)
          .order('start_date', { ascending: true });
        
        if (error) {
          console.error('Error fetching events by category:', error);
          return;
        }
        
        if (data) {
          const processedEvents = processEventsData(data, user?.id);
          setEvents(processedEvents);
        }
      } catch (err) {
        console.error('Error in category events:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, [categorySlug, user?.id]);
  
  const handleEventRsvp = async (eventId: string, status: 'Going' | 'Interested'): Promise<void> => {
    // Simply pass through to the handleRsvp function from useRsvpActions
    await handleRsvp(eventId, status);
    
    // After successful RSVP, update the events list with the new status
    setEvents(prevEvents => 
      prevEvents.map(event => {
        if (event.id === eventId) {
          // If the status is the same as current, remove it (toggle behavior)
          const newStatus = event.rsvp_status === status ? undefined : status;
          return {
            ...event,
            rsvp_status: newStatus
          };
        }
        return event;
      })
    );
  };
  
  return {
    events,
    isLoading,
    handleRsvp: handleEventRsvp,
    rsvpLoading,
  };
};
