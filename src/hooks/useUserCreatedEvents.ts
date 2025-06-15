
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Event } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { processEventsData } from '@/utils/eventProcessorUtils';

export const useUserCreatedEvents = () => {
  const { user } = useAuth();

  return useQuery<Event[], Error>({
    queryKey: ['user-created-events', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          venues:venue_id(*)
        `)
        .eq('creator', user.id)
        .order('start_date', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }
      
      return processEventsData(data, user.id);
    },
    enabled: !!user?.id,
  });
};
