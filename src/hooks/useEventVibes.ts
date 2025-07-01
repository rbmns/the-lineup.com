
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useEventVibes = () => {
  const query = useQuery({
    queryKey: ['event-vibes'],
    queryFn: async () => {
      console.log('Fetching event vibes from event_vibe table...');
      const { data, error } = await supabase
        .from('event_vibe')
        .select('name')
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching event vibes:', error.message);
        throw new Error(`Failed to fetch event vibes: ${error.message}`);
      }
      
      console.log('Successfully fetched event vibes data:', data);

      const vibes = data?.map(item => item.name).filter(Boolean) as string[] || [];

      if (vibes.length === 0) {
        console.warn('No event vibes found in the event_vibe table. The table might be empty.');
        // Return default vibes if none found in database
        return ['party', 'chill', 'wellness', 'active', 'social', 'creative'];
      }
      
      return vibes;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    ...query,
    vibes: query.data || [],
  };
};
