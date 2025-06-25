
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CasualPlan } from '@/types/casual-plans';

export const useCasualPlansQuery = () => {
  const { user, isAuthenticated } = useAuth();

  const { data: plans, isLoading, error } = useQuery({
    queryKey: ['casual-plans'],
    queryFn: async (): Promise<CasualPlan[]> => {
      console.log('Fetching casual plans...');
      
      if (!isAuthenticated) {
        console.log('User not authenticated, returning empty array');
        return [];
      }

      // Get current date for filtering
      const today = new Date().toISOString().split('T')[0];
      
      const { data: plansData, error: plansError } = await supabase
        .from('casual_plans')
        .select(`
          *,
          creator_profile:profiles!creator_id(
            id,
            username,
            avatar_url
          )
        `)
        .gte('date', today)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (plansError) {
        console.error('Error fetching casual plans:', plansError);
        throw plansError;
      }

      console.log('Raw casual plans data:', plansData);

      if (!plansData || plansData.length === 0) {
        console.log('No casual plans found');
        return [];
      }

      // Get all RSVPs for these plans
      const planIds = plansData.map(plan => plan.id);
      
      const { data: rsvpsData, error: rsvpsError } = await supabase
        .from('casual_plan_rsvps')
        .select('*')
        .in('plan_id', planIds);

      if (rsvpsError) {
        console.error('Error fetching RSVPs:', rsvpsError);
        // Continue without RSVPs rather than failing
      }

      console.log('RSVPs data:', rsvpsData);

      // Process the plans with RSVP data
      const processedPlans: CasualPlan[] = plansData.map(plan => {
        const planRsvps = rsvpsData?.filter(rsvp => rsvp.plan_id === plan.id) || [];
        const userRsvp = planRsvps.find(rsvp => rsvp.user_id === user?.id);

        const goingCount = planRsvps.filter(rsvp => rsvp.status === 'Going').length;
        const interestedCount = planRsvps.filter(rsvp => rsvp.status === 'Interested').length;

        return {
          ...plan,
          rsvp_status: userRsvp?.status as 'Going' | 'Interested' | null || null,
          going_count: goingCount,
          interested_count: interestedCount,
          attendee_count: goingCount + interestedCount,
          creator_profile: plan.creator_profile || undefined
        };
      });

      console.log('Processed casual plans:', processedPlans);
      return processedPlans;
    },
    enabled: isAuthenticated,
  });

  return {
    plans: plans || [],
    isLoading,
    error
  };
};
