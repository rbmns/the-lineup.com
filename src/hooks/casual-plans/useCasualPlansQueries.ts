
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCasualPlansQueries = (includePublicData: boolean = true) => {
  // Fetch casual plans - now available to everyone
  const { data: rawPlans, isLoading: plansLoading, error: plansError } = useQuery({
    queryKey: ['casual-plans-raw'],
    queryFn: async () => {
      if (!includePublicData) {
        return [];
      }

      console.log('Fetching casual plans...');
      
      const { data: plansData, error: plansError } = await supabase
        .from('casual_plans')
        .select('*')
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (plansError) {
        console.error('Error fetching plans:', plansError);
        throw plansError;
      }

      console.log('Raw plans data:', plansData);
      return plansData || [];
    },
    enabled: includePublicData,
  });

  // Fetch casual plan attendees - now available to everyone
  const { data: rawAttendees, isLoading: attendeesLoading } = useQuery({
    queryKey: ['casual-plan-attendees'],
    queryFn: async () => {
      if (!includePublicData || !rawPlans?.length) {
        return [];
      }

      console.log('Fetching attendees...');
      
      const planIds = rawPlans.map(plan => plan.id);
      
      const { data: attendeesData, error: attendeesError } = await supabase
        .from('casual_plan_attendees')
        .select('*')
        .in('plan_id', planIds);

      if (attendeesError) {
        console.error('Error fetching attendees:', attendeesError);
        throw attendeesError;
      }

      console.log('Raw attendees data:', attendeesData);
      return attendeesData || [];
    },
    enabled: includePublicData && !!rawPlans?.length,
  });

  // Fetch profiles for all users - now available to everyone
  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ['casual-plans-profiles', rawPlans, rawAttendees],
    queryFn: async () => {
      if (!includePublicData || (!rawPlans?.length && !rawAttendees?.length)) {
        return [];
      }

      console.log('Fetching profiles...');
      
      // Get unique user IDs from creators and attendees
      const userIds = new Set<string>();
      
      rawPlans?.forEach(plan => {
        if (plan.creator_id) userIds.add(plan.creator_id);
      });
      
      rawAttendees?.forEach(attendee => {
        if (attendee.user_id) userIds.add(attendee.user_id);
      });

      if (userIds.size === 0) {
        return [];
      }

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', Array.from(userIds));

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      console.log('Profiles data:', profilesData);
      return profilesData || [];
    },
    enabled: includePublicData && (!!rawPlans?.length || !!rawAttendees?.length),
  });

  return {
    rawPlans,
    rawAttendees,
    profiles,
    isLoading: plansLoading || attendeesLoading || profilesLoading,
    error: plansError,
  };
};
