
import { useState } from 'react';
import { Event } from '@/types';
import { supabase } from '@/lib/supabase';
import { filterUpcomingEvents } from '@/utils/dateUtils';
import { processEventData } from './useEventDataProcessor';

export const useSimilarResults = (
  setSelectedEventTypes: (types: string[]) => void,
  setSimilarEvents: (results: Event[]) => void
) => {
  // Fetch similar events when no exact matches are found
  const fetchSimilarResults = async (query: string, selectedEventTypes: string[] = []) => {
    if (query.length < 3) {
      try {
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            creator:profiles(id, username, avatar_url, email, location, location_category, status, tagline),
            event_rsvps(id, user_id, status)
          `)
          .limit(6);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          processAndSetSimilarEvents(data, selectedEventTypes);
        }
      } catch (error) {
        console.error('Similar results error (short query):', error);
      }
      return;
    }
    
    try {
      if (query.toLowerCase().includes('beach') || query.toLowerCase().includes('strand')) {
        const { data, error } = await supabase
          .from('events')
          .select(`
            *,
            creator:profiles(id, username, avatar_url, email, location, location_category, status, tagline),
            event_rsvps(id, user_id, status)
          `)
          .or('event_type.ilike.%Beach%,event_type.ilike.%Party%,title.ilike.%Beach%')
          .order('start_time', { ascending: true })
          .limit(6);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          processAndSetSimilarEvents(data, selectedEventTypes);
          return;
        }
      }
      
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          creator:profiles(id, username, avatar_url, email, location, location_category, status, tagline),
          venues:venue_id(*),
          event_rsvps(id, user_id, status)
        `)
        .or(`title.ilike.%${query.substring(0, 3)}%,description.ilike.%${query.substring(0, 3)}%,event_type.ilike.%${query.substring(0, 3)}%`)
        .order('start_time', { ascending: true })
        .limit(6);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        processAndSetSimilarEvents(data, selectedEventTypes);
      } else {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('events')
          .select(`
            *,
            creator:profiles(id, username, avatar_url, email, location, location_category, status, tagline),
            event_rsvps(id, user_id, status)
          `)
          .order('start_time', { ascending: true })
          .limit(6);
          
        if (!fallbackError && fallbackData) {
          processAndSetSimilarEvents(fallbackData, selectedEventTypes);
        }
      }
    } catch (error) {
      console.error('Similar results error:', error);
    }
  };

  // Process and set similar events
  const processAndSetSimilarEvents = (data: any[], selectedEventTypes: string[] = []) => {
    const formattedEvents: Event[] = data.map(processEventData);
    
    const upcomingEvents = filterUpcomingEvents(formattedEvents);
    
    if (upcomingEvents.length > 0) {
      const eventTypes = [...new Set(upcomingEvents.map(event => event.event_type).filter(Boolean))];
      if (eventTypes.length > 0 && selectedEventTypes.length === 0) {
        setSelectedEventTypes(eventTypes);
      }
    }
    
    setSimilarEvents(upcomingEvents);
  };

  return {
    fetchSimilarResults
  };
};
