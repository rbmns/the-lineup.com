
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useEventVibes = () => {
  return useQuery({
    queryKey: ['event-vibes'],
    queryFn: async () => {
      console.log('Fetching vibes from database...');
      
      const { data, error } = await supabase
        .from('event_vibe')
        .select('name')
        .order('name');
      
      if (error) {
        console.error('Error fetching vibes:', error);
        throw error;
      }
      
      const vibes = data?.map(vibe => vibe.name).filter(Boolean) || [];
      console.log('Fetched vibes:', vibes);
      
      return vibes;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3
  });
};
