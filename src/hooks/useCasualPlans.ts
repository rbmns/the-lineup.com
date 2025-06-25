
import { useCasualPlansMutations } from '@/hooks/casual-plans/useCasualPlansMutations';
import { useCasualPlansQuery } from '@/hooks/casual-plans/useCasualPlansQuery';

export const useCasualPlans = () => {
  const { plans, isLoading, error } = useCasualPlansQuery();
  const { 
    createPlan, 
    joinPlan, 
    leavePlan, 
    rsvpToPlan, 
    isCreating, 
    loadingPlanId 
  } = useCasualPlansMutations();

  return {
    plans,
    isLoading,
    error,
    createPlan,
    joinPlan,
    leavePlan,
    rsvpToPlan,
    isCreating,
    loadingPlanId
  };
};
