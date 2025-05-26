
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { CreateCasualPlanData } from '@/types/casual-plans';
import { useCasualPlanRsvp } from './useCasualPlanRsvp';

export const useCasualPlansMutations = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const { handleJoinPlan, handleLeavePlan, loadingPlanId } = useCasualPlanRsvp();

  const createPlan = async (planData: CreateCasualPlanData) => {
    if (!user) throw new Error('User not authenticated');
    
    setIsCreating(true);
    console.log('Creating casual plan:', planData);
    
    try {
      const { error } = await supabase
        .from('casual_plans')
        .insert({
          ...planData,
          creator_id: user.id
        });

      if (error) throw error;

      // Invalidate queries to refresh the plans list
      queryClient.invalidateQueries({ queryKey: ['casual-plans'] });
      console.log('Casual plan created successfully');
    } catch (error) {
      console.error('Error creating casual plan:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const joinPlan = async (planId: string) => {
    if (!user) {
      console.log('User not authenticated for joining plan');
      return false;
    }

    console.log(`Attempting to join plan: ${planId}`);
    const success = await handleJoinPlan(planId, user.id);
    
    if (success) {
      // Invalidate queries to refresh the plans list
      queryClient.invalidateQueries({ queryKey: ['casual-plans'] });
    }
    
    return success;
  };

  const leavePlan = async (planId: string) => {
    if (!user) {
      console.log('User not authenticated for leaving plan');
      return false;
    }

    console.log(`Attempting to leave plan: ${planId}`);
    const success = await handleLeavePlan(planId, user.id);
    
    if (success) {
      // Invalidate queries to refresh the plans list
      queryClient.invalidateQueries({ queryKey: ['casual-plans'] });
    }
    
    return success;
  };

  return {
    createPlan,
    joinPlan,
    leavePlan,
    isCreating,
    isJoining: loadingPlanId,
    isLeaving: loadingPlanId
  };
};
