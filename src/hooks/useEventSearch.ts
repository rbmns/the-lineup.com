
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { safeGet } from '@/utils/supabaseTypeUtils';

type EventSearchFilter = {
  eventCategory?: string | null;
  venues?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  userFilter?: 'going' | 'interested' | 'created' | '' | null;
  tags?: string[] | null;
  vibe?: string | null;
};

export const useEventSearch = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState<EventSearchFilter>({
    eventCategory: null,
    venues: null,
    startDate: null,
    endDate: null,
    userFilter: null,
    tags: null,
    vibe: null,
  });
  const { user } = useAuth();

  const processEventData = (event: any): Event => {
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      start_time: event.start_time,
      end_time: event.end_time,
      created_at: event.created_at || '',
      updated_at: event.updated_at || '',
      venues: {
        id: safeGet(event.venue_id, 'id', ''),
        name: safeGet(event.venue_id, 'name', 'Unknown venue'),
        city: safeGet(event.venue_id, 'city', ''),
        street: safeGet(event.venue_id, 'street', ''),
        postal_code: safeGet(event.venue_id, 'postal_code', ''),
      },
      venue_id: safeGet(event.venue_id, 'id', ''),
      event_category: event.event_category,
      creator: event.creator,
      image_urls: event.image_urls || [],
      fee: event.fee,
      tags: event.tags,
      vibe: event.vibe,
      attendees: {
        going: event.event_rsvps?.filter((rsvp: any) => rsvp.status === 'Going').length || 0,
        interested: event.event_rsvps?.filter((rsvp: any) => rsvp.status === 'Interested').length || 0
      },
      coordinates: event.coordinates,
      created_by: event.created_by,
    };
  };

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*, venue_id(id, name, city, street)')
        .order('start_time', { ascending: true });

      if (error) {
        throw error;
      }

      if (data) {
        const formattedEvents = data.map(processEventData) as Event[];

        setEvents(formattedEvents);
        applyFilters(formattedEvents, filters);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFilters = useCallback((eventsToFilter: Event[], currentFilters: EventSearchFilter) => {
    let filtered = [...eventsToFilter];

    if (currentFilters.eventCategory) {
      filtered = filtered.filter(event => 
        event.event_category === currentFilters.eventCategory
      );
    }

    if (currentFilters.venues) {
      filtered = filtered.filter(event => 
        event.venue_id === currentFilters.venues
      );
    }

    if (currentFilters.startDate) {
      filtered = filtered.filter(event => {
        const eventDate = typeof event.start_time === 'string' 
          ? new Date(event.start_time) 
          : event.start_time;
        return eventDate >= currentFilters.startDate!;
      });
    }

    if (currentFilters.endDate) {
      filtered = filtered.filter(event => {
        const eventDate = typeof event.start_time === 'string' 
          ? new Date(event.start_time) 
          : event.start_time;
        return eventDate <= currentFilters.endDate!;
      });
    }

    if (currentFilters.tags && currentFilters.tags.length > 0) {
      filtered = filtered.filter(event => {
        if (!event.tags) return false;
        const eventTags = Array.isArray(event.tags) 
          ? event.tags 
          : typeof event.tags === 'string' 
            ? [event.tags] 
            : [];
        return currentFilters.tags!.some(tag => eventTags.includes(tag));
      });
    }

    if (currentFilters.vibe) {
      filtered = filtered.filter(event => 
        event.vibe === currentFilters.vibe
      );
    }

    if (user && currentFilters.userFilter) {
      if (currentFilters.userFilter === 'going') {
        filtered = filtered.filter(event => 
          event.rsvp_status === 'Going'
        );
      } else if (currentFilters.userFilter === 'interested') {
        filtered = filtered.filter(event => 
          event.rsvp_status === 'Interested'
        );
      } else if (currentFilters.userFilter === 'created') {
        filtered = filtered.filter(event => 
          event.creator?.id === user.id
        );
      }
    }

    setFilteredEvents(filtered);
  }, [user]);

  const updateFilters = useCallback((newFilters: Partial<EventSearchFilter>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    applyFilters(events, updatedFilters);
  }, [events, filters, applyFilters]);

  const fetchSimilarEvents = useCallback(async (searchQuery: string, eventCategory?: string, tags?: string[]) => {
    setLoading(true);
    try {
      // Build the query to find similar events based on various parameters
      let query = supabase
        .from('events')
        .select('*, venue_id(id, name, city, street)');
      
      // If we have an event category, prioritize events with the same category
      if (eventCategory) {
        query = query.eq('event_category', eventCategory);
      }
      
      // If we have tags, try to find events with matching tags
      if (tags && tags.length > 0) {
        // This is a simplified approach - for more complex tag matching
        // you might need a more sophisticated query strategy
        query = query.or(`tags.cs.{${tags.join(',')}}}`);
      }
      
      // Limit the number of results and order by start time
      const { data, error } = await query
        .order('start_time', { ascending: true })
        .limit(12);

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        return data.map(processEventData) as Event[];
      }
      
      // If no matches found with the specific criteria, fallback to a broader search
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('events')
        .select('*, venue_id(id, name, city, street)')
        .order('start_time', { ascending: true })
        .limit(6);
        
      if (fallbackError) {
        throw fallbackError;
      }
      
      if (fallbackData) {
        return fallbackData.map(processEventData) as Event[];
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching similar events:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user, fetchEvents]);

  return { 
    events: filteredEvents, 
    loading, 
    filters,
    updateFilters,
    refreshEvents: fetchEvents,
    fetchSimilarEvents
  };
};
