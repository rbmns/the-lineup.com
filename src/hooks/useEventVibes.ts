
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useEventVibes = () => {
  return useQuery({
    queryKey: ['event-vibes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_vibe')
        .select('name')
        .order('name');
      
      if (error) throw error;
      return data?.map(vibe => vibe.name).filter(Boolean) || [];
    }
  });
};
