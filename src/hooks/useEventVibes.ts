
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useEventVibes = () => {
  return useQuery({
    queryKey: ['event-vibes'],
    queryFn: async () => {
      console.log('Fetching event vibes from Supabase...');
      const { data, error } = await supabase
        .from('event_vibe')
        .select('name')
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching event vibes:', error.message);
        throw new Error(`Failed to fetch event vibes. Please check if the 'event_vibe' table exists and has public read access.`);
      }
      
      console.log('Successfully fetched event vibes data:', data);

      const vibes = data?.map(item => item.name).filter(Boolean) as string[] || [];

      if (vibes.length === 0) {
        console.warn('No event vibes found in the database. The "event_vibe" table might be empty.');
      }
      
      return vibes;
    }
  });
};
