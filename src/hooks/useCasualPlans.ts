
import { useAuth } from '@/contexts/AuthContext';
import { useCasualPlansQueries } from './casual-plans/useCasualPlansQueries';
import { useCasualPlansMutations } from './casual-plans/useCasualPlansMutations';
import { transformCasualPlansData } from './casual-plans/casualPlansTransformers';

export const useCasualPlans = () => {
  const { user, isAuthenticated } = useAuth();

  // Fetch raw data using manual queries
  const { rawPlans, rawAttendees, profiles, isLoading, error } = useCasualPlansQueries(isAuthenticated);

  // Get mutation functions
  const mutations = useCasualPlansMutations();

  // Transform data when all queries are complete
  const plans = rawPlans && rawAttendees && profiles 
    ? transformCasualPlansData(rawPlans, rawAttendees, profiles, user?.id)
    : [];

  return {
    plans,
    isLoading,
    error,
    ...mutations,
  };
};
