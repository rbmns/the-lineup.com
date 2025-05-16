
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';

/**
 * Hook to fetch and manage events for a user profile
 */
export const useProfileEvents = (profileId: string | null) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    if (profileId) {
      fetchEvents(profileId);
    }
  }, [profileId]);

  const fetchEvents = async (profileId: string) => {
    setLoadingEvents(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('creator_id', profileId)
        .order('start_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEvents(data || []);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoadingEvents(false);
    }
  };

  return {
    events,
    loadingEvents,
    fetchEvents
  };
};
