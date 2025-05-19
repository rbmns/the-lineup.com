
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { filterUpcomingEvents } from '@/utils/dateUtils';
import { processEventData } from './useEventDataProcessor';

export const useQueryOnlyResults = (setQueryOnlyResults: (results: Event[] | null) => void) => {
  // Fetch results that only match the query text
  const fetchQueryOnlyResults = async (query: string) => {
    try {
      const dutchToEnglish: {[key: string]: string} = {
        'lente': 'spring',
        'zomer': 'summer',
        'herfst': 'autumn',
        'winter': 'winter',
        'feest': 'party',
        'strand': 'beach',
        'muziek': 'music'
      };
      
      let enhancedQuery = query;
      Object.entries(dutchToEnglish).forEach(([dutch, english]) => {
        if (query.toLowerCase().includes(dutch)) {
          enhancedQuery += ` OR ${english}`;
        }
      });
      
      const searchTerms = query.split(' ').filter(term => term.length > 2);
      
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          creator:profiles(id, username, avatar_url, email, location, location_category, status, tagline),
          venues:venue_id(*),
          event_rsvps(id, user_id, status)
        `)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%,event_type.ilike.%${query}%,tags.cs.{${enhancedQuery}}`)
        .order('start_time', { ascending: true });
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const formattedEvents: Event[] = data.map(processEventData);
        
        const upcomingEvents = filterUpcomingEvents(formattedEvents);
        setQueryOnlyResults(upcomingEvents);
      } else {
        setQueryOnlyResults([]);
      }
    } catch (error) {
      console.error('Query-only search error:', error);
    }
  };

  return {
    fetchQueryOnlyResults
  };
};
