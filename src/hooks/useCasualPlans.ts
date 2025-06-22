
import { useAuth } from '@/contexts/AuthContext';
import { useCasualPlansQueries } from './casual-plans/useCasualPlansQueries';
import { useCasualPlansMutations } from './casual-plans/useCasualPlansMutations';
import { transformCasualPlansData } from './casual-plans/casualPlansTransformers';

export const useCasualPlans = () => {
  const { user, isAuthenticated } = useAuth();

  // Fetch raw data - only for authenticated users
  const { rawPlans, rawRsvps, profiles, isLoading, error } = useCasualPlansQueries(isAuthenticated);

  // Get mutation functions (only work for authenticated users)
  const mutations = useCasualPlansMutations();

  // Transform data when all queries are complete
  const plans = rawPlans && rawRsvps && profiles 
    ? transformCasualPlansData(rawPlans, rawRsvps, profiles, user?.id)
    : [];

  return {
    plans,
    isLoading,
    error,
    ...mutations,
  };
};
