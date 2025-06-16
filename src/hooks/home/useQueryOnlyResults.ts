
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { filterUpcomingEvents } from '@/utils/dateUtils';
import { processEventData } from './useEventDataProcessor';

export const useQueryOnlyResults = (setQueryOnlyResults: (results: Event[] | null) => void) => {
  // Fetch results that only match the query text
  const fetchQueryOnlyResults = async (query: string) => {
    try {
      if (!query || query.trim() === '') {
        setQueryOnlyResults(null);
        return;
      }

      const dutchToEnglish: {[key: string]: string} = {
        'lente': 'spring',
        'zomer': 'summer',
        'herfst': 'autumn',
        'winter': 'winter',
        'feest': 'party',
        'strand': 'beach',
        'muziek': 'music'
      };
      
      let translatedQuery = query;
      Object.entries(dutchToEnglish).forEach(([dutch, english]) => {
        const regex = new RegExp(`\\b${dutch}\\b`, 'gi');
        translatedQuery = translatedQuery.replace(regex, english);
      });
      
      let orCondition = `title.ilike.%${query}%,description.ilike.%${query}%,destination.ilike.%${query}%,event_category.ilike.%${query}%,tags.ilike.%${query}%,vibe.ilike.%${query}%`;

      if (query.toLowerCase() !== translatedQuery.toLowerCase()) {
        orCondition += `,title.ilike.%${translatedQuery}%,description.ilike.%${translatedQuery}%,destination.ilike.%${translatedQuery}%,event_category.ilike.%${translatedQuery}%,tags.ilike.%${translatedQuery}%,vibe.ilike.%${translatedQuery}%`;
      }
      
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          creator:profiles(id, username, avatar_url, email, location, location_category, status, tagline),
          venues:venue_id(*),
          event_rsvps(id, user_id, status)
        `)
        .or(orCondition)
        .order('start_date', { ascending: true })
        .order('start_time', { ascending: true });
        
      if (error) {
        console.error('Query-only search error:', error);
        throw error;
      }
      
      if (data && data.length > 0) {
        const formattedEvents: Event[] = data.map(processEventData);
        
        const upcomingEvents = filterUpcomingEvents(formattedEvents);
        setQueryOnlyResults(upcomingEvents);
      } else {
        setQueryOnlyResults([]);
      }
    } catch (error) {
      console.error('Error in fetchQueryOnlyResults:', error);
      setQueryOnlyResults([]);
    }
  };

  return {
    fetchQueryOnlyResults
  };
};
