
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
      
      // Get current date for filtering
      const today = new Date().toISOString().split('T')[0];
      
      // First, fetch the casual plans - now for ALL users, not just authenticated
      const { data: plansData, error: plansError } = await supabase
        .from('casual_plans')
        .select('*')
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

      // Get unique creator IDs
      const creatorIds = [...new Set(plansData.map(plan => plan.creator_id))];
      
      // Fetch creator profiles separately
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', creatorIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        // Continue without profiles rather than failing
      }

      console.log('Creator profiles data:', profilesData);

      // Get all RSVPs for these plans (only if authenticated)
      let rsvpsData = null;
      if (isAuthenticated) {
        const planIds = plansData.map(plan => plan.id);
        
        const { data: rsvpResults, error: rsvpsError } = await supabase
          .from('casual_plan_rsvps')
          .select('*')
          .in('plan_id', planIds);

        if (rsvpsError) {
          console.error('Error fetching RSVPs:', rsvpsError);
          // Continue without RSVPs rather than failing
        }

        rsvpsData = rsvpResults;
      }

      console.log('RSVPs data:', rsvpsData);

      // Create a map of profiles for quick lookup
      const profilesMap = new Map(
        (profilesData || []).map(profile => [profile.id, profile])
      );

      // Process the plans with RSVP data and creator profiles
      const processedPlans: CasualPlan[] = plansData.map(plan => {
        const planRsvps = rsvpsData?.filter(rsvp => rsvp.plan_id === plan.id) || [];
        const userRsvp = planRsvps.find(rsvp => rsvp.user_id === user?.id);

        const goingCount = planRsvps.filter(rsvp => rsvp.status === 'Going').length;
        const interestedCount = planRsvps.filter(rsvp => rsvp.status === 'Interested').length;

        // Get creator profile from the map
        const creatorProfile = profilesMap.get(plan.creator_id);

        return {
          ...plan,
          rsvp_status: userRsvp?.status as 'Going' | 'Interested' | null || null,
          going_count: goingCount,
          interested_count: interestedCount,
          attendee_count: goingCount + interestedCount,
          creator_profile: creatorProfile ? {
            id: creatorProfile.id,
            username: creatorProfile.username,
            avatar_url: creatorProfile.avatar_url
          } : undefined
        };
      });

      console.log('Processed casual plans:', processedPlans);
      return processedPlans;
    },
    // Remove the enabled condition so it fetches for all users
  });

  return {
    plans: plans || [],
    isLoading,
    error
  };
};
