
import { useAuth } from '@/contexts/AuthContext';
import { useCasualPlansQueries } from './casual-plans/useCasualPlansQueries';
import { useCasualPlansMutations } from './casual-plans/useCasualPlansMutations';
import { transformCasualPlansData } from './casual-plans/casualPlansTransformers';

export const useCasualPlans = () => {
  const { user, isAuthenticated } = useAuth();

  // Fetch raw data - now works for both authenticated and non-authenticated users
  const { rawPlans, rawAttendees, profiles, isLoading, error } = useCasualPlansQueries(true);

  // Get mutation functions (only work for authenticated users)
  const mutations = useCasualPlansMutations();

  // Transform data when all queries are complete
  const plans = rawPlans && rawAttendees && profiles 
    ? transformCasualPlansData(rawPlans, rawAttendees, profiles, user?.id)
    : [];

  // Add placeholder functions for markInterested and unmarkInterested
  const markInterested = async (planId: string) => {
    if (!user) throw new Error('User not authenticated');
    console.log('markInterested not implemented yet for plan:', planId);
    // TODO: Implement once casual_plan_interests table is created
  };

  const unmarkInterested = async (planId: string) => {
    if (!user) throw new Error('User not authenticated');
    console.log('unmarkInterested not implemented yet for plan:', planId);
    // TODO: Implement once casual_plan_interests table is created
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
