
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';

export const useEventRealTimeSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const searchPattern = `%${query.toLowerCase()}%`;
      
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          venues!events_venue_id_fkey(id, name, city, street, postal_code),
          creator:profiles(id, username, avatar_url, email, location, status, tagline),
          event_rsvps(id, user_id, status)
        `)
        .eq('status', 'published')
        .or(`title.ilike.${searchPattern},description.ilike.${searchPattern},destination.ilike.${searchPattern},event_category.ilike.${searchPattern},tags.ilike.${searchPattern},vibe.ilike.${searchPattern}`)
        .order('start_date', { ascending: true });

      if (error) {
        console.error('Search error:', error);
        return;
      }

      if (data) {
        // Process the data to match Event type structure
        const processedEvents: Event[] = data.map(event => ({
          ...event,
          venues: event.venues ? {
            id: event.venues.id,
            name: event.venues.name,
            city: event.venues.city,
            street: event.venues.street,
            postal_code: event.venues.postal_code
          } : undefined,
          attendees: {
            going: event.event_rsvps?.filter((rsvp: any) => rsvp.status === 'Going').length || 0,
            interested: event.event_rsvps?.filter((rsvp: any) => rsvp.status === 'Interested').length || 0
          }
        }));

        setSearchResults(processedEvents);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    performSearch(searchQuery);
  }, [searchQuery, performSearch]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching
  };
};
