
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
    select: (events) => {
      if (!events) return [];
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Compare with start of day

      const upcomingEvents = events.filter(event => new Date(event.start_date) >= now);
      const pastEvents = events.filter(event => new Date(event.start_date) < now);
      
      // Upcoming events are already sorted ascending by start_date from the query.
      
      // Sort past events by start_date descending (most recent first)
      pastEvents.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());

      return [...upcomingEvents, ...pastEvents];
    },
  });
};
