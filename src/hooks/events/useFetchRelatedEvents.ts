
import { useState, useEffect, useRef } from 'react';
import { Event } from '@/types';
import { supabase } from '@/lib/supabase';
import { useSimilarEvents } from '../events/useSimilarEvents';

interface UseFetchRelatedEventsProps {
  eventType: string;
  currentEventId: string;
  userId?: string;
  tags?: string[];
  vibe?: string;
  minResults?: number;
  startDate?: string;
}

export const useFetchRelatedEvents = ({ 
  eventType, 
  currentEventId,
  userId,
  tags,
  vibe,
  minResults = 2
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
        
        // Get current date to filter out past events
        const today = new Date().toISOString().split('T')[0];
        
        // First strategy: Fetch events with the same event type
        let query = supabase.from('events').select(`
          *,
          creator:profiles(id, username, avatar_url, email, location, status),
          venues:venue_id(*)
        `)
        .eq('event_type', eventType)
        .neq('id', currentEventId)
        .gte('start_date', today) // Only future events
        .order('start_time', { ascending: true })
        .limit(8);
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching related events:', error);
        }
        
        let filteredEvents: Event[] = [];
        
        if (data && data.length > 0) {
          // Filter to just future events
          filteredEvents = data;
          
          // If we have a userId, fetch RSVP status for each event
          if (userId) {
            console.log(`Fetching RSVP status for user ${userId} for related events`);
            
            // Get all event IDs
            const eventIds = filteredEvents.map(event => event.id);
            
            // Fetch RSVP status for these events for the current user
            if (eventIds.length > 0) {
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
        }
        
        // If we don't have enough events from the first strategy, try more aggressive fallbacks
        if (filteredEvents.length < minResults) {
          console.log(`Not enough primary events (${filteredEvents.length}), trying second strategy...`);
          
          // Second strategy: Fetch events regardless of type but try to filter by tags if available
          let fallbackQuery = supabase.from('events').select(`
            *,
            creator:profiles(id, username, avatar_url, email, location, status),
            venues:venue_id(*)
          `)
          .neq('id', currentEventId)
          .gte('start_date', today) // Only future events
          .order('start_time', { ascending: true })
          .limit(10);
          
          const { data: fallbackData, error: fallbackError } = await fallbackQuery;
          
          if (!fallbackError && fallbackData && fallbackData.length > 0) {
            let additionalEvents = fallbackData;
            
            // If we have tags, prefer events with matching tags
            if (tags && tags.length > 0) {
              additionalEvents = [...additionalEvents].sort((a, b) => {
                // Calculate tag match score
                const aTagsStr = String(a.tags || '');
                const bTagsStr = String(b.tags || '');
                
                const aMatchCount = tags.filter(tag => aTagsStr.includes(tag)).length;
                const bMatchCount = tags.filter(tag => bTagsStr.includes(tag)).length;
                
                // Sort by match count (descending)
                return bMatchCount - aMatchCount;
              });
            }
            
            // Fetch RSVP status for additional events if we have a userId
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
                additionalEvents = additionalEvents.map(event => ({
                  ...event,
                  rsvp_status: rsvpMap.get(event.id) as 'Going' | 'Interested' | undefined
                }));
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
            // Last resort - try similar events
            console.log('Trying similar events as last resort...');
            const similarEvents = await fetchSimilarEvents([eventType]);
          
            // Filter out the current event and past events
            const now = new Date();
            const additionalEvents = similarEvents.filter(event => {
              if (event.id === currentEventId) return false;
              if (!event.start_time) return false;
              return new Date(event.start_time) > now;
            });
            
            // Add RSVP status if available
            if (userId && additionalEvents.length > 0) {
              const additionalIds = additionalEvents.map(event => event.id);
              
              const { data: additionalRsvpData, error: additionalRsvpError } = await supabase
                .from('event_rsvps')
                .select('event_id, status')
                .eq('user_id', userId)
                .in('event_id', additionalIds);
                
              if (additionalRsvpError) {
                console.error('Error fetching RSVP status for similar events:', additionalRsvpError);
              } else if (additionalRsvpData) {
                const rsvpMap = new Map();
                additionalRsvpData.forEach(rsvp => {
                  rsvpMap.set(rsvp.event_id, rsvp.status);
                });
                
                // Update the events with their RSVP status
                for (let i = 0; i < additionalEvents.length; i++) {
                  additionalEvents[i].rsvp_status = rsvpMap.get(additionalEvents[i].id) as 'Going' | 'Interested' | undefined;
                }
              }
            }
            
            // Combine all events we've found
            const combinedEvents = [...filteredEvents];
            
            // Add additional events until we reach the minimum
            for (const event of additionalEvents) {
              if (!combinedEvents.some(e => e.id === event.id)) {
                combinedEvents.push(event);
                if (combinedEvents.length >= minResults) break;
              }
            }
            
            setRelatedEvents(combinedEvents);
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
  }, [eventType, currentEventId, userId, minResults, tags, vibe, fetchSimilarEvents]); 
  
  return { relatedEvents, loading };
};
