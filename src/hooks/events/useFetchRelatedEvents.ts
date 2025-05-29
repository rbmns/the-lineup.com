
import { useState, useEffect, useRef } from 'react';
import { Event } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface UseFetchRelatedEventsProps {
  eventType: string;
  currentEventId: string;
  userId?: string;
  tags?: string[];
  vibe?: string;
  minResults?: number;
  startDate?: string;
}

interface RelatedEventsResult {
  relatedEvents: Event[];
  loading: boolean;
}

export const useFetchRelatedEvents = ({ 
  eventType, 
  currentEventId,
  userId,
  tags,
  vibe,
  minResults = 2,
  startDate
}: UseFetchRelatedEventsProps): RelatedEventsResult => {
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const loadingRef = useRef(false);
  const dataFetchedRef = useRef(false);
  
  useEffect(() => {
    const loadRelatedEvents = async () => {
      if (loadingRef.current) return;
      if (dataFetchedRef.current && relatedEvents.length >= minResults) return;
      
      try {
        loadingRef.current = true;
        setLoading(true);
        
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            creator:profiles(id, username, avatar_url, email, location, status),
            venues:venue_id(*)
          `)
          .eq('event_type', eventType)
          .neq('id', currentEventId)
          .gte('start_date', today)
          .order('start_time', { ascending: true })
          .limit(8);
        
        if (error) {
          console.error('Error fetching related events:', error);
          setRelatedEvents([]);
        } else if (data) {
          const eventsWithAttendees = data.map(event => ({
            ...event,
            attendees: { going: 0, interested: 0 }
          }));
          setRelatedEvents(eventsWithAttendees);
        }
        
        dataFetchedRef.current = true;
      } catch (error) {
        console.error('Error in related events hook:', error);
        setRelatedEvents([]);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    };
    
    if (currentEventId) {
      loadRelatedEvents();
    } else {
      setLoading(false);
    }
  }, [eventType, currentEventId, userId, minResults, tags, vibe, startDate]); 
  
  return { relatedEvents, loading };
};
