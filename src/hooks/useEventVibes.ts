
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useEventVibes = () => {
  return useQuery({
    queryKey: ['event-vibes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_vibe')
        .select('name')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      const vibes = data?.map(item => item.name).filter(Boolean) as string[];
      
      return vibes || [];
    }
  });
};
