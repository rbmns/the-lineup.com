
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { RawCasualPlanRsvp } from '@/types/casual-plans';

export const useCasualPlansQueries = (includePublicData: boolean = true) => {
  const { user, isAuthenticated } = useAuth();

  // Fetch casual plans - only for authenticated users
  const { data: rawPlans, isLoading: plansLoading, error: plansError } = useQuery({
    queryKey: ['casual-plans-raw'],
    queryFn: async () => {
      if (!isAuthenticated || !includePublicData) {
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
    enabled: includePublicData && isAuthenticated,
  });

  // Fetch casual plan RSVPs - only for authenticated users
  const { data: rawRsvps, isLoading: rsvpsLoading } = useQuery({
    queryKey: ['casual-plan-rsvps'],
    queryFn: async (): Promise<RawCasualPlanRsvp[]> => {
      if (!isAuthenticated || !includePublicData || !rawPlans?.length) {
        return [];
      }

      console.log('Fetching RSVPs...');
      
      const planIds = rawPlans.map(plan => plan.id);
      
      const { data: rsvpsData, error: rsvpsError } = await supabase
        .from('casual_plan_rsvps')
        .select('*')
        .in('plan_id', planIds);

      if (rsvpsError) {
        console.error('Error fetching RSVPs:', rsvpsError);
        throw rsvpsError;
      }

      console.log('Raw RSVPs data:', rsvpsData);
      return rsvpsData || [];
    },
    enabled: includePublicData && isAuthenticated && !!rawPlans?.length,
  });

  // Fetch profiles for all users - only for authenticated users
  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ['casual-plans-profiles', rawPlans, rawRsvps],
    queryFn: async () => {
      if (!isAuthenticated || !includePublicData || (!rawPlans?.length && !rawRsvps?.length)) {
        return [];
      }

      console.log('Fetching profiles...');
      
      // Get unique user IDs from creators and RSVP users
      const userIds = new Set<string>();
      
      rawPlans?.forEach(plan => {
        if (plan.creator_id) userIds.add(plan.creator_id);
      });
      
      rawRsvps?.forEach(rsvp => {
        if (rsvp.user_id) userIds.add(rsvp.user_id);
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
    enabled: includePublicData && isAuthenticated && (!!rawPlans?.length || !!rawRsvps?.length),
  });

  return {
    rawPlans,
    rawRsvps,
    profiles,
    isLoading: plansLoading || rsvpsLoading || profilesLoading,
    error: plansError,
  };
};
