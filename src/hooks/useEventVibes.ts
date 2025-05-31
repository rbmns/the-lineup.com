
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useEventVibes = () => {
  return useQuery({
    queryKey: ['event-vibes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('vibe')
        .not('vibe', 'is', null)
        .not('vibe', 'eq', '');
      
      if (error) throw error;
      
      // Get unique vibes and filter out empty/null values
      const uniqueVibes = Array.from(new Set(
        data?.map(event => event.vibe).filter(Boolean)
      )).sort();
      
      return uniqueVibes || [];
    }
  });
};
