
import { useState, useEffect, useRef } from 'react';
import { Event } from '@/types';
import { supabase } from '@/lib/supabase';
import { useSimilarEvents } from '../events/useSimilarEvents';

interface UseFetchRelatedEventsProps {
  eventType: string;
  currentEventId: string;
  userId?: string; // Add userId parameter to fetch RSVP status
  tags?: string[];
  vibe?: string;
  minResults?: number;
}

export const useFetchRelatedEvents = ({ 
  eventType, 
  currentEventId,
  userId,
  tags,
  vibe,
  minResults = 2 // Set default minimum results to 2
}: UseFetchRelatedEventsProps) => {
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { fetchSimilarEvents } = useSimilarEvents([], []);
  const loadingRef = useRef(false);
  const dataFetchedRef = useRef(false);
  
  useEffect(() => {
    const loadRelatedEvents = async () => {
      // Avoid duplicate fetches
      if (loadingRef.current) return;
      
      // If we already have enough events, don't fetch again
      if (dataFetchedRef.current && relatedEvents.length >= minResults) return;
      
      try {
        loadingRef.current = true;
        setLoading(true);
        
        // First attempt: Fetch events with the same event type
        let query = supabase.from('events').select(`
          *,
          creator:profiles(id, username, avatar_url, email, location, status),
          venues:venue_id(*)
        `)
        .eq('event_type', eventType)
        .neq('id', currentEventId)
        .order('start_time', { ascending: true })
        .limit(8);
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching related events:', error);
        }
        
        let filteredEvents: Event[] = [];
        
        if (data && data.length > 0) {
          const now = new Date();
          
          // Filter to just future events
          filteredEvents = data.filter(event => {
            if (!event.start_time) return false;
            return new Date(event.start_time) > now;
          });
          
          // If we have a userId, fetch RSVP status for each event
          if (userId) {
            console.log(`Fetching RSVP status for user ${userId} for related events`);
            
            // Get all event IDs
            const eventIds = filteredEvents.map(event => event.id);
            
            // Fetch RSVP status for these events for the current user
            const { data: rsvpData, error: rsvpError } = await supabase
              .from('event_rsvps')
              .select('event_id, status')
              .eq('user_id', userId)
              .in('event_id', eventIds);
              
            if (rsvpError) {
              console.error('Error fetching RSVP status for related events:', rsvpError);
            } else if (rsvpData) {
              // Create a map of event ID to RSVP status for quick lookup
              const rsvpMap = new Map();
              rsvpData.forEach(rsvp => {
                rsvpMap.set(rsvp.event_id, rsvp.status);
              });
              
              // Update the events with their RSVP status
              filteredEvents = filteredEvents.map(event => ({
                ...event,
                rsvp_status: rsvpMap.get(event.id) as 'Going' | 'Interested' | undefined
              }));
              
              console.log('RSVP status applied to related events:', 
                filteredEvents.map(e => ({ id: e.id, rsvp: e.rsvp_status })));
            }
          }
        }
        
        // If we don't have enough events, try the fallback fetching similar events
        if (filteredEvents.length < minResults) {
          console.log(`Not enough primary events (${filteredEvents.length}), fetching similar events...`);
          
          // Instead of passing eventType and tags separately, we'll create an array with the eventType
          const eventTypesToSearch = eventType ? [eventType] : [];
          // Pass the array directly to fetchSimilarEvents
          const similarEvents = await fetchSimilarEvents(eventTypesToSearch);
          
          // Filter out the current event
          const additionalEvents = similarEvents.filter(event => event.id !== currentEventId);
          
          // If we have a userId, fetch RSVP status for the additional events
          if (userId && additionalEvents.length > 0) {
            const additionalIds = additionalEvents.map(event => event.id);
            
            const { data: additionalRsvpData, error: additionalRsvpError } = await supabase
              .from('event_rsvps')
              .select('event_id, status')
              .eq('user_id', userId)
              .in('event_id', additionalIds);
              
            if (additionalRsvpError) {
              console.error('Error fetching RSVP status for additional events:', additionalRsvpError);
            } else if (additionalRsvpData) {
              const rsvpMap = new Map();
              additionalRsvpData.forEach(rsvp => {
                rsvpMap.set(rsvp.event_id, rsvp.status);
              });
              
              // Update the additional events with their RSVP status
              for (let i = 0; i < additionalEvents.length; i++) {
                additionalEvents[i].rsvp_status = rsvpMap.get(additionalEvents[i].id) as 'Going' | 'Interested' | undefined;
              }
            }
          }
          
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
    
    if (eventType && currentEventId) {
      loadRelatedEvents();
    } else {
      setLoading(false);
    }
  }, [eventType, currentEventId, userId, minResults]); 
  
  return { relatedEvents, loading };
};
