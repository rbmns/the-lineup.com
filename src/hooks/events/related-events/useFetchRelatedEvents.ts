
import { useState, useEffect, useRef } from 'react';
import { Event } from '@/types';
import { fetchRelatedEvents } from './fetchRelatedEvents';
import { UseFetchRelatedEventsProps, RelatedEventsState } from './types';

export const useFetchRelatedEvents = ({ 
  eventType, 
  currentEventId,
  userId,
  tags = [],
  vibe,
  minResults = 2,
  startDate
}: UseFetchRelatedEventsProps): RelatedEventsState => {
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const loadingRef = useRef<boolean>(false);
  const dataFetchedRef = useRef<boolean>(false);
  
  useEffect(() => {
    const loadRelatedEvents = async () => {
      // Avoid duplicate fetches
      if (loadingRef.current) return;
      
      // If we already have enough events, don't fetch again
      if (dataFetchedRef.current && relatedEvents.length >= minResults) return;
      
      try {
        loadingRef.current = true;
        setLoading(true);
        
        // Use our new fetchRelatedEvents function
        const events = await fetchRelatedEvents({
          eventType,
          currentEventId,
          userId,
          tags: Array.isArray(tags) ? tags : [],
          startDate,
          minResults
        });
        
        setRelatedEvents(events);
        
        // Mark as fetched
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
