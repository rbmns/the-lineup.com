
import { useState, useEffect } from 'react';
import { Event } from '@/types';
import { supabase } from '@/lib/supabase';

export const useRecurringEvents = (event: Event | null) => {
  const [recurringEvents, setRecurringEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchRecurringEvents = async () => {
      // Don't fetch if event is not available
      if (!event?.title || !event?.destination) {
        setRecurringEvents([]);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            venues:venue_id(*),
            creator:profiles(*)
          `)
          .eq('title', event.title)
          .eq('destination', event.destination)
          .neq('id', event.id) // Exclude the current event
          .order('start_time', { ascending: true });
          
        if (error) {
          console.error('Error fetching recurring events:', error);
          setRecurringEvents([]);
        } else if (data) {
          // Filter to ensure we have events with dates and that they're truly recurring
          // (same name, same destination)
          const validRecurring = data.filter(item => 
            item.start_time && 
            item.title === event.title && 
            item.destination === event.destination
          );
          
          setRecurringEvents(validRecurring);
        }
      } catch (err) {
        console.error('Error in recurring events hook:', err);
        setRecurringEvents([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecurringEvents();
  }, [event?.id, event?.title, event?.destination]);
  
  return { recurringEvents, isLoading };
};
