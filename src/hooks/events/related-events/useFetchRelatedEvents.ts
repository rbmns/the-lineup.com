
import { useState, useEffect, useRef } from 'react';
import { Event } from '@/types';
import { useSimilarEvents } from '../useSimilarEvents';
import { UseFetchRelatedEventsProps, RelatedEventsState } from './types';
import { fetchPrimaryRelatedEvents } from './fetchPrimaryRelatedEvents';
import { fetchSecondaryRelatedEvents } from './fetchSecondaryRelatedEvents';

export const useFetchRelatedEvents = ({ 
  eventType, 
  currentEventId,
  userId,
  tags = [],
  vibe,
  minResults = 2,
  startDate,
  dateDifference = 21
}: UseFetchRelatedEventsProps): RelatedEventsState => {
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { fetchSimilarEvents } = useSimilarEvents([], []);
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
        
        // First strategy: Fetch events with the same event type and around the same time
        // This is our primary focus - same type, similar time frame
        const filteredEvents = await fetchPrimaryRelatedEvents(
          eventType,
          currentEventId,
          userId,
          startDate
        );
        
        // If we don't have enough events from the first strategy, try more aggressive fallbacks
        if (filteredEvents.length < minResults) {
          console.log(`Not enough primary events (${filteredEvents.length}), trying second strategy...`);
          
          // Second strategy: Fetch events regardless of type but try to filter by tags if available
          const additionalEvents = await fetchSecondaryRelatedEvents(
            currentEventId,
            tags,
            userId,
            startDate
          );
          
          if (additionalEvents.length > 0) {
            // Combine the events, prioritizing the direct type matches
            const combinedEvents = [...filteredEvents];
            
            // Add additional events until we reach the minimum
            for (const event of additionalEvents) {
              if (!combinedEvents.some(e => e.id === event.id)) {
                combinedEvents.push(event);
                if (combinedEvents.length >= minResults) break;
              }
            }
            
            setRelatedEvents(combinedEvents);
          } else {
            // Last resort - try similar events by event type only
            console.log('Trying similar events as last resort...');
            try {
              const rawSimilarEvents = await fetchSimilarEvents([eventType]);
              
              // Filter out the current event and past events and add attendees
              const now = new Date();
              const similarEvents = rawSimilarEvents
                .filter(event => {
                  if (event.id === currentEventId) return false;
                  if (!event.start_time) return false;
                  return new Date(event.start_time) > now;
                })
                .map(event => ({
                  ...event,
                  attendees: {
                    going: 0,
                    interested: 0
                  }
                }));
              
              // Combine all events we've found
              const combinedEvents = [...filteredEvents];
              
              // Add additional events until we reach the minimum
              for (const event of similarEvents) {
                if (!combinedEvents.some(e => e.id === event.id)) {
                  combinedEvents.push(event);
                  if (combinedEvents.length >= minResults) break;
                }
              }
              
              setRelatedEvents(combinedEvents);
            } catch (error) {
              console.error('Error fetching similar events:', error);
              setRelatedEvents(filteredEvents);
            }
          }
        } else {
          setRelatedEvents(filteredEvents);
        }
        
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
  }, [eventType, currentEventId, userId, minResults, tags, vibe, fetchSimilarEvents, startDate, dateDifference]); 
  
  return { relatedEvents, loading };
};
