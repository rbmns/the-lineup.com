
import { useAuth } from '@/contexts/AuthContext';
import { useCasualPlansQueries } from './casual-plans/useCasualPlansQueries';
import { useCasualPlansMutations } from './casual-plans/useCasualPlansMutations';
import { transformCasualPlansData } from './casual-plans/casualPlansTransformers';
import { supabase } from '@/lib/supabase';

export const useCasualPlans = () => {
  const { user, isAuthenticated } = useAuth();

  // Fetch raw data - now works for both authenticated and non-authenticated users
  const { rawPlans, rawAttendees, rawInterests, profiles, isLoading, error, refetch } = useCasualPlansQueries(true);

  // Get mutation functions (only work for authenticated users)
  const mutations = useCasualPlansMutations();

  // Transform data when all queries are complete
  const plans = rawPlans && rawAttendees && profiles 
    ? transformCasualPlansData(rawPlans, rawAttendees, profiles, user?.id, rawInterests)
    : [];

  // Implement actual interest functionality with proper toggle behavior
  const markInterested = async (planId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    console.log('Marking as interested for plan:', planId);
    
    try {
      // Check if user is already interested
      const { data: existingInterest } = await supabase
        .from('casual_plan_interests')
        .select('id')
        .eq('plan_id', planId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingInterest) {
        // User is already interested, so unmark instead
        await unmarkInterested(planId);
        return;
      }

      // User is not interested yet, so mark as interested
      const { error } = await supabase
        .from('casual_plan_interests')
        .insert({
          plan_id: planId,
          user_id: user.id
        });

      if (error) throw error;
      
      console.log('Successfully marked as interested');
      
      // Refresh the data to show updated state
      await refetch();
    } catch (error) {
      console.error('Error marking as interested:', error);
      throw error;
    }
  };

  const unmarkInterested = async (planId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    console.log('Unmarking interest for plan:', planId);
    
    try {
      const { error } = await supabase
        .from('casual_plan_interests')
        .delete()
        .eq('plan_id', planId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      console.log('Successfully unmarked interest');
      
      // Refresh the data to show updated state
      await refetch();
    } catch (error) {
      console.error('Error unmarking interest:', error);
      throw error;
    }
  };

  return {
    plans,
    isLoading,
    error,
    markInterested,
    unmarkInterested,
    ...mutations,
  };
};
