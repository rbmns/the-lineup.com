
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
        .order('start_datetime', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }
      
      return processEventsData(data, user.id);
    },
    enabled: !!user?.id,
    select: (events) => {
      if (!events) return [];
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Compare with start of day

      const upcomingEvents = events.filter(event => new Date(event.start_datetime) >= now);
      const pastEvents = events.filter(event => new Date(event.start_datetime) < now);
      
      // Upcoming events are already sorted ascending by start_datetime from the query.
      
      // Sort past events by start_datetime descending (most recent first)
      pastEvents.sort((a, b) => new Date(b.start_datetime).getTime() - new Date(a.start_datetime).getTime());

      return [...upcomingEvents, ...pastEvents];
    },
  });
};
